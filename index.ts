import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { DirectedStake, directedStakeIdl } from "./directed-stake-idl";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

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

    console.log(currentDirector);
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

async function closeDirected(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    await program.methods
    .closeDirector()
    .accounts({
        authority: authority,
        rentDestination: validatorVotePubKey,
    })
    .rpc();
}

async function run() {

    // Set up connection & anchor
    const wallet = getKeypairFromEnvironment("WALLET");
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    const provider = new anchor.AnchorProvider(connection, new NodeWallet(wallet));
    anchor.setProvider(provider);

    const directedStakeProgram = new Program<DirectedStake>(
        directedStakeIdl as unknown as DirectedStake,
        provider,
    )

    // Check for existing directing
    const current = await getDirected(directedStakeProgram, wallet.publicKey);
    console.log('Current validator:', current ? current.toBase58() : 'NONE');

    if(!current) {
        // Set to Nordic Staking
        const validatorVotePubKey = new PublicKey('B1w6SZcyvjyp6zEyStcc8u9AxXAh2AbYvNzMmP9rRKE9');
        await setDirected(directedStakeProgram, wallet.publicKey, validatorVotePubKey);
    }
}

run().then().catch((error) => console.error(error));


