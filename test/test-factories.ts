import { ethers } from "hardhat";
import { Signer } from "ethers";
import { assert, expect } from "chai";

describe("Token", function () {
  let accounts: Signer[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should have accounts", async function () {
    assert(accounts.length > 0, "Account legth should be more then zero");
  });
});

describe("StoreBuilderFactory", function () {
  let accounts: Signer[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should be able to deploy a StoreBuilder", async function () {
      const Factory = await ethers.getContractFactory("StoreBuilderFactory");
      const factory = await Factory.deploy();

      await factory.deployed();
      expect(await factory.getStoreBuilders()).to.lengthOf(0)
  });
});
