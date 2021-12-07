const { ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const parcelContract = await ethers.getContract("CityDaoParcel", deployer);

  await parcelContract.getRandomNumber();
  const res = await parcelContract.drawRaffle(50).catch(console.log);
  res.map((num) => {
    console.log(parseInt(num.toString()) % 1000);
  });
};

main();
