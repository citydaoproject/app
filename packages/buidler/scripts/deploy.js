const fs = require('fs');
const chalk = require('chalk');
const ethers = require("ethers");
async function main() {
  console.log("📡 Deploy \n")

  const PROD = true

  if (PROD) {
    const xMoonLanding = await deploy("xMoonLanding", ["10000000000000000000", "0xDF82c9014F127243CE1305DFE54151647d74B27A"])
    //set the new owner 
    await xMoonLanding.updateOwner("0x34aA3F359A9D614239015126635CE7732c18fDF3")
  } else {
    const moons = await deploy("Moons")
    const xMoonLanding = await deploy("xMoonLanding", ["500000000000000000000",moons.address])
    // paste in your address here to get 10 balloons on deploy:
    await moons.transfer("0x34aA3F359A9D614239015126635CE7732c18fDF3", ethers.utils.parseEther("10000"))
    //set the new owner 
    await xMoonLanding.updateOwner("0x34aA3F359A9D614239015126635CE7732c18fDF3")
  }

}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


async function deploy(name, _args) {
  let args = []
  if (_args) {
    args = _args
  }
  console.log("📄 " + name)
  const contractArtifacts = artifacts.require(name);
  const contract = await contractArtifacts.new(...args)
  console.log(chalk.cyan(name), "deployed to:", chalk.magenta(contract.address));
  fs.writeFileSync("artifacts/" + name + ".address", contract.address);
  console.log("\n")
  return contract;
}

async function autoDeploy() {
  let contractList = fs.readdirSync("./contracts")
  for (let c in contractList) {
    if (contractList[c].indexOf(".sol") >= 0 && contractList[c].indexOf(".swp.") < 0) {
      const name = contractList[c].replace(".sol", "")
      let args = []
      try {
        const argsFile = "./contracts/" + name + ".args"
        if (fs.existsSync(argsFile)) {
          args = JSON.parse(fs.readFileSync(argsFile))
        }
      } catch (e) {
        console.log(e)
      }
      await deploy(name, args)
    }
  }
}
