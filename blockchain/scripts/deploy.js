const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to Sepolia...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");
  
  console.log("📦 Deploying ActivityLog...");
  const ActivityLog = await hre.ethers.getContractFactory("ActivityLog");
  const activityLog = await ActivityLog.deploy();
  await activityLog.waitForDeployment();
  
  const activityLogAddress = await activityLog.getAddress();
  console.log("✅ ActivityLog deployed to:", activityLogAddress);
  
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      ActivityLog: {
        address: activityLogAddress
      }
    }
  };
  
  const outputPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n📄 Deployment info saved to:", outputPath);
  console.log("\n✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
