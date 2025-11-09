import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { saveArticle, articleExists } from "../storage/articles";

export const articleSaverTool = createTool({
  id: "article-saver",
  description:
    "Saves a curated article to the database with proper source attribution",

  inputSchema: z.object({
    title: z.string().describe("The article title"),
    content: z.string().describe("The full article content"),
    summary: z.string().describe("A brief summary of the article"),
    sourceName: z.string().describe("The name of the news source"),
    sourceUrl: z.string().describe("The URL of the original article"),
    imageUrl: z.string().optional().describe("Optional image URL"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    articleId: z.number().optional(),
    message: z.string(),
  }),

  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [articleSaverTool] Saving article to database...", {
      title: context.title,
      source: context.sourceName,
    });

    try {
      const exists = await articleExists(context.sourceUrl);
      if (exists) {
        logger?.info("⚠️ [articleSaverTool] Article already exists, skipping");
        return {
          success: false,
          message: "Article already exists in database",
        };
      }

      const article = await saveArticle({
        title: context.title,
        content: context.content,
        summary: context.summary,
        source_name: context.sourceName,
        source_url: context.sourceUrl,
        published_at: new Date(),
        image_url: context.imageUrl,
      });

      logger?.info("✅ [articleSaverTool] Article saved successfully", {
        articleId: article.id,
      });

      return {
        success: true,
        articleId: article.id,
        message: `Article saved with ID ${article.id}`,
      };
    } catch (error) {
      logger?.error("❌ [articleSaverTool] Error saving article:", { error });
      return {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },
});
