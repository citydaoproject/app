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

const START = 0;

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

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
    let idx = START;
    for (const plot of plots.plots.slice(START)) {
      const plotUri = await ipfs.add(
        JSON.stringify({
          name: `CityDAO Parcel 0, Plot ${idx + 1}`,
          description:
            "This NFT denotes a lifetime lease of the plot specified in its geojson metadata. The plot is meant for\
              conservation purposes and must be kept in its current state unless otherwise specified by a CityDAO\
              contract. The owner of this NFT will also obtain one governance vote in proposals involving the communal\
              land designated in the parcel contract.",
          image: `https://storage.googleapis.com/parcel0_plot_images/generated/${
            idx + 1
          }.png`,
          terrain: "Mountainous",
          sqft: "~1750 sqft",
          geojson: plot,
        })
      );
      await createPlot(plot, idx, plotUri.path, parcelContract);
      await sleep(delayMS);
      idx++;
    }
  } catch (err) {
    console.log(err);
  }

  console.log("\n\n 🎫 Done!\n");
  console.log(await parcelContract.getPlotIds());
};

async function createPlot(plot, idx, plotUri, contract) {
  console.log(`Uploading plot${idx}...`);

  await contract.createPlot(
    ethers.BigNumber.from(`${0.1 * 10 ** 18}`),
    plotUri,
    {
      gasLimit: 30000,
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
