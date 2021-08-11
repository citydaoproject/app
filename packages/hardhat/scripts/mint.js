/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
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
            [-106.31332397460938, 43.17063150289795],
            [-106.22886657714842, 43.17063150289795],
            [-106.22886657714842, 43.22719386727831],
            [-106.31332397460938, 43.22719386727831],
            [-106.31332397460938, 43.17063150289795],
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
            [-106.36688232421875, 43.22969541537019],
            [-106.28517150878906, 43.22969541537019],
            [-106.28517150878906, 43.28220420881544],
            [-106.36688232421875, 43.28220420881544],
            [-106.36688232421875, 43.22969541537019],
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
            [-106.28242492675781, 43.22869480845322],
            [-106.19178771972656, 43.22869480845322],
            [-106.19178771972656, 43.28570318513211],
            [-106.28242492675781, 43.28570318513211],
            [-106.28242492675781, 43.22869480845322],
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

  console.log("Transferring Ownership of Parcel to " + toAddress + "...");

  await parcel.transferOwnership(toAddress);

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
