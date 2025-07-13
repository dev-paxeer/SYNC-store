import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { developerDB } from "./db";
import { authDB } from "../auth/db";
import { appsDB } from "../apps/db";

interface DashboardRequest {
  authorization: Header<"Authorization">;
}

interface DashboardStats {
  total_apps: number;
  total_downloads: number;
  total_revenue: number;
  average_rating: number;
  pending_reviews: number;
  monthly_downloads: number;
  monthly_revenue: number;
}

interface AppSummary {
  id: number;
  name: string;
  slug: string;
  version: string;
  status: string;
  downloads_count: number;
  rating_average: number;
  rating_count: number;
  last_updated: Date;
}

interface DashboardResponse {
  stats: DashboardStats;
  recent_apps: AppSummary[];
  analytics_data: Array<{
    date: string;
    downloads: number;
    revenue: number;
  }>;
}

// Gets developer dashboard data.
export const getDashboard = api<DashboardRequest, DashboardResponse>(
  { expose: true, method: "GET", path: "/developer/dashboard" },
  async ({ authorization }) => {
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    // Check if user is a developer
    const developer = await authDB.queryRow<{ id: number; is_developer: boolean }>`
      SELECT id, is_developer FROM users WHERE id = ${userSession.user_id}
    `;

    if (!developer?.is_developer) {
      throw APIError.permissionDenied("developer access required");
    }

    // Get developer ID from apps table
    const developerRecord = await appsDB.queryRow<{ id: number }>`
      SELECT id FROM developers WHERE email = (
        SELECT email FROM users WHERE id = ${userSession.user_id}
      )
    `;

    if (!developerRecord) {
      throw APIError.notFound("developer profile not found");
    }

    const developerId = developerRecord.id;

    // Get basic stats
    const stats = await appsDB.queryRow<{
      total_apps: number;
      total_downloads: number;
      average_rating: number;
    }>`
      SELECT 
        COUNT(*) as total_apps,
        COALESCE(SUM(downloads_count), 0) as total_downloads,
        COALESCE(AVG(rating_average), 0) as average_rating
      FROM apps 
      WHERE developer_id = ${developerId} AND published = true
    `;

    // Get pending submissions
    const pendingReviews = await developerDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM app_submissions 
      WHERE developer_id = ${developerId} AND status = 'pending'
    `;

    // Get monthly stats (last 30 days)
    const monthlyStats = await developerDB.queryRow<{
      monthly_downloads: number;
      monthly_revenue: number;
    }>`
      SELECT 
        COALESCE(SUM(downloads), 0) as monthly_downloads,
        COALESCE(SUM(revenue), 0) as monthly_revenue
      FROM developer_analytics 
      WHERE developer_id = ${developerId} 
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    `;

    // Get recent apps
    const recentApps = await appsDB.queryAll<AppSummary>`
      SELECT id, name, slug, version, 'published' as status,
             downloads_count, rating_average, rating_count, updated_at as last_updated
      FROM apps 
      WHERE developer_id = ${developerId} AND published = true
      ORDER BY updated_at DESC
      LIMIT 5
    `;

    // Get analytics data (last 30 days)
    const analyticsData = await developerDB.queryAll<{
      date: string;
      downloads: number;
      revenue: number;
    }>`
      SELECT 
        date::text,
        total_downloads as downloads,
        total_revenue as revenue
      FROM developer_analytics 
      WHERE developer_id = ${developerId} 
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY date ASC
    `;

    return {
      stats: {
        total_apps: stats?.total_apps || 0,
        total_downloads: stats?.total_downloads || 0,
        total_revenue: monthlyStats?.monthly_revenue || 0,
        average_rating: stats?.average_rating || 0,
        pending_reviews: pendingReviews?.count || 0,
        monthly_downloads: monthlyStats?.monthly_downloads || 0,
        monthly_revenue: monthlyStats?.monthly_revenue || 0
      },
      recent_apps: recentApps,
      analytics_data: analyticsData
    };
  }
);
