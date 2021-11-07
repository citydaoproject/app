# CityDAO

## Getting started

### 1. Install dependencies
```bash
yarn
```

### 2. Start local Ethereum chain
Note: start this in a separate terminal window. This process needs to run continuously
```bash
yarn chain
```

### 3. Deploy contract and create plots
Before deploying the contract, make sure that env variables point the script to deploy on localhost.
```bash
export REACT_APP_NETWORK="localhost"
```

Deploy the contract to the local blockchain
```bash
yarn deploy
```

Next, we will create the actual plots. the following command will create up to 1000 plots. For development purposes, it's recommended that you exit out of the process (ctrl+c) after 10 or so plots. You won't need all 1000 plots for local development
```bash
yarn create-plots
```

### 4. Run the web app
First, create `.env` in the `packages/web` directory with [the values from the Notion documentation](https://citydao.notion.site/Env-variables-9d5d8c5874c2400cb2554964cb61a86f)

Then start the web app locally on http://localhost:3000
```bash
yarn start
```

### 5. Make Metamask point at the hardhat chain
Metamask points to `localhost:8545`'s 1337 chain ID as default. This needs to be changed to the chain ID hard hat uses, 31337. Update the chain ID at:
Metamask > Settings > Networks > Localhost > Chain ID
