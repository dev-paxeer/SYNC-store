import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { authDB } from "./db";

interface LogoutRequest {
  authorization?: Header<"Authorization">;
}

interface LogoutResponse {
  message: string;
}

// Logs out a user by invalidating their session.
export const logout = api<LogoutRequest, LogoutResponse>(
  { expose: true, method: "POST", path: "/auth/logout" },
  async ({ authorization }) => {
    if (!authorization) {
      throw APIError.unauthenticated("authorization header required");
    }

    const token = authorization.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("invalid authorization header");
    }

    // Delete the session
    await authDB.exec`
      DELETE FROM user_sessions WHERE token = ${token}
    `;

    return {
      message: "logged out successfully"
    };
  }
);
