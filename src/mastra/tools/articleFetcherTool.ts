import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

export const articleFetcherTool = createTool({
  id: "article-fetcher",
  description:
    "Fetches the full content of an article from a given URL, extracting the main text content and any available metadata",

  inputSchema: z.object({
    url: z.string().describe("The URL of the article to fetch"),
    sourceName: z.string().describe("The name of the news source"),
  }),

  outputSchema: z.object({
    success: z.boolean(),
    content: z.string().optional(),
    title: z.string().optional(),
    error: z.string().optional(),
  }),

  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [articleFetcherTool] Fetching article content...", {
      url: context.url,
    });

    try {
      const response = await fetch(context.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        logger?.warn(
          `⚠️ [articleFetcherTool] Failed to fetch article: ${response.status}`
        );
        return {
          success: false,
          error: `Failed to fetch: ${response.status}`,
        };
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $("script, style, nav, header, footer, iframe, .advertisement").remove();

      const title =
        $("h1").first().text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        $("title").text().trim();

      const paragraphs: string[] = [];
      $("article p, .article-body p, .content p, main p").each((_, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });

      let content = paragraphs.join("\n\n");

      if (!content || content.length < 200) {
        $("p").each((_, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 50) {
            paragraphs.push(text);
          }
        });
        content = paragraphs.slice(0, 15).join("\n\n");
      }

      logger?.info("✅ [articleFetcherTool] Article fetched successfully", {
        contentLength: content.length,
      });

      return {
        success: true,
        content: content.substring(0, 4000),
        title,
      };
    } catch (error) {
      logger?.error("❌ [articleFetcherTool] Error fetching article:", {
        error,
      });
      return {
        success: false,
        error: String(error),
      };
    }
  },
});
