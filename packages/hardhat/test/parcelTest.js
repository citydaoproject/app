/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
require("chai/register-should");
const { solidity } = require("ethereum-waffle");
const createTest = require("./testCreatePlots");
const plots = require("../scripts/plots.json");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

use(solidity);

describe("Token parcelContract", function () {
  this.timeout(100000);
  let parcelContract,
    ParcelContract,
    owner,
    passedOwner,
    CitizenNFTContract,
    citizenNFTContract;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    ParcelContract = await ethers.getContractFactory("CityDaoParcel");
    parcelContract = await ParcelContract.deploy();
    passedOwner = owner.address;
    if (this.ctx.currentTest.title === "Plots created properly?") return;
    if (this.ctx.currentTest.title === "Owner privileges enforced") {
      passedOwner = "0xb50A70Aa5C30215c44F27BF990cBf4D3E5Acb384"; // random address
    }
    await createTest.createTest(parcelContract, passedOwner);

    CitizenNFTContract = await ethers.getContractFactory("CitizenNFT");
    citizenNFTContract = await CitizenNFTContract.deploy();
  });

  describe("Purchasing land", () => {
    const ID = 1;
    it("should create plots properly", async () => {
      const price = `100000000000000000`;
      let idx = 0;
      for (let plot = plots.plots; idx < 2; idx++) {
        const plotUri = await ipfs.add(
          JSON.stringify({
            name: `CityDAO Parcel 0, Plot ${idx}`,
            description: "NFT test",
            image: "https://media0.giphy.com/media/Ju7l5y9osyymQ/200.gif",
            terrain: "Mountainous",
            sqft: "~1750 sqft",
            geojson: plot,
          })
        );
        await parcelContract.createPlot(ethers.BigNumber.from(price), plotUri);
        expect((await parcelContract.getAllPrices()).toString()).to.include(
          price
        );
      }
    });

    it("should enforce owner privileges", async () => {
      const err = "Ownable: caller is not the owner";
      await expect(
        parcelContract.setRoyalty(owner.address, 100)
      ).to.be.revertedWith(err);
      await expect(
        parcelContract.createPlot(
          ethers.BigNumber.from(`${100000000000000000 * 1}`),
          {
            gasLimit: 400000,
          }
        )
      ).to.be.revertedWith(err);
      await expect(
        parcelContract.whitelistAddresses([owner.address], true)
      ).to.be.revertedWith(err);
    });

    it("should enforce whitelisting", async () => {
      const price = await parcelContract.getPrice(ID);
      await expect(
        parcelContract.buyPlot(ID, { value: price })
      ).to.be.revertedWith(
        "You don't have the right citizen NFT to buy this plot yet."
      );
      await parcelContract.whitelistAddresses([owner.address], true);
      expect(await parcelContract.isWhitelisted(owner.address)).to.be.true;
    });

    it("should complete purchase && double spend not possible", async () => {
      parcelContract.whitelistAddresses([owner.address], true);
      const price = await parcelContract.getPrice(ID);
      await parcelContract.buyPlot(ID, { value: price });
      expect(
        (await parcelContract.getAllSoldStatus()).filter((i) => i === true)
      ).to.have.lengthOf(1);
      const buyID = (await parcelContract.getAllSoldStatus()).indexOf(true) + 1;
      expect(await parcelContract.isSold(buyID)).to.be.true;
      expect(async () =>
        parcelContract
          .buyPlot(buyID)
          .to.throw("This plot has already been sold!")
      );
      expect((await parcelContract.getOwners())[buyID - 1]).to.equal(
        owner.address
      );
    });
  });
});
