const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing ActivityLog contract on Sepolia...\n");
  
  const contractAddress = process.env.ACTIVITY_LOG_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("ACTIVITY_LOG_ADDRESS not set in .env");
  }
  
  console.log("📍 Contract address:", contractAddress);
  
  const ActivityLog = await hre.ethers.getContractFactory("ActivityLog");
  const activityLog = ActivityLog.attach(contractAddress);
  
  const testBatchId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("test-batch-001"));
  
  console.log("\n📝 Recording test activity...");
  
  const tx = await activityLog.recordActivity(
    testBatchId,
    "FERTILIZER",
    "Vermicompost",
    20000,
    true,
    "https://example.com/photo.jpg"
  );
  
  console.log("\n⏳ Transaction sent:", tx.hash);
  
  const receipt = await tx.wait();
  
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
  
  const activities = await activityLog.getBatchActivities(testBatchId);
  
  console.log("\n📋 Activities found:", activities.length);
  
  if (activities.length > 0) {
    const activity = activities[0];
    console.log("\n🌾 Activity Details:");
    console.log("   Type:", activity.activityType);
    console.log("   Product:", activity.productName);
    console.log("   Quantity:", activity.quantity.toString(), "grams");
    console.log("   Organic:", activity.isOrganic ? "✅ Yes" : "❌ No");
    console.log("   Timestamp:", new Date(Number(activity.timestamp) * 1000).toISOString());
  }
  
  const isOrganic = await activityLog.checkOrganicStatus(testBatchId);
  console.log("   Is Organic Batch:", isOrganic ? "✅ CERTIFIED ORGANIC" : "❌ NOT ORGANIC");
  
  const totalActivities = await activityLog.totalActivitiesRecorded();
  console.log("\n📊 Total activities recorded on this contract:", totalActivities.toString());
  
  console.log("\n🎉 TEST SUCCESSFUL!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
