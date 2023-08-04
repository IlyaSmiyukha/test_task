# To The Moon (gearbox frontend test assignment)

### How start project?

1. Install dependencies

```
yarn
```

2. Copy env.example and rename it to .env. Then add your alchemy or infura key to .env file to REACT_APP_RPC_KEY

3. Run the project

```
yarn start
```

4. Open a new terminal window and run Anvil fork

```
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/${YOUR_SECRET_KEY} --chain-id 1337
```

5. Add one of suggested anvil account to your metamask, it will have 100000 ETH for testing


6. Add your wallet address from step 4 to './scripts/addBallances.ts and run the addBallances script to get some funds for testing

```
yarn set-balances
```

7. Open app on [localhost](http://localhost:3000) and start testing
