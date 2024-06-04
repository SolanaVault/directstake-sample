# Installation & Running

Clone this repository and run

```
npm install
```

To run the sample code use the following. Remember to set the KEYPAIR environment variable. This wallet is used by the sample code to pay for transactions, and also if you want to direect stake for a particular wallet, then the private key of the same wallet must be used. RPC_URL must also be set (the public Solana RPC endpoint cannot be used for the ```getAllWalletsDirectedStake``` call).

```
KEYPAIR="wallet private key" RPC_URL="URL to RPC" npx tsx index.ts
```

# Usage


The sample code implements the following logic:

- Lookup which validator a particular wallet has directed its stake to. Use the function ```getDirected```
- Set directed stake of a paricular wallet. Ue the function ```setDirected```. Make sure you set the KEYPAIR environment variable to the private key of the wallet you wish to direct stake for.
- Clear an existing directed stake for a particular wallet. Use the function ```closeDirected```. Make sure you set the KEYPAIR environment variable to the private key of the wallet you wish to clear the direct stake setting for.
- Get a list of all wallets with directed stake and which validator they are directing stake to, along with the amount of stake that they are directing (as of when the vsholHoldings bot last run). To get the amount of stake directed, the code uses the data stored by the vsholHoldings bot which runs once a day: [link](https://github.com/SolanaVault/holdings-data). Use the function ```getAllWalletsDirectedStake```


