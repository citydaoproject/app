/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
// const { main } = require("../scrips/create");
const createTest = require("./testCreate");

use(solidity);

describe("Token Contract", function () {
  let myContract, Token, token, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    Token = await ethers.getContractFactory("CityDaoParcel");
    token = await Token.deploy();
    // const createTest = import("./testCreate");
    await createTest.createTest(token);

    // const { deployer } = await getNamedAccounts();
    // token = await Token.getContract("CityDaoParcel", deployer);
  });

  describe("Purchasing land", () => {
    const ID = 1;

    it("Double spend not possible?", async () => {
      const price = await token.getPrice(ID);
      await token.buyPlot(ID, { value: price });
      expect(await token.isSold(ID)).to.be.true;
      expect(async () =>
        token.buyPlot(ID).to.throw("This plot has already been sold!")
      );
      console.log("soldstatus", await token.getAllSoldStatus());
      expect(await token.getAllSoldStatus()).to.include(true);
      // console.log("owners", await token.getOwners());
      // expect(await token.getOwners()).to.include(owner.address);
    });
  });
});

// describe("Purchasing", () => {
//   const ID = 1;

//   it("Purchase land", async function () {
//     // const bool = await token.isSold(1);
//     const plot = await token.buyPlot(ID);
//     console.log("plot", plot);
//     expect(plot.hash).to.be.a("string");
//     // expect(token.address).to.not.be.a("string");
//   });

//   it("Is sold?", async () => {
//     const bool = await token.isSold(ID);
//     console.log("bool", bool);
//     // expect(bool).to.be.true;
//   });

//   it("Try double-purchase", async () => {
//     const plot = await token.buyPlot(ID);
//     console.log("plot", plot);
//     // expect(plot.hash).to.not.be.a("string");
//   });

//   it("getting owners?", async () => {
//     const owners = await token.getOwners();
//     console.log("owners", owners);
//     expect(owners).to.be.a("array");
//   });
// });
