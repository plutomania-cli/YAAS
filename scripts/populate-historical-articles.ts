
import { mastra } from "../src/mastra";
import { yaasAgent } from "../src/mastra/agents/yaasAgent";

async function populateHistoricalArticles() {
  console.log("🚀 Starting historical article population...");

  const historicalPrompts = [
    {
      year: 2020,
      topics: [
        "Young African tech founders launching startups during COVID-19",
        "African fintech innovation in 2020",
        "Young Nigerian entrepreneurs building e-commerce platforms"
      ]
    },
    {
      year: 2021,
      topics: [
        "African startup funding rounds in 2021",
        "Young Kenyan tech innovators in agriculture",
        "African women entrepreneurs in technology"
      ]
    },
    {
      year: 2022,
      topics: [
        "African unicorn startups and their young founders",
        "South African young entrepreneurs in renewable energy",
        "Pan-African startup success stories"
      ]
    },
    {
      year: 2023,
      topics: [
        "Young African founders raising Series A funding",
        "African AI and machine learning innovators",
        "Nigerian fintech founders expanding across Africa"
      ]
    },
    {
      year: 2024,
      topics: [
        "Young African entrepreneurs in health tech",
        "African edtech startups and their founders",
        "Ghanaian young innovators in logistics and delivery"
      ]
    }
  ];

  for (const yearData of historicalPrompts) {
    console.log(`\n📅 Processing articles from ${yearData.year}...`);
    
    for (const topic of yearData.topics) {
      console.log(`\n🔍 Searching for: ${topic}`);
      
      try {
        const prompt = `
          Research and create a well-written article about: "${topic}"
          
          Requirements:
          - Focus on real, verifiable stories from ${yearData.year}
          - Use credible African news sources (BBC Africa, TechCabal, Disrupt Africa, etc.)
          - Highlight specific entrepreneurs, their companies, and achievements
          - Include funding amounts, user metrics, or impact numbers when available
          - Write 400-600 words in an inspiring, professional tone
          - Create a compelling 2-3 sentence summary
          - Set the published date to sometime in ${yearData.year}
          - Always cite original sources
          
          After writing the article, use the article-saver tool to save it to the database.
        `;

        const response = await yaasAgent.generate(prompt, { mastra });
        
        console.log(`✅ Processed article about: ${topic}`);
        console.log(`Response: ${response.text?.substring(0, 150)}...`);
        
        // Add a small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error processing "${topic}":`, error);
      }
    }
  }

  console.log("\n✨ Historical article population complete!");
}

populateHistoricalArticles().catch(console.error);
