/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const citizenContract = await ethers.getContract("CitizenNFT", deployer);
  citizenContract.issueNewCitizenships(
    "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a",
    42,
    1
  );
};

main();
