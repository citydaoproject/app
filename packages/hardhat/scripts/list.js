/* eslint no-use-before-define: "warn" */
const parcel0 = require("./parcel0.json");
const { ethers } = require("hardhat");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const delayMS = 1000; //sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  // ADDRESS TO MINT TO:
  const toAddress = "0xb40A70Aa5C30215c44F27BF990cBf4D3E5Acb384"; // this will be the temporary address to hold the plots on testnets, in practice will be owned by CityDAO

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  try {
    await Promise.all(
      parcel0.plots.map(async (plot, idx) => {
        await listPlot(plot, idx, parcelContract);
      })
    );
  } catch (err) {
    console.log(err);
  }

  // transfer contract to CityDAO
  console.log(
    "Transferring ownership of CityDAO Plot Contract to " + toAddress + "..."
  );

  await parcelContract.transferOwnership(toAddress);

  await sleep(delayMS);
};

async function listPlot(plot, idx, contract) {
  console.log(`Uploading plot${idx}...`);
  const uploaded = await ipfs.add(JSON.stringify({ geojson: plot }));

  console.log(`Listing plot${idx} with IPFS hash (${uploaded.path})`);
  await contract.listPlot(uploaded.path, "0.01", {
    gasLimit: 400000,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
