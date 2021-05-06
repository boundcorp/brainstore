// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { assert, expect } from "chai";

describe("Token", function () {
  let accounts: Signer[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should have accounts", async function () {
    assert(accounts.length > 0, "Account length should be more then zero");
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

      const builderDeploy = await factory.createStoreBuilder("NFT Marketplace", 5 * 10000)
      const builderReceipt = await builderDeploy.wait(0)
      const makeBuilder = builderReceipt.events[2].args

      expect(await factory.getStoreBuilders()).to.lengthOf(1)

      const Builder = await ethers.getContractFactory("StoreBuilder")
      const builder = await Builder.attach(makeBuilder.builderAddress)

      expect(await builder.owner()).to.equal(await accounts[0].getAddress())
      expect(5 * 10000).to.equal(makeBuilder.feePoints)
  });

    it("should be able to deploy a Store", async function () {
        const Factory = await ethers.getContractFactory("StoreBuilderFactory");
        const factory = await Factory.deploy();
        await factory.deployed();
        const builderDeploy = await factory.createStoreBuilder("NFT Marketplace", 5 * 10000)
        const builderReceipt = await builderDeploy.wait(0)
        const makeBuilder = builderReceipt.events[2].args
        const Builder = await ethers.getContractFactory("StoreBuilder", accounts[1])
        const builder = await Builder.attach(makeBuilder.builderAddress)

        await (await builder.createStore("My Content Creation Station")).wait(0)
        const makeStore = (await builder.queryFilter(builder.filters.BrainStoreCreated()))[0]

        const Store = await ethers.getContractFactory("BrainStore")
        const store = await Store.attach(makeStore.args.storeAddress)

        expect(await store.owner()).to.equal(await accounts[1].getAddress())

    });

    it("should split store payments", async function () {
        const Factory = await ethers.getContractFactory("StoreBuilderFactory");
        const factory = await Factory.deploy();
        await factory.deployed();
        const builderDeploy = await factory.createStoreBuilder("NFT Marketplace", 2 * 10000)
        const builderReceipt = await builderDeploy.wait(0)
        const makeBuilder = builderReceipt.events[2].args
        const Builder = await ethers.getContractFactory("StoreBuilder", accounts[1])
        const builder = await Builder.attach(makeBuilder.builderAddress)

        expect(await builder.owner()).to.equal(await accounts[0].getAddress())

        const BuilderAdmin = await ethers.getContractFactory("StoreBuilder")
        const builderAdmin = await BuilderAdmin.attach(makeBuilder.builderAddress)

        await (await builder.createStore("My Content Creation Station")).wait(0)
        const makeStore = (await builder.queryFilter(builder.filters.BrainStoreCreated()))[0]

        const Store = await ethers.getContractFactory("BrainStore")
        const store = await Store.attach(makeStore.args.storeAddress)

        expect(await store.owner()).to.equal(await accounts[1].getAddress())
        const tx = await accounts[0].sendTransaction({
            to: makeStore.args.storeAddress,
            value: ethers.utils.parseEther("1.0")
        })
        const receipt = await tx.wait(0);

        expect(await store.getOwnerBalance()).to.equal(ethers.utils.parseEther("0.98"))
        expect(await store.getFeeBalance()).to.equal(ethers.utils.parseEther("0.02"))

        expect(await store.owner()).to.equal(await accounts[1].getAddress())
        const payment = await store.makePayment({
            value: ethers.utils.parseEther("2.0")
        })
        const paystub = await tx.wait(0);

        expect(await store.getOwnerBalance()).to.equal(ethers.utils.parseEther("0.98"))
        expect(await store.getFeeBalance()).to.equal(ethers.utils.parseEther("0.02"))
        expect(await store.payments(await accounts[1].getAddress())).to.equal(ethers.utils.parseEther("1.96"))
        expect(await store.payments(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0.04"))

        await store.sweep()

        expect(await store.payments(await accounts[1].getAddress())).to.equal(ethers.utils.parseEther("2.94"))
        expect(await store.payments(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0.06"))

        await builder.collectFees()

        expect(await store.payments(await accounts[1].getAddress())).to.equal(ethers.utils.parseEther("2.94"))
        expect(await store.payments(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0"))
        expect(await ethers.provider.getBalance(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0.06"))

        const original = await accounts[0].getBalance()

        await builderAdmin.transferFees()
        await builder.withdrawPayments(await accounts[0].getAddress())

        expect(await store.payments(await accounts[1].getAddress())).to.equal(ethers.utils.parseEther("2.94"))
        expect(await store.payments(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0"))
        expect(await ethers.provider.getBalance(makeBuilder.builderAddress)).to.equal(ethers.utils.parseEther("0.00"))

        const after_fees = await accounts[0].getBalance()

        const feesRecieved = parseFloat(ethers.utils.formatEther(after_fees.sub(original)))

        // Expect some gas fluctuations
        expect(feesRecieved).to.greaterThan(0.059)
        expect(feesRecieved).to.lessThan(0.061)

    });
});
