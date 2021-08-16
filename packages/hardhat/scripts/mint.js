/* eslint no-use-before-define: "warn" */
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
  const toAddress = "0x6D614b730Cc5a6eF7013587D5CBC2319D1910bCE";

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const { deployer } = await getNamedAccounts();
  const parcel = await ethers.getContract("Parcel", deployer);

  const parcel0 = {
    id: "parcel0",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-106.32980346679686, 43.17263460564885],
            [-106.32843017578125, 43.14809207007617],
            [-106.29615783691406, 43.14458518880386],
            [-106.2604522705078, 43.19666671417641],
            [-106.31263732910156, 43.212182422791194],
            [-106.32980346679686, 43.17263460564885],
          ],
        ],
      },
    },
  };
  console.log("Uploading parcel0...");
  const uploaded = await ipfs.add(JSON.stringify(parcel0));

  console.log("Minting parcel0 with IPFS hash (" + uploaded.path + ")");
  await parcel.mintItem(toAddress, uploaded.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  const parcel1 = {
    id: "parcel1",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-106.31881713867188, 43.213683733553026],
            [-106.34902954101562, 43.22369152747339],
            [-106.35795593261719, 43.20867922062144],
            [-106.34696960449219, 43.182148446530114],
            [-106.33941650390625, 43.17313537107136],
            [-106.33529663085938, 43.17513839170044],
            [-106.31881713867188, 43.213683733553026],
          ],
        ],
      },
    },
  };
  console.log("Uploading parcel1...");
  const uploadedparcel1 = await ipfs.add(JSON.stringify(parcel1));

  console.log("Minting parcel1 with IPFS hash (" + uploadedparcel1.path + ")");
  await parcel.mintItem(toAddress, uploadedparcel1.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  const parcel2 = {
    id: "parcel2",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-106.36276245117188, 43.204675314614],
            [-106.3861083984375, 43.203173782105814],
            [-106.37786865234375, 43.15360247702298],
            [-106.34078979492188, 43.144084189341605],
            [-106.33804321289061, 43.1596132634395],
            [-106.35314941406249, 43.18064635967524],
            [-106.36276245117188, 43.204675314614],
          ],
        ],
      },
    },
  };
  console.log("Uploading parcel2...");
  const uploadedparcel2 = await ipfs.add(JSON.stringify(parcel2));

  console.log("Minting parcel2 with IPFS hash (" + uploadedparcel2.path + ")");
  await parcel.mintItem(toAddress, uploadedparcel2.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
