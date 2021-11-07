const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Token Contract", function () {
  let myContract, Token, token;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("CityDaoParcel");
    token = await Token.deploy();
  });

  describe("Purchasing", () => {
    const ID = 1;
    it("Purchase land", async function () {
      // const bool = await token.isSold(1);
      const plot = await token.buyPlot(ID);
      console.log("plot", plot);
      expect(plot.hash).to.be.a("string");
      // expect(token.address).to.not.be.a("string");
    });

    it("Is sold?", async () => {
      const bool = await token.isSold(ID);
      console.log("bool", bool);
      // expect(bool).to.be.true;
    });

    it("Try double-purchase", async () => {
      const plot = await token.buyPlot(ID);
      console.log("plot", plot);
      // expect(plot.hash).to.not.be.a("string");
    });

    // describe("setPurpose()", function () {
    //   it("Should be able to set a new purpose", async function () {
    //     const newPurpose = "Test Purpose";

    //     await myContract.setPurpose(newPurpose);
    //     expect(await myContract.purpose()).to.equal(newPurpose);
    //   });
    // });
  });
});
