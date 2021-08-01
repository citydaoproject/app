const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("@nomiclabs/buidler");
const { utils } = require("ethers");

async function main() {
  console.log("📡 Deploy \n");

    // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
    //await autoDeploy();
    // OR
    // custom deploy (to use deployed addresses dynamically for example:)

   console.log("📄  Deploying Registry \n");
   const registry = await deploy("Registry")

   console.log("📲  Deploying Projects\n");
   const projects = await deploy("Projects",[ registry.address ])

   let genesisProjects = [
     {
       title: "🎨 Nifty.ink",
       desc: "Instant onboarding NFT platform powered by meta transactions, xDAI, and bridged to Ethereum.",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev",
       projectOwner: "0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1"
     },
     {
       title: "🧙‍♂️ InstantWallet.io",
       desc: "Simple and forkable burner wallet made with 🏗 scaffold-eth.",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/instantwallet-dev-session",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "🏗 ScaffoldETH.io",
       desc: "Forkable Ethereum Dev Stack and Community",
       repo: "https://github.com/austintgriffith/scaffold-eth",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "👛 Multisig.Holdings",
       desc: "Meta-multi-sig factory and frontend where anyone can spin up an MVP signature based multisig",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "🔴 Optimistic.Money",
       desc: "InstantWallet.io fork for deposit/send on OVM testnet",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/instantwallet-dev-session",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "🏷 FreeNS.io",
       desc: "Free MVP ENS-like service on L2",
       repo: "https://github.com/austintgriffith/scaffold-eth",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "⚖️ Backlog.Exchange",
       desc: "Token-weighted github backlog ordering app",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/backlog-market",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },
     {
       title: "🏰 BuidlGuidl.com",
       desc: "(this) developer coordination experiment centered around 🏗 scaffold-eth",
       repo: "https://github.com/austintgriffith/scaffold-eth/tree/address-registry-example",
       projectOwner: "0x34aA3F359A9D614239015126635CE7732c18fDF3"
     },


   ]

   for(let g in genesisProjects){
     console.log("     "+genesisProjects[g].title+" ("+chalk.gray(utils.formatBytes32String(genesisProjects[g].title))+")")
     const id = await projects.projectId(genesisProjects[g].title)
     console.log("     "+chalk.gray(id))
     await projects.updateProject(
       genesisProjects[g].title,
       genesisProjects[g].desc,
       genesisProjects[g].repo,
       genesisProjects[g].projectOwner
     )
   }
   console.log(" ");

   console.log("🏷 Register Projects Contract")
   await registry.updateAsset(utils.formatBytes32String("Projects"),projects.address)

   console.log("🛠  Deploying Builders\n");
   const builders = await deploy("Builders",[ registry.address ])

   console.log("🏷 Register Builders Contract")
   await registry.updateAsset(utils.formatBytes32String("Builders"),builders.address)

   console.log("🛠  Deploying Quests\n");
   const quests = await deploy("Quests",[ registry.address ])

   console.log("🏷 Register Quests Contract")
   await registry.updateAsset(utils.formatBytes32String("Quests"),quests.address)


   console.log("🚩 Adding Quests")
   let genesisQuests = [
     {
       project: "🏗 ScaffoldETH.io",
       title: "📄 The Graph Tutorial",
       desc: "create a tutorial the explains how to build a subgraph",
       link: "",
     },
     {
       project: "🏗 ScaffoldETH.io",
       title: "📚 Possible Refactor",
       desc: "originally 🏗 scaffold-eth used create-eth-app but it doesn't leverage it",
       link: "",
     },
     {
       project: "🏗 ScaffoldETH.io",
       title: "📦 Event Parser for Owner Lists",
       desc: "list only the active owners in an owner list component by parsing many bool events",
       link: "",
     },
     {
       project: "🎨 Nifty.ink",
       title: "📦 Use The Graph for the frontend",
       desc: "upgrade to using 🛰 The Graph instead of events for a faster fronten",
       link: "",
     },
     {
       project: "🎨 Nifty.ink",
       title: "📦 Collabland Telegram Bot access per Ink ownership",
       desc: "work with Collabland for a system to allow specific inks to control access to a chat",
       link: "",
     },
     {
       project: "🧙‍♂️ InstantWallet.io",
       title: "🐛 First click to send button fails",
       desc: "when the wallet is first loading the send button should look disabled or transparent",
       link: "",
     },
     {
       project: "🔴 Optimistic.Money",
       title: "📚 Initial Exploration",
       desc: "get a private repo set up using the secret OVM RPC to explore how it might work",
       link: "",
     },
     {
       project: "🏗 ScaffoldETH.io",
       title: "📄 The Graph Tutorial",
       desc: "create a tutorial the explains how to build and use a subgraph for 🏗 scaffold-eth",
       link: "",
     },

   ]

   for(let g in genesisQuests){
     console.log("        "+genesisQuests[g].project+" : "+genesisQuests[g].title)
     const id = await quests.questId(utils.formatBytes32String(genesisQuests[g].project), genesisQuests[g].title)//questId( bytes32 project, string memory title )
     console.log("        "+chalk.gray(id))
     await quests.updateQuest(//updateQuest(bytes32 project, string memory title, string memory desc)
       utils.formatBytes32String(genesisQuests[g].project),
       genesisQuests[g].title,
       genesisQuests[g].desc,
       genesisQuests[g].link
     )
   }
   console.log(" ");



   console.log("🗳  Electing Owner of Registry\n");
   await registry.transferOwnership("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1")//governor.address)

}





async function deploy(name, _args) {
  const args = _args || [];

  console.log(` 🛰  Deploying ${name}`);
  const contractArtifacts = await ethers.getContractFactory(name);
  const contract = await contractArtifacts.deploy(...args);
  console.log(" 📄",
    chalk.cyan(name),
    "deployed to:",
    chalk.magenta(contract.address),
    "\n"
  );
  fs.writeFileSync(`artifacts/${name}.address`, contract.address);
  console.log("💾  Artifacts (address, abi, and args) saved to: ",chalk.blue("packages/buidler/artifacts/"),"\n")
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
        deploy(contractName, args).then((result,b,c) => {

          if(args&&result&&result.interface&&result.interface.deploy){
            let encoded = utils.defaultAbiCoder.encode(result.interface.deploy.inputs,args)
            fs.writeFileSync(`artifacts/${contractName}.args`, encoded);
          }

          return [...resultArrSoFar, result]
        })
      );
    }, Promise.resolve([]));
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
