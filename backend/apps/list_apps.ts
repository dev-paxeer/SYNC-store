import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { appsDB } from "./db";
import type { AppWithDetails } from "./types";

interface ListAppsParams {
  category?: Query<string>;
  search?: Query<string>;
  web3_only?: Query<boolean>;
  featured?: Query<boolean>;
  sort?: Query<"popular" | "rating" | "newest">;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListAppsResponse {
  apps: AppWithDetails[];
  total: number;
  has_more: boolean;
}

// Retrieves all published apps with filtering and sorting options.
export const listApps = api<ListAppsParams, ListAppsResponse>(
  { expose: true, method: "GET", path: "/apps" },
  async (params) => {
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    
    let whereClause = "WHERE a.published = true";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.category) {
      whereClause += ` AND c.slug = $${paramIndex}`;
      queryParams.push(params.category);
      paramIndex++;
    }

    if (params.web3_only) {
      whereClause += ` AND a.is_web3 = $${paramIndex}`;
      queryParams.push(params.web3_only);
      paramIndex++;
    }

    if (params.featured) {
      whereClause += ` AND a.featured = $${paramIndex}`;
      queryParams.push(params.featured);
      paramIndex++;
    }

    if (params.search) {
      whereClause += ` AND (a.name ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex} OR d.name ILIKE $${paramIndex})`;
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    let orderClause = "ORDER BY a.created_at DESC";
    if (params.sort === "popular") {
      orderClause = "ORDER BY a.downloads_count DESC";
    } else if (params.sort === "rating") {
      orderClause = "ORDER BY a.rating_average DESC, a.rating_count DESC";
    }

    const query = `
      SELECT 
        a.*,
        d.name as developer_name,
        c.name as category_name,
        c.slug as category_slug
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const apps = await appsDB.rawQueryAll<AppWithDetails>(query, ...queryParams);

    // Get screenshots for each app
    for (const app of apps) {
      const screenshots = await appsDB.queryAll`
        SELECT * FROM app_screenshots 
        WHERE app_id = ${app.id} 
        ORDER BY sort_order ASC
      `;
      app.screenshots = screenshots;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Remove limit and offset
    const countResult = await appsDB.rawQueryRow<{ total: number }>(countQuery, ...countParams);
    const total = countResult?.total || 0;

    return {
      apps,
      total,
      has_more: offset + limit < total
    };
  }
);
