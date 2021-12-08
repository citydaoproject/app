const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  // royalty
  // await parcelContract.setRoyalty(
  //   "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a",
  //   1000
  // );

  // // whitelist
  // await parcelContract.setCitizenNftContract(
  //   "0xbEf235017f20859c4467a3aE3B7FE4CdF43d5f5C"
  // );
  // await parcelContract.whitelistAddresses(
  //   ["0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"],
  //   5
  // );
  // await parcelContract.beginWhitelisting();
  // await parcelContract.enterRaffle();
  // await parcelContract.drawRaffle(1);
  console.log(
    await parcelContract.getWhitelistedAmount(
      "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"
    )
  );
};

main();
