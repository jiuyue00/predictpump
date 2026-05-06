import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PredictionMarket", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    const Market = await ethers.getContractFactory("PredictionMarket");
    const market = await Market.deploy(owner.address);
    await market.waitForDeployment();

    // Create a market
    await market.createMarket(
      ethers.ZeroAddress,
      "Will PEPE2 go up?",
      86400 // 24h
    );

    return { market, owner, user };
  }

  it("should create a market", async function () {
    const { market } = await loadFixture(deployFixture);
    const count = await market.getMarketCount();
    expect(count).to.equal(1);
  });

  it("should place a bet", async function () {
    const { market, user } = await loadFixture(deployFixture);
    await market.connect(user).placeBet(0, true, { value: ethers.parseEther("1") });
    const m = await market.markets(0);
    expect(m.upPool).to.equal(ethers.parseEther("1"));
  });

  it("should resolve and allow claim", async function () {
    const { market, owner, user } = await loadFixture(deployFixture);
    await market.connect(user).placeBet(0, true, { value: ethers.parseEther("1") });

    // Increase time by 24h
    await ethers.provider.send("evm_increaseTime", [86401]);
    await ethers.provider.send("evm_mine", []);

    await market.connect(owner).resolveMarket(0, true);
    const m = await market.markets(0);
    expect(m.resolved).to.be.true;
    expect(m.outcome).to.be.true;
  });

  it("should reject bet after deadline", async function () {
    const { market, user } = await loadFixture(deployFixture);
    await ethers.provider.send("evm_increaseTime", [86401]);
    await ethers.provider.send("evm_mine", []);
    await expect(
      market.connect(user).placeBet(0, true, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Market ended");
  });
});
