const fs = require('fs');
const chalk = require('chalk');
async function main() {
  console.log("📡 Deploy \n")
  let contractList = fs.readdirSync("./contracts")
  for(let c in contractList){
    if(contractList[c].indexOf(".sol")>=0 && contractList[c].indexOf(".swp.")<0){
      const name = contractList[c].replace(".sol","")
      const contractArtifacts = artifacts.require(name);
      console.log("📄 "+name)
      const contract = await contractArtifacts.new()
      console.log(chalk.cyan(name),"deployed to:", chalk.magenta(contract.address));
      fs.writeFileSync("artifacts/"+name+".address",contract.address);
      console.log("\n")
      if(name=="SmartContractWallet"){
        let forwarderGsnArtifact = fs.readFileSync('../react-app/src/build/gsn/Forwarder.json').toString()
        let forwarderAddress = JSON.parse(forwarderGsnArtifact).address
        console.log("Setting ⛽️GSN trustedForwarder to ",chalk.magenta(forwarderAddress))
        await contract.setTrustedForwarder(forwarderAddress)
      }
    }
  }
}
main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
