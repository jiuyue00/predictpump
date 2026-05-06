import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy factory
  const feeRecipient = deployer.address;
  const Factory = await ethers.getContractFactory("PredictPumpFactory");
  const factory = await Factory.deploy(feeRecipient);
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("PredictPumpFactory deployed to:", factoryAddr);
}

main().catch(console.error);
