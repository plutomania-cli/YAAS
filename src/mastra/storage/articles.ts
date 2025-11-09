import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: Date;
  created_at: Date;
  image_url?: string;
}

export async function initializeArticlesTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS yaas_articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT NOT NULL,
        source_name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        image_url TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_yaas_articles_published_at ON yaas_articles(published_at DESC);
    `);
  } finally {
    client.release();
  }
}

export async function saveArticle(article: Omit<Article, 'id' | 'created_at'>): Promise<Article> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO yaas_articles (title, content, summary, source_name, source_url, published_at, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [article.title, article.content, article.summary, article.source_name, article.source_url, article.published_at, article.image_url]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getRecentArticles(limit: number = 20): Promise<Article[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM yaas_articles ORDER BY published_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function articleExists(sourceUrl: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COUNT(*) FROM yaas_articles WHERE source_url = $1`,
      [sourceUrl]
    );
    return parseInt(result.rows[0].count) > 0;
  } finally {
    client.release();
  }
}
