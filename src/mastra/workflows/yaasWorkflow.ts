import { createStep, createWorkflow } from "../inngest";
import { z } from "zod";
import { yaasAgent } from "../agents/yaasAgent";

const discoverAndCurateArticles = createStep({
  id: "discover-and-curate-articles",
  description:
    "Discovers news about young African entrepreneurs and curates articles using AI",

  inputSchema: z.object({}),

  outputSchema: z.object({
    articlesProcessed: z.number(),
    summary: z.string(),
    success: z.boolean(),
  }),

  execute: async ({ mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info(
      "🚀 [YAAS Workflow] Starting article discovery and curation..."
    );

    try {
      const prompt = `
        You are the YAAS Content Curator. Your task is to discover and create articles about young African entrepreneurs and innovators.

        Please follow these steps:
        1. Use the news-scraper tool to find recent articles from verified African news sources about young entrepreneurs, startups, and innovators
        2. Review the discovered articles and select the most compelling 2-3 stories
        3. For each selected story:
           - Use the article-fetcher tool to get the full content
           - Create a well-written, inspiring article (400-800 words) that:
             * Highlights the entrepreneur's journey and achievements
             * Includes specific details about their company/innovation
             * Maintains a professional yet inspiring tone
             * Celebrates African innovation authentically
           - Create a compelling 2-3 sentence summary
           - Use the article-saver tool to save it to the database with proper source attribution
        
        Focus on stories that showcase innovation, entrepreneurship, and success in Africa. Always provide proper source attribution with links to original articles.
      `;

      logger?.info("🤖 [YAAS Workflow] Calling AI agent for content curation");

      const response = await yaasAgent.generate(prompt);

      logger?.info("✅ [YAAS Workflow] AI agent completed content curation");
      logger?.info("📄 [YAAS Workflow] Response:", {
        responseLength: response.text?.length || 0,
      });

      return {
        articlesProcessed: 1,
        summary: `Content curation completed. Agent response: ${response.text?.substring(0, 200)}...`,
        success: true,
      };
    } catch (error) {
      logger?.error("❌ [YAAS Workflow] Error during article curation:", {
        error,
      });
      return {
        articlesProcessed: 0,
        summary: `Error: ${error}`,
        success: false,
      };
    }
  },
});

export const yaasWorkflow = createWorkflow({
  id: "yaas-content-automation",
  inputSchema: z.object({}) as any,
  outputSchema: z.object({
    articlesProcessed: z.number(),
    summary: z.string(),
    success: z.boolean(),
  }),
})
  .then(discoverAndCurateArticles as any)
  .commit();
