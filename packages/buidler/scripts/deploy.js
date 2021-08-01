const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("@nomiclabs/buidler");



async function main() {
  console.log("📡 Deploy \n");
  // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
  //await autoDeploy();
  // OR
  const donorManager = await deploy("DonorManager");
  const clr = await deploy("CLR", [ donorManager.address, 120 * 1 /* minutes */ ]);

  await clr.addRecipient("0x5016003B84Ae9e1E7fCA20AfbDf56Ee79646D9f0","0xbeef")
  await clr.addRecipient("0xE562fF185C16b450bb51903f38F90A18665e0e2E","0xdead")
  await clr.addRecipient("0x66b8b4F9f401540b1921EB5eeD2344e13900a6be","0x1337")

  await donorManager.allowDonor("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1")
  await donorManager.allowDonor("0x407976857609eCa79b0AA319212835B284D819c7")
  await donorManager.allowDonor("0x0B6eF14E664A1eab24E216A2Ca3a5B5678e243d9")

  await clr.transferOwnership("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1");
  await donorManager.transferOwnership("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1")
}



async function deploy(name, _args) {
  const args = _args || [];

  console.log(`📄 ${name}`);
  const contractArtifacts = await ethers.getContractFactory(name);
  const contract = await contractArtifacts.deploy(...args);
  console.log(
    chalk.cyan(name),
    "deployed to:",
    chalk.magenta(contract.address)
  );
  fs.writeFileSync(`artifacts/${name}.address`, contract.address);
  console.log("\n");
  return contract;
}

const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp.") < 0;

function readArgumentsFile(contractName) {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (fs.existsSync(argsFile)) {
      args = JSON.parse(fs.readFileSync(argsFile));
    }
  } catch (e) {
    console.log(e);
  }

  return args;
}

async function autoDeploy() {
  const contractList = fs.readdirSync(config.paths.sources);
  return contractList
    .filter((fileName) => isSolidity(fileName))
    .reduce((lastDeployment, fileName) => {
      const contractName = fileName.replace(".sol", "");
      const args = readArgumentsFile(contractName);

      // Wait for last deployment to complete before starting the next
      return lastDeployment.then((resultArrSoFar) =>
        deploy(contractName, args).then((result) => [...resultArrSoFar, result])
      );
    }, Promise.resolve([]));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
