import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { developerDB } from "./db";
import { authDB } from "../auth/db";
import { appsDB } from "../apps/db";

interface SubmitAppRequest {
  authorization: Header<"Authorization">;
  name: string;
  description: string;
  short_description?: string;
  category_id: number;
  icon_url?: string;
  banner_url?: string;
  screenshots?: string[];
  version: string;
  apk_url?: string;
  apk_size?: number;
  package_name?: string;
  min_android_version?: string;
  target_android_version?: string;
  permissions?: string[];
  is_web3?: boolean;
  blockchain_networks?: string[];
  wallet_required?: boolean;
  github_repo?: string;
  website_url?: string;
}

interface SubmitAppResponse {
  submission_id: number;
  message: string;
}

// Submits a new app for review.
export const submitApp = api<SubmitAppRequest, SubmitAppResponse>(
  { expose: true, method: "POST", path: "/developer/submit" },
  async ({ authorization, ...appData }) => {
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    // Check if user is a developer
    const user = await authDB.queryRow<{ is_developer: boolean; email: string }>`
      SELECT is_developer, email FROM users WHERE id = ${userSession.user_id}
    `;

    if (!user?.is_developer) {
      throw APIError.permissionDenied("developer access required");
    }

    // Get or create developer record
    let developer = await appsDB.queryRow<{ id: number }>`
      SELECT id FROM developers WHERE email = ${user.email}
    `;

    if (!developer) {
      developer = await appsDB.queryRow<{ id: number }>`
        INSERT INTO developers (name, email, verified)
        VALUES ('Developer', ${user.email}, false)
        RETURNING id
      `;
    }

    // Validate required fields
    if (!appData.name || !appData.description || !appData.version) {
      throw APIError.invalidArgument("name, description, and version are required");
    }

    // Check if category exists
    const category = await appsDB.queryRow`
      SELECT id FROM categories WHERE id = ${appData.category_id}
    `;

    if (!category) {
      throw APIError.invalidArgument("invalid category_id");
    }

    // Create submission
    const submission = await developerDB.queryRow<{ id: number }>`
      INSERT INTO app_submissions (
        developer_id, name, description, short_description, category_id,
        icon_url, banner_url, screenshots, version, apk_url, apk_size,
        package_name, min_android_version, target_android_version, permissions,
        is_web3, blockchain_networks, wallet_required, github_repo, website_url
      ) VALUES (
        ${developer.id}, ${appData.name}, ${appData.description}, ${appData.short_description},
        ${appData.category_id}, ${appData.icon_url}, ${appData.banner_url}, ${appData.screenshots},
        ${appData.version}, ${appData.apk_url}, ${appData.apk_size}, ${appData.package_name},
        ${appData.min_android_version}, ${appData.target_android_version}, ${appData.permissions},
        ${appData.is_web3 || false}, ${appData.blockchain_networks}, ${appData.wallet_required || false},
        ${appData.github_repo}, ${appData.website_url}
      ) RETURNING id
    `;

    return {
      submission_id: submission!.id,
      message: "app submitted for review"
    };
  }
);
