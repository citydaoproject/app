/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
require("chai/register-should");
const { solidity } = require("ethereum-waffle");
const createTest = require("./testCreate");

use(solidity);

describe("Token parcelContract", function () {
  let parcelContract,
    parcelContract,
    owner,
    passedOwner,
    CitizenNFTContract,
    citizenNFTContract;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    parcelContract = await ethers.getContractFactory("CityDaoParcel");
    parcelContract = await parcelContract.deploy();
    passedOwner = owner.address;
    await createTest.createTest(parcelContract, passedOwner);

    CitizenNFTContract = await ethers.getContractFactory("CitizenNFT");
    citizenNFTContract = await CitizenNFTContract.deploy();
  });

  describe("Purchasing land", () => {
    const ID = 1;

    it("Owner privileges enforced", async () => {
      const err = "Ownable: caller is not the owner";
      if (owner.address !== passedOwner) {
        await expect(
          parcelContract.createPlot(
            ethers.BigNumber.from(`${100000000000000000 * 1}`),
            {
              gasLimit: 400000,
            }
          )
        ).to.be.revertedWith(err);
        await expect(
          parcelContract.whitelistAddress(owner.address, true)
        ).to.be.revertedWith(err);
      }
    });

    it("Is whitelisting enforced?", async () => {
      const price = await parcelContract.getPrice(ID);
      await expect(
        parcelContract.buyPlot(ID, { value: price })
      ).to.be.revertedWith(
        "You don't have the right citizen NFT to buy this plot yet."
      );
      await parcelContract.whitelistAddress(owner.address, true);
      expect(await parcelContract.isWhitelisted(owner.address)).to.be.true;
    });

    it.only("Double spend not possible?", async () => {
      parcelContract.whitelistAddress(owner.address, true);
      const price = await parcelContract.getPrice(ID);
      await parcelContract.buyPlot(ID, { value: price });
      expect(await parcelContract.isSold(ID)).to.be.true;
      expect(async () =>
        parcelContract.buyPlot(ID).to.throw("This plot has already been sold!")
      );
      expect(await parcelContract.getAllSoldStatus()).to.include(true);
      expect(await parcelContract.getOwners()).to.include(owner.address);
    });
  });
});
