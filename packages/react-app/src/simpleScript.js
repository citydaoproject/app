const { ethers } = require("ethers");
const BurnerProvider = require("burner-provider");

const run = async ()=>{

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



}

run()
