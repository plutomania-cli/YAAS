
import { createRoute } from "@mastra/core";
import { readFileSync } from "fs";
import { join } from "path";

export const frontendRoute = createRoute({
  path: "/",
  method: "GET",
  createHandler: async () => {
    return async (c) => {
      try {
        const htmlPath = join(process.cwd(), "public", "index.html");
        const html = readFileSync(htmlPath, "utf-8");
        
        return c.html(html);
      } catch (error) {
        return c.json({ error: "Frontend not found" }, 404);
      }
    };
  },
});
