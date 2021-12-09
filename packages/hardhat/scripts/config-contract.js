const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  await parcelContract.setRoyalty(
    "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a",
    1000
  );

  // whitelist
  await parcelContract.setCitizenNftContract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );
  // await parcelContract.whitelistAddresses(
  //   ["0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"],
  //   5
  // );
  await parcelContract.beginWhitelisting();
  // await parcelContract.getRandomNumber();
  // await parcelContract.drawRaffle(5);
  // console.log(
  //   await parcelContract.getWhitelistedAmount(
  //     "0x2C68489f711eEf3e30fC0Cc20Bdaa436A3b4cc4a"
  //   )
  // );
};

main();
