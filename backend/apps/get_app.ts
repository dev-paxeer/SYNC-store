import { api, APIError } from "encore.dev/api";
import { appsDB } from "./db";
import type { AppWithDetails } from "./types";

interface GetAppParams {
  slug: string;
}

// Retrieves a single app by its slug.
export const getApp = api<GetAppParams, AppWithDetails>(
  { expose: true, method: "GET", path: "/apps/:slug" },
  async ({ slug }) => {
    const app = await appsDB.queryRow<AppWithDetails>`
      SELECT 
        a.*,
        d.name as developer_name,
        c.name as category_name,
        c.slug as category_slug
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ${slug} AND a.published = true
    `;

    if (!app) {
      throw APIError.notFound("app not found");
    }

    // Get screenshots
    const screenshots = await appsDB.queryAll`
      SELECT * FROM app_screenshots 
      WHERE app_id = ${app.id} 
      ORDER BY sort_order ASC
    `;
    app.screenshots = screenshots;

    return app;
  }
);
