/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const citizenContract = await ethers.getContract("CitizenNFT", deployer);
  await citizenContract.issueNewCitizenships(
    "0x3aDa0A88835691dAC6ae3EA2BDD4Af14Ee76B081",
    42,
    1
  );
};

main();
