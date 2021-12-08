/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const citizenContract = await ethers.getContract("CitizenNFT", deployer);
  citizenContract.issueNewCitizenships(
    "0xe745514f767DBa3B4256269c061fA4b9E4801846",
    42,
    1
  );
};

main();
