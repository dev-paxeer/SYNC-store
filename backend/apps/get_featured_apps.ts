import { api } from "encore.dev/api";
import { appsDB } from "./db";
import type { AppWithDetails } from "./types";

interface GetFeaturedAppsResponse {
  featured_apps: AppWithDetails[];
  trending_apps: AppWithDetails[];
  new_apps: AppWithDetails[];
}

// Retrieves featured, trending, and new apps for the homepage.
export const getFeaturedApps = api<void, GetFeaturedAppsResponse>(
  { expose: true, method: "GET", path: "/apps/featured" },
  async () => {
    // Get featured apps
    const featuredApps = await appsDB.queryAll<AppWithDetails>`
      SELECT 
        a.*,
        d.name as developer_name,
        c.name as category_name,
        c.slug as category_slug
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.published = true AND a.featured = true
      ORDER BY a.downloads_count DESC
      LIMIT 6
    `;

    // Get trending apps (most downloads in last 30 days)
    const trendingApps = await appsDB.queryAll<AppWithDetails>`
      SELECT 
        a.*,
        d.name as developer_name,
        c.name as category_name,
        c.slug as category_slug
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.published = true
      ORDER BY a.downloads_count DESC
      LIMIT 8
    `;

    // Get new apps
    const newApps = await appsDB.queryAll<AppWithDetails>`
      SELECT 
        a.*,
        d.name as developer_name,
        c.name as category_name,
        c.slug as category_slug
      FROM apps a
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.published = true
      ORDER BY a.created_at DESC
      LIMIT 8
    `;

    // Add empty screenshots arrays
    [...featuredApps, ...trendingApps, ...newApps].forEach(app => {
      app.screenshots = [];
    });

    return {
      featured_apps: featuredApps,
      trending_apps: trendingApps,
      new_apps: newApps
    };
  }
);
