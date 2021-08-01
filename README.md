# 🏗 scaffold-eth

I'm getting a really weird error trying to talk to xDAI using a burner-provider + ethers:

```js
console.log("🚀 TESTING with mainnet.infura.io:")
let burner = new BurnerProvider("https://mainnet.infura.io/v3/9ba908922edc44d1b5e1f0ba4506948d")
let ethersProvider = new ethers.providers.Web3Provider(burner)
let accounts = await ethersProvider.listAccounts()
console.log("😅 MAINNET accounts:",accounts)
let bal = await ethersProvider.getBalance(accounts[0])
console.log("💵 MAINNET balance", bal)

console.log("🚀 TESTING with localhost:8545:")
burner = new BurnerProvider("http://localhost:8545")
ethersProvider = new ethers.providers.Web3Provider(burner)
accounts = await ethersProvider.listAccounts()
console.log("😅 LOCAL accounts:",accounts)
bal = await ethersProvider.getBalance(accounts[0])
console.log("💵 LOCAL balance", bal)

console.log("🚀 TESTING with https://dai.poa.network:")
burner = new BurnerProvider("https://dai.poa.network")
ethersProvider = new ethers.providers.Web3Provider(burner)
accounts = await ethersProvider.listAccounts()
console.log("😅 xDAI accounts:",accounts)
bal = await ethersProvider.getBalance(accounts[0])
console.log("💵 xDAI balance", bal)
```

The first two work fine but the third one fails:

```bash
🚀 TESTING with mainnet.infura.io:
😅 MAINNET accounts: [ '0x80dE5B2d1Fd25abAc0034A56d3DFc2D3bc0C803c' ]
💵 MAINNET balance BigNumber { _hex: '0x00', _isBigNumber: true }
🚀 TESTING with localhost:8545:
😅 LOCAL accounts: [ '0x80dE5B2d1Fd25abAc0034A56d3DFc2D3bc0C803c' ]
💵 LOCAL balance BigNumber { _hex: '0x00', _isBigNumber: true }
🚀 TESTING with https://dai.poa.network:
😅 xDAI accounts: [ '0x80dE5B2d1Fd25abAc0034A56d3DFc2D3bc0C803c' ]
/Users/austingriffith/cors-issue/node_modules/safe-event-emitter/index.js:74
      throw err
      ^

Error: PollingBlockTracker - encountered an error while attempting to update latest block:
undefined
    at PollingBlockTracker._performSync (/Users/austingriffith/cors-issue/node_modules/eth-block-tracker/src/polling.js:51:24)
    at runNextTicks (internal/process/task_queues.js:58:5)
    at processImmediate (internal/timers.js:431:9)
Emitted 'error' event on Web3ProviderEngine instance at:
    at safeApply (/Users/austingriffith/cors-issue/node_modules/safe-event-emitter/index.js:70:5)
    at PollingBlockTracker.SafeEventEmitter.emit (/Users/austingriffith/cors-issue/node_modules/safe-event-emitter/index.js:56:5)
    at PollingBlockTracker._performSync (/Users/austingriffith/cors-issue/node_modules/eth-block-tracker/src/polling.js:53:16)
    at runNextTicks (internal/process/task_queues.js:58:5)
    at processImmediate (internal/timers.js:431:9)
```


steps:

clone this repo and cd in

yarn install

yarn run chain

cd packages/react-app/src

node simpleScript.js
