import { getRecentArticles } from "../storage/articles";

export function registerArticlesApi() {
  return [
    {
      path: "/api/articles",
      method: "GET" as const,
      createHandler: async () => {
        return async (c: any) => {
          const mastra = c.get("mastra");
          const logger = mastra?.getLogger();

          try {
            logger?.info("📰 [ArticlesAPI] Fetching recent articles");
            const articles = await getRecentArticles(50);

            return c.json({
              success: true,
              articles: articles.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                summary: article.summary,
                sourceName: article.source_name,
                sourceUrl: article.source_url,
                publishedAt: article.published_at,
                createdAt: article.created_at,
                imageUrl: article.image_url,
              })),
              total: articles.length,
            });
          } catch (error) {
            logger?.error("❌ [ArticlesAPI] Error fetching articles:", {
              error,
            });
            return c.json({ success: false, error: String(error) }, 500);
          }
        };
      },
    },
  ];
}
