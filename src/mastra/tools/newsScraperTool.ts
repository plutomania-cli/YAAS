import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

export const newsScraperTool = createTool({
  id: "news-scraper",
  description:
    "Scrapes news articles from verified African news sources like BBC Africa, Daily Trust, and other legitimate outlets to find stories about young African entrepreneurs and innovators",

  inputSchema: z.object({
    sources: z
      .array(z.string())
      .optional()
      .describe("List of news source URLs to scrape"),
  }),

  outputSchema: z.object({
    articles: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        source: z.string(),
        snippet: z.string(),
        publishedDate: z.string().optional(),
      })
    ),
    totalFound: z.number(),
  }),

  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [newsScraperTool] Starting news scraping...");

    const defaultSources = [
      {
        name: "BBC Africa",
        url: "https://www.bbc.com/news/topics/cl8l9mveql2t",
        selector: "article",
      },
      {
        name: "Daily Trust",
        url: "https://dailytrust.com/category/business/",
        selector: "article",
      },
    ];

    const articles: any[] = [];

    try {
      const keywords = [
        "entrepreneur",
        "startup",
        "innovator",
        "founder",
        "business",
        "innovation",
        "tech",
        "young",
        "africa",
      ];

      logger?.info("📰 [newsScraperTool] Searching for relevant articles...");

      for (const source of defaultSources) {
        try {
          logger?.info(`🌐 [newsScraperTool] Fetching from ${source.name}...`);

          const response = await fetch(source.url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });

          if (!response.ok) {
            logger?.warn(
              `⚠️ [newsScraperTool] Failed to fetch ${source.name}: ${response.status}`
            );
            continue;
          }

          const html = await response.text();
          const $ = cheerio.load(html);

          $(source.selector).each((_, element) => {
            const $article = $(element);
            const $link = $article.find("a").first();
            const title = $link.text().trim() || $article.find("h2, h3").text().trim();
            let url = $link.attr("href") || "";

            if (!url || !title) return;

            if (url.startsWith("/")) {
              const baseUrl = new URL(source.url);
              url = `${baseUrl.protocol}//${baseUrl.host}${url}`;
            }

            const snippet =
              $article.find("p").first().text().trim() ||
              $article.text().trim().substring(0, 200);

            const lowerText = (title + " " + snippet).toLowerCase();
            const hasKeyword = keywords.some((keyword) =>
              lowerText.includes(keyword.toLowerCase())
            );

            if (hasKeyword && articles.length < 10) {
              articles.push({
                title,
                url,
                source: source.name,
                snippet: snippet.substring(0, 300),
                publishedDate: new Date().toISOString(),
              });
            }
          });

          logger?.info(
            `✅ [newsScraperTool] Found ${articles.length} relevant articles from ${source.name}`
          );
        } catch (sourceError) {
          logger?.error(
            `❌ [newsScraperTool] Error scraping ${source.name}:`,
            { error: sourceError }
          );
        }
      }

      logger?.info(
        `✅ [newsScraperTool] Scraping complete. Total articles: ${articles.length}`
      );

      return {
        articles: articles.slice(0, 5),
        totalFound: articles.length,
      };
    } catch (error) {
      logger?.error("❌ [newsScraperTool] Error during scraping:", { error });
      return {
        articles: [],
        totalFound: 0,
      };
    }
  },
});
