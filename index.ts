import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { DirectedStake, directedStakeIdl } from "./directed-stake-idl";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { parse } from 'csv-parse/sync';

// When given a wallet, lookup the director PDA
const findDirectorAddress = (authority: PublicKey) => {
    const [key] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode('director'), authority.toBytes()],
        new PublicKey(directedStakeIdl.address),
    );
    return key;
};

async function getDirected(program: Program<DirectedStake>, authority: PublicKey) {

    const directorAddress = findDirectorAddress(authority);
    const currentDirector = await program.account.director.fetchMultiple([directorAddress]);

    return currentDirector[0]?.stakeTarget;
}

async function setDirected(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    const current = await getDirected(program, authority);

    if(!current) {
        // Create first
        const initDirectorIx = await program.methods
            .initDirector()
            .accounts({
                authority: authority,
                payer: authority,
            })
            .instruction();
        
        await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .preInstructions([initDirectorIx])
            .rpc();
    } else {
        // No init is needed
        await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .rpc();
    }
}

async function setDirectedInstructions(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    const current = await getDirected(program, authority);

    const ix = [];

    if(!current) {
        // Create first
        const initDirectorIx = await program.methods
            .initDirector()
            .accounts({
                authority: authority,
                payer: authority,
            })
            .instruction();

        ix.push(initDirectorIx);
        
        const setDirectorIx = await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .preInstructions([initDirectorIx])
            .instruction();

        ix.push(setDirectorIx);
    } else {
        // No init is needed
        const setDirectorIx = await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .instruction();

        ix.push(setDirectorIx);
    }

    return ix;
}

async function closeDirected(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    await program.methods
    .closeDirector()
    .accounts({
        authority: authority,
        rentDestination: validatorVotePubKey,
    })
    .rpc();
}

async function getFileFromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.blob();
    return await data.text();
  }

  
async function getAllWalletsDirectedStake(program: Program<DirectedStake>) {

    const accounts = await program.account.director.all();

    const directedAccounts = accounts.map((account) => {
        return {
            director: account.publicKey, 
            validator: account.account.stakeTarget
        };
    });

    // Load vSOL holdings from the GitHub repo
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    const url = `https://raw.githubusercontent.com/SolanaVault/holdings-data/main/${yesterday.toISOString().slice(0, 10)}/vSOL-holdings.csv`;
    console.info(`Loading vSOL holdings from: ${url}`);

    const holdings = await getFileFromUrl(url);

    // Parse the CSV file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const holdingsParsed: {
        wallet: string;
        balance: string;
    }[] = parse(holdings, { columns: true });
    const holdingsTotal = holdingsParsed.reduce(
        (a, b) => a + parseFloat(b.balance),
        0,
    );

    // For each wallet, lookup the director account and get which validator each account directs to
    const walletAndDirectorAddress = holdingsParsed.map((h) => {
        return {
            wallet: new PublicKey(h.wallet),
            director: findDirectorAddress(new PublicKey(h.wallet)),
            amount: parseFloat(h.balance),
        };
    }).map((h) => {
        return {
            wallet: new PublicKey(h.wallet),
            validator: directedAccounts.find((d) => d.director.equals(h.director))?.validator,
            amount: h.amount,
        };
    });

    // Return only those wallets to have a validator set
    return walletAndDirectorAddress.filter((a) => a.validator);
}

async function run() {

    // Set up connection & anchor
    const wallet = getKeypairFromEnvironment('WALLET');
    const connection = new Connection(process.env['RPC_URL']!);

    const provider = new anchor.AnchorProvider(connection, new NodeWallet(wallet));
    anchor.setProvider(provider);

    const directedStakeProgram = new Program<DirectedStake>(
        directedStakeIdl as unknown as DirectedStake,
        provider,
    )

    // Load all wallets that are directing stake and which validator they are directing to
    // and the last known stake that they are directing
    const allWalletsDirecting = await getAllWalletsDirectedStake(directedStakeProgram);
    allWalletsDirecting.forEach((entry) => {
        console.log(entry.wallet.toBase58().padEnd(45), entry.validator?.toBase58().padEnd(45), entry.amount / 1e9);
    })

    // Get which validator a specific wallet is directing to
    const current = await getDirected(directedStakeProgram, wallet.publicKey);
    console.log(`Validator directed to by wallet ${wallet.publicKey.toBase58()}: ${current ? current.toBase58() : 'NONE'}`);

    if(!current) {
        // Set to Nordic Staking
        const validatorVotePubKey = new PublicKey('B1w6SZcyvjyp6zEyStcc8u9AxXAh2AbYvNzMmP9rRKE9');
        await setDirected(directedStakeProgram, wallet.publicKey, validatorVotePubKey);
    }
}

run().then().catch((error) => console.error(error));


