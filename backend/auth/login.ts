import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    is_developer: boolean;
  };
  token: string;
  expires_at: Date;
}

// Authenticates a user and creates a session.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async ({ email, password }) => {
    if (!email || !password) {
      throw APIError.invalidArgument("email and password are required");
    }

    // Find user
    const user = await authDB.queryRow<{
      id: number;
      email: string;
      username: string;
      password_hash: string;
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
      is_developer: boolean;
    }>`
      SELECT id, email, username, password_hash, first_name, last_name, avatar_url, is_developer
      FROM users 
      WHERE email = ${email}
    `;

    if (!user) {
      throw APIError.unauthenticated("invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw APIError.unauthenticated("invalid email or password");
    }

    // Clean up expired sessions
    await authDB.exec`
      DELETE FROM user_sessions 
      WHERE user_id = ${user.id} AND expires_at < NOW()
    `;

    // Create new session
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await authDB.exec`
      INSERT INTO user_sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    // Return user data without password hash
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expires_at: expiresAt
    };
  }
);
