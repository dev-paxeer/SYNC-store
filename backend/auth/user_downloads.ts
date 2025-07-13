import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { authDB } from "./db";

interface UserDownloadsRequest {
  authorization?: Header<"Authorization">;
}

interface UserDownloadsResponse {
  apps: Array<{
    id: number;
    name: string;
    slug: string;
    icon_url?: string;
    developer_name: string;
    category_name: string;
    version: string;
    downloaded_at: Date;
  }>;
}

// Gets the current user's download history.
export const getUserDownloads = api<UserDownloadsRequest, UserDownloadsResponse>(
  { expose: true, method: "GET", path: "/auth/downloads" },
  async ({ authorization }) => {
    if (!authorization) {
      throw APIError.unauthenticated("authorization header required");
    }

    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    const apps = await authDB.queryAll<{
      id: number;
      name: string;
      slug: string;
      icon_url?: string;
      developer_name: string;
      category_name: string;
      version: string;
      downloaded_at: Date;
    }>`
      SELECT DISTINCT ON (a.id) a.id, a.name, a.slug, a.icon_url, d.name as developer_name, 
             c.name as category_name, a.version, ud.downloaded_at
      FROM user_downloads ud
      JOIN apps a ON ud.app_id = a.id
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE ud.user_id = ${userSession.user_id} AND a.published = true
      ORDER BY a.id, ud.downloaded_at DESC
    `;

    return { apps };
  }
);
