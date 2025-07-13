import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { appsDB } from "./db";
import { authDB } from "../auth/db";

interface DownloadAppParams {
  slug: string;
  authorization?: Header<"Authorization">;
  user_agent?: Header<"User-Agent">;
  x_forwarded_for?: Header<"X-Forwarded-For">;
}

interface DownloadAppResponse {
  download_url: string;
  filename: string;
  size?: number;
}

// Initiates an app download and tracks the download event.
export const downloadApp = api<DownloadAppParams, DownloadAppResponse>(
  { expose: true, method: "POST", path: "/apps/:slug/download" },
  async ({ slug, authorization, user_agent, x_forwarded_for }) => {
    const app = await appsDB.queryRow`
      SELECT id, name, apk_url, apk_size, version
      FROM apps 
      WHERE slug = ${slug} AND published = true
    `;

    if (!app) {
      throw APIError.notFound("app not found");
    }

    if (!app.apk_url) {
      throw APIError.failedPrecondition("app download not available");
    }

    // Get user ID if authenticated
    let userId: number | null = null;
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      const userSession = await authDB.queryRow<{ user_id: number }>`
        SELECT user_id FROM user_sessions 
        WHERE token = ${token} AND expires_at > NOW()
      `;
      if (userSession) {
        userId = userSession.user_id;
      }
    }

    // Track download in apps database
    const userIP = x_forwarded_for || "unknown";
    await appsDB.exec`
      INSERT INTO app_downloads (app_id, user_ip, user_agent)
      VALUES (${app.id}, ${userIP}, ${user_agent || "unknown"})
    `;

    // Track download in user's download history if authenticated
    if (userId) {
      await authDB.exec`
        INSERT INTO user_downloads (user_id, app_id)
        VALUES (${userId}, ${app.id})
      `;
    }

    // Update download count
    await appsDB.exec`
      UPDATE apps 
      SET downloads_count = downloads_count + 1
      WHERE id = ${app.id}
    `;

    const filename = `${app.name.replace(/[^a-zA-Z0-9]/g, '_')}_v${app.version}.apk`;

    return {
      download_url: app.apk_url,
      filename,
      size: app.apk_size
    };
  }
);
