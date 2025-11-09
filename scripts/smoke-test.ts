
import { mastra } from "../src/mastra";
import { yaasAgent } from "../src/mastra/agents/yaasAgent";

async function runSmokeTest() {
  console.log("🧪 Starting YAAS Smoke Test...\n");
  
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Database Connection
  console.log("1️⃣ Testing Database Connection...");
  try {
    const storage = mastra.getMemory();
    if (storage) {
      console.log("✅ Database connection successful\n");
      passedTests++;
    } else {
      throw new Error("Storage not initialized");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    failedTests++;
  }

  // Test 2: Agent Availability
  console.log("2️⃣ Testing YAAS Agent...");
  try {
    const agent = mastra.getAgent("yaasAgent");
    if (agent) {
      console.log("✅ YAAS Agent loaded successfully\n");
      passedTests++;
    } else {
      throw new Error("YAAS Agent not found");
    }
  } catch (error) {
    console.error("❌ YAAS Agent test failed:", error);
    failedTests++;
  }

  // Test 3: Agent Response Test
  console.log("3️⃣ Testing Agent Response...");
  try {
    const response = await yaasAgent.generate(
      "Say 'Hello from YAAS!' and nothing else.",
      { mastra }
    );
    
    if (response && response.text) {
      console.log(`✅ Agent responded: ${response.text}\n`);
      passedTests++;
    } else {
      throw new Error("Agent returned empty response");
    }
  } catch (error) {
    console.error("❌ Agent response test failed:", error);
    failedTests++;
  }

  // Test 4: Workflow Availability
  console.log("4️⃣ Testing YAAS Workflow...");
  try {
    const workflow = mastra.getWorkflow("yaasWorkflow");
    if (workflow) {
      console.log("✅ YAAS Workflow loaded successfully\n");
      passedTests++;
    } else {
      throw new Error("YAAS Workflow not found");
    }
  } catch (error) {
    console.error("❌ Workflow test failed:", error);
    failedTests++;
  }

  // Test 5: Tools Availability
  console.log("5️⃣ Testing Agent Tools...");
  try {
    const tools = yaasAgent.getTools();
    const toolNames = tools.map(t => t.id);
    
    const expectedTools = ["news-scraper", "article-fetcher", "article-saver"];
    const foundTools = expectedTools.filter(t => toolNames.includes(t));
    
    if (foundTools.length === expectedTools.length) {
      console.log(`✅ All tools loaded: ${foundTools.join(", ")}\n`);
      passedTests++;
    } else {
      const missing = expectedTools.filter(t => !toolNames.includes(t));
      throw new Error(`Missing tools: ${missing.join(", ")}`);
    }
  } catch (error) {
    console.error("❌ Tools test failed:", error);
    failedTests++;
  }

  // Test 6: Environment Variables
  console.log("6️⃣ Testing Environment Variables...");
  try {
    const requiredEnvVars = ["DATABASE_URL", "OPENAI_API_KEY", "EXA_API_KEY"];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    
    if (missingVars.length === 0) {
      console.log("✅ All required environment variables present\n");
      passedTests++;
    } else {
      throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
    }
  } catch (error) {
    console.error("❌ Environment variables test failed:", error);
    failedTests++;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 SMOKE TEST SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log("=".repeat(50));

  if (failedTests === 0) {
    console.log("\n🎉 All tests passed! Your YAAS system is ready to go!");
    process.exit(0);
  } else {
    console.log("\n⚠️ Some tests failed. Please review the errors above.");
    process.exit(1);
  }
}

runSmokeTest().catch((error) => {
  console.error("\n💥 Smoke test crashed:", error);
  process.exit(1);
});
