/* eslint no-use-before-define: "warn" */
const plots = require("./plots.json");
const parcel = require("./parcel.json");
const communal = require("./communal.json");
const { ethers } = require("hardhat");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const delayMS = 1000;

const main = async () => {
  // ADDRESS TO MINT TO:
  const toAddress = "0xb40A70Aa5C30215c44F27BF990cBf4D3E5Acb384"; // this will be the temporary address to hold the plots on testnets, in practice will be owned by CityDAO

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  // royalty
  await parcelContract.setRoyalty(
    "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a",
    100
  );
  const royaltyPrice = ethers.BigNumber.from("1000000000000000000");
  const [addr, amount] = await parcelContract.royaltyInfo(1, royaltyPrice);
  console.log(
    `${ethers.utils.formatEther(royaltyPrice)} ETH royalty pays`,
    ethers.utils.formatEther(amount)
  );

  // whitelist
  await parcelContract.setCitizenNftContract(
    "0xc5a5C42992dECbae36851359345FE25997F5C42d"
  );
  await parcelContract.setCitizenNftIds([7, 42, 69]);
  await parcelContract.whitelistAddress(
    "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a",
    true
  );
  const whitelisted = await parcelContract.isWhitelisted(
    "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"
  );
  console.log("Whitelisted: " + whitelisted);

  try {
    const parcelUri = await ipfs.add(JSON.stringify({ plots: parcel.parcel }));
    await sleep(delayMS);
    await parcelContract.setParcelMetadata(parcelUri.path);
    const plotsUri = await ipfs.add(JSON.stringify({ plots: plots.plots }));
    await sleep(delayMS);
    await parcelContract.setPlotsMetadata(plotsUri.path);
    const communalUri = await ipfs.add(
      JSON.stringify({ features: communal.features })
    );
    await sleep(delayMS);
    await parcelContract.setCommunalLandMetadata(communalUri.path);
    console.log(`Posting IPFS hash (${plotsUri.path})`);
    let idx = 0;
    for (const plot of plots.plots) {
      const plotUri = await ipfs.add(
        JSON.stringify({
          name: `CityDAO Parcel 0, Plot ${idx}`,
          description:
            "This NFT denotes a lifetime lease of the plot specified in its geojson metadata. The plot is meant for\
            conservation purposes and must be kept in its current state unless otherwise specified by a CityDAO\
            contract. The owner of this NFT will also obtain one governance vote in proposals involving the communal\
            land designated in the parcel contract.",
          image: "https://media0.giphy.com/media/Ju7l5y9osyymQ/200.gif",
          terrain: "Mountainous",
          sqft: "~1750 sqft",
          geojson: plot,
        })
      );
      await createPlot(plot, idx, plotUri.path, parcelContract);
      await sleep(delayMS);
      idx++;
    }
    await parcelContract.transferOwnership(toAddress, {
      gasLimit: 400000,
    });
  } catch (err) {
    console.log(err);
  }

  // transfer contract to CityDAO
  console.log(
    "Transferring ownership of CityDAO Plot Contract to " + toAddress + "..."
  );

  console.log("\n\n 🎫 Done!\n");
  console.log(await parcelContract.getPlotIds());
};

async function createPlot(plot, idx, plotUri, contract) {
  console.log(`Uploading plot${idx}...`);

  await contract.createPlot(
    ethers.BigNumber.from(`${100000000000000000 * (idx + 1)}`),
    plotUri,
    {
      gasLimit: 400000,
    }
  );
  await sleep(5000);
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
