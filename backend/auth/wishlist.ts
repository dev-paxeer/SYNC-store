import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { authDB } from "./db";
import { appsDB } from "../apps/db";

interface WishlistRequest {
  authorization?: Header<"Authorization">;
}

interface AddToWishlistRequest {
  authorization?: Header<"Authorization">;
  app_id: number;
}

interface RemoveFromWishlistRequest {
  authorization?: Header<"Authorization">;
  app_id: number;
}

interface WishlistResponse {
  apps: Array<{
    id: number;
    name: string;
    slug: string;
    icon_url?: string;
    developer_name: string;
    category_name: string;
    rating_average: number;
    downloads_count: number;
    added_at: Date;
  }>;
}

interface WishlistActionResponse {
  message: string;
}

// Gets the current user's wishlist.
export const getWishlist = api<WishlistRequest, WishlistResponse>(
  { expose: true, method: "GET", path: "/auth/wishlist" },
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
      rating_average: number;
      downloads_count: number;
      added_at: Date;
    }>`
      SELECT a.id, a.name, a.slug, a.icon_url, d.name as developer_name, 
             c.name as category_name, a.rating_average, a.downloads_count,
             w.created_at as added_at
      FROM user_wishlist w
      JOIN apps a ON w.app_id = a.id
      JOIN developers d ON a.developer_id = d.id
      JOIN categories c ON a.category_id = c.id
      WHERE w.user_id = ${userSession.user_id} AND a.published = true
      ORDER BY w.created_at DESC
    `;

    return { apps };
  }
);

// Adds an app to the user's wishlist.
export const addToWishlist = api<AddToWishlistRequest, WishlistActionResponse>(
  { expose: true, method: "POST", path: "/auth/wishlist/:app_id" },
  async ({ authorization, app_id }) => {
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

    // Check if app exists
    const app = await appsDB.queryRow`
      SELECT id FROM apps WHERE id = ${app_id} AND published = true
    `;

    if (!app) {
      throw APIError.notFound("app not found");
    }

    // Check if already in wishlist
    const existing = await authDB.queryRow`
      SELECT id FROM user_wishlist 
      WHERE user_id = ${userSession.user_id} AND app_id = ${app_id}
    `;

    if (existing) {
      throw APIError.alreadyExists("app already in wishlist");
    }

    // Add to wishlist
    await authDB.exec`
      INSERT INTO user_wishlist (user_id, app_id)
      VALUES (${userSession.user_id}, ${app_id})
    `;

    return { message: "app added to wishlist" };
  }
);

// Removes an app from the user's wishlist.
export const removeFromWishlist = api<RemoveFromWishlistRequest, WishlistActionResponse>(
  { expose: true, method: "DELETE", path: "/auth/wishlist/:app_id" },
  async ({ authorization, app_id }) => {
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

    // Remove from wishlist
    const result = await authDB.exec`
      DELETE FROM user_wishlist 
      WHERE user_id = ${userSession.user_id} AND app_id = ${app_id}
    `;

    return { message: "app removed from wishlist" };
  }
);
