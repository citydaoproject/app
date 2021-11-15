/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
require("chai/register-should");
const { solidity } = require("ethereum-waffle");
// const { main } = require("../scrips/create");
const createTest = require("./testCreate");

use(solidity);

describe("Token Contract", function () {
  let Contract, contract, owner, passedOwner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    Contract = await ethers.getContractFactory("CityDaoParcel");
    contract = await Contract.deploy();
    passedOwner = "0xb40A70Aa5C30215c44F27BF990cBf4D3E5Acb384"; // OR 'owner';
    passedOwner = owner;
    await createTest.createTest(contract, passedOwner);

    // const { deployer } = await getNamedAccounts();
    // token = await Token.getContract("CityDaoParcel", deployer);
  });

  describe("Purchasing land", () => {
    const ID = 1;

    it("Owner privileges enforced", async () => {
      const err = "Ownable: caller is not the owner";
      if (owner !== passedOwner) {
        await expect(
          contract.createPlot(
            ethers.BigNumber.from(`${100000000000000000 * 1}`),
            {
              gasLimit: 400000,
            }
          )
        ).to.be.revertedWith(err);
        await expect(
          contract.whitelistAddress(owner.address, true)
        ).to.be.revertedWith(err);
      }
    });

    it("Is whitelisting enforced?", async () => {
      const price = await contract.getPrice(ID);
      await expect(contract.buyPlot(ID, { value: price })).to.be.revertedWith(
        "Citizen NFT contract not set!"
      );
      await contract.whitelistAddress(owner.address, true);
      expect(await contract.isWhitelisted(owner.address)).to.be.true;
    });

    it("Double spend not possible?", async () => {
      contract.whitelistAddress(owner.address, true);
      const price = await contract.getPrice(ID);
      await contract.buyPlot(ID, { value: price });
      expect(await contract.isSold(ID)).to.be.true;
      expect(async () =>
        contract.buyPlot(ID).to.throw("This plot has already been sold!")
      );
      console.log("soldstatus", await contract.getAllSoldStatus());
      expect(await contract.getAllSoldStatus()).to.include(true);
      console.log("owners", await contract.getOwners());
      expect(await contract.getOwners()).to.include(owner.address);
    });
  });
});
