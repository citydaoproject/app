# CityDAO App v1

## Install
Required: [Node.js](https://nodejs.org/dist/latest-v12.x/), [Yarn](https://classic.yarnpkg.com/en/docs/install) and [Git](https://git-scm.com/downloads)
1. Clone this repository
```
git clone https://github.com/citydaoproject/app.git citydao-v1
```
2. Change into the newly cloned directory and install dependencies
```
cd citydao-v1
yarn install
```  

Congrats! You're ready to get started.  

## Get started
You'll need three terminal windows: one for starting the web app (written in React.js), one for starting a local blockchain, and one for deploying our smart contracts to the local blockchain.  

*In the first terminal window*
```
yarn start
```

*In the second terminal window*
```
yarn chain
```

*In the third terminal window*
```
yarn deploy
```

If you've run those three commands with no errors, the app will be found at http://localhost:3000  

## Making changes
Each part of the application is contained in its own package:
```
packages
├── hardhat
├── react-app
├── services
└── subgraph
```  

`hardhat` - The CityDAO parcel contracts and related code.  
`react-app` - The frontend web application for interacting with CityDAO contracts. It's written in [React.js](https://reactjs.org).  
`services` - Miscellaneous services needed for the web app, such as a [Graph](https://thegraph.com) node  
`subgraph` - Files needed to define useful subgraphs   

## Questions
For questions related to setting up your development environment, please see the [scaffold-eth documentation](https://github.com/scaffold-eth/scaffold-eth#-scaffold-eth). This repository is based on the scaffold-eth template.  

For further questions, [join our Discord](https://discord.com/invite/2pzV6wnWZx) and ask in the #dev channel.