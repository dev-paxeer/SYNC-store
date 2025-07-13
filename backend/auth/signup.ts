import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

interface SignupRequest {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface SignupResponse {
  user: {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  token: string;
  expires_at: Date;
}

// Creates a new user account.
export const signup = api<SignupRequest, SignupResponse>(
  { expose: true, method: "POST", path: "/auth/signup" },
  async ({ email, username, password, first_name, last_name }) => {
    // Validate input
    if (!email || !username || !password) {
      throw APIError.invalidArgument("email, username, and password are required");
    }

    if (password.length < 8) {
      throw APIError.invalidArgument("password must be at least 8 characters long");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw APIError.invalidArgument("invalid email format");
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      throw APIError.invalidArgument("username must be 3-20 characters and contain only letters, numbers, and underscores");
    }

    // Check if user already exists
    const existingUser = await authDB.queryRow`
      SELECT id FROM users WHERE email = ${email} OR username = ${username}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("user with this email or username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await authDB.queryRow<{
      id: number;
      email: string;
      username: string;
      first_name?: string;
      last_name?: string;
    }>`
      INSERT INTO users (email, username, password_hash, first_name, last_name)
      VALUES (${email}, ${username}, ${passwordHash}, ${first_name}, ${last_name})
      RETURNING id, email, username, first_name, last_name
    `;

    if (!user) {
      throw APIError.internal("failed to create user");
    }

    // Create session
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await authDB.exec`
      INSERT INTO user_sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    return {
      user,
      token,
      expires_at: expiresAt
    };
  }
);
