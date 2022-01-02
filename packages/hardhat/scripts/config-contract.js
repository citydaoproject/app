const { ethers } = require("hardhat");

const ROYALTY_RECIPIENT = "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a";
const CITIZEN_NFT = "0xbEf235017f20859c4467a3aE3B7FE4CdF43d5f5C";
const FOUNDING_CITIZENS = ["0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"];

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  await parcelContract.setRoyalty(ROYALTY_RECIPIENT, 1000);

  // whitelist
  await parcelContract.setCitizenNftContract(CITIZEN_NFT);

  await parcelContract.whitelistAddresses(FOUNDING_CITIZENS, 5);

  await parcelContract.beginWhitelisting();

  // await parcelContract.drawRaffle(5);
};

main();
