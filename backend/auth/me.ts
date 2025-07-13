import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { authDB } from "./db";
import type { User } from "./types";

interface MeRequest {
  authorization?: Header<"Authorization">;
}

interface MeResponse {
  user: Omit<User, 'password_hash'>;
}

// Gets the current user's profile information.
export const me = api<MeRequest, MeResponse>(
  { expose: true, method: "GET", path: "/auth/me" },
  async ({ authorization }) => {
    if (!authorization) {
      throw APIError.unauthenticated("authorization header required");
    }

    const token = authorization.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("invalid authorization header");
    }

    // Find user by session token
    const result = await authDB.queryRow<{
      id: number;
      email: string;
      username: string;
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
      email_verified: boolean;
      is_developer: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT u.id, u.email, u.username, u.first_name, u.last_name, u.avatar_url, 
             u.email_verified, u.is_developer, u.created_at, u.updated_at
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `;

    if (!result) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    return {
      user: result
    };
  }
);
