import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { usersDB } from "./db";
import { authDB } from "../auth/db";

interface GetSettingsRequest {
  authorization: Header<"Authorization">;
}

interface UpdateSettingsRequest {
  authorization: Header<"Authorization">;
  email_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
  theme_preference?: string;
  language?: string;
  timezone?: string;
  accessibility_high_contrast?: boolean;
  accessibility_large_text?: boolean;
}

interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  theme_preference: string;
  language: string;
  timezone: string;
  accessibility_high_contrast: boolean;
  accessibility_large_text: boolean;
}

interface SettingsResponse {
  settings: UserSettings;
}

// Gets the current user's settings.
export const getSettings = api<GetSettingsRequest, SettingsResponse>(
  { expose: true, method: "GET", path: "/users/settings" },
  async ({ authorization }) => {
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    let settings = await usersDB.queryRow<UserSettings>`
      SELECT email_notifications, push_notifications, marketing_emails,
             theme_preference, language, timezone,
             accessibility_high_contrast, accessibility_large_text
      FROM user_settings WHERE user_id = ${userSession.user_id}
    `;

    // Create default settings if doesn't exist
    if (!settings) {
      await usersDB.exec`
        INSERT INTO user_settings (user_id) VALUES (${userSession.user_id})
      `;
      settings = {
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false,
        theme_preference: 'system',
        language: 'en',
        timezone: 'UTC',
        accessibility_high_contrast: false,
        accessibility_large_text: false
      };
    }

    return { settings };
  }
);

// Updates the current user's settings.
export const updateSettings = api<UpdateSettingsRequest, SettingsResponse>(
  { expose: true, method: "PUT", path: "/users/settings" },
  async ({ authorization, ...updates }) => {
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    // Update settings
    await usersDB.exec`
      INSERT INTO user_settings (
        user_id, email_notifications, push_notifications, marketing_emails,
        theme_preference, language, timezone,
        accessibility_high_contrast, accessibility_large_text, updated_at
      ) VALUES (
        ${userSession.user_id}, ${updates.email_notifications}, ${updates.push_notifications},
        ${updates.marketing_emails}, ${updates.theme_preference}, ${updates.language},
        ${updates.timezone}, ${updates.accessibility_high_contrast},
        ${updates.accessibility_large_text}, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        email_notifications = COALESCE(EXCLUDED.email_notifications, user_settings.email_notifications),
        push_notifications = COALESCE(EXCLUDED.push_notifications, user_settings.push_notifications),
        marketing_emails = COALESCE(EXCLUDED.marketing_emails, user_settings.marketing_emails),
        theme_preference = COALESCE(EXCLUDED.theme_preference, user_settings.theme_preference),
        language = COALESCE(EXCLUDED.language, user_settings.language),
        timezone = COALESCE(EXCLUDED.timezone, user_settings.timezone),
        accessibility_high_contrast = COALESCE(EXCLUDED.accessibility_high_contrast, user_settings.accessibility_high_contrast),
        accessibility_large_text = COALESCE(EXCLUDED.accessibility_large_text, user_settings.accessibility_large_text),
        updated_at = NOW()
    `;

    return getSettings({ authorization });
  }
);
