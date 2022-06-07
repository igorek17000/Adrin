
# ABR Project and Token Smart Contracts

This repository consists of smart contracts required for ABR projct

#### How to run
- installation 
```
yarn install
```

-   Deploy to testnet (goerli in the below example)

```
yarn
PROJECT_ID="infura id" PRIVATE_KEY"private key to deploy the contracts from" yarn deploy:goerli
```

-   Deploy to local (requires ganache to run on local)


You can find more information in the `scripts-info` section in the `package.json` file.


#### How to test
- run test files
```
NODE_ENV=test npx hardhat test
```

#### How to deploy

-   Deploy to bsc_testnet

```
yarn clean

yarn prepare

NODE_ENV=default PRIVATE_KEY=<your-private-key> yarn deploy:bsc_testnet
```

-   Deploy to bsc mainnet


```
NODE_ENV=production PRIVATE_KEY=<your-private-key> yarn deploy:bsc
```

-   Deploy to Polygon (Matic) mainnet


```
NODE_ENV=polygon_production PRIVATE_KEY=<your-private-key> yarn deploy:matic
```


#### How to verify a contract

- Verify on bsc_testnet

You will first need an API key from your account on https://bscscan.com/login

then run 

```
ETHERSCAN_KEY=<your-api-key> npx hardhat verify --network bsc_testnet <contract-address> "constructor's-first-arg" "constructor's-second-arg" "constructor's-third-arg" "constructor's-forth-arg"
```
