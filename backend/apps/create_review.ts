import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { appsDB } from "./db";
import { authDB } from "../auth/db";

interface CreateReviewParams {
  slug: string;
  authorization?: Header<"Authorization">;
}

interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}

interface CreateReviewResponse {
  id: number;
  message: string;
}

// Creates a new review for an app.
export const createReview = api<CreateReviewParams & CreateReviewRequest, CreateReviewResponse>(
  { expose: true, method: "POST", path: "/apps/:slug/reviews" },
  async ({ slug, authorization, rating, title, comment }) => {
    if (!authorization) {
      throw APIError.unauthenticated("authentication required to submit reviews");
    }

    if (rating < 1 || rating > 5) {
      throw APIError.invalidArgument("rating must be between 1 and 5");
    }

    // Get user from session
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    // Get user details
    const user = await authDB.queryRow<{ username: string; email: string }>`
      SELECT username, email FROM users WHERE id = ${userSession.user_id}
    `;

    if (!user) {
      throw APIError.unauthenticated("user not found");
    }

    // Get app
    const app = await appsDB.queryRow`
      SELECT id FROM apps WHERE slug = ${slug} AND published = true
    `;

    if (!app) {
      throw APIError.notFound("app not found");
    }

    // Check if user already reviewed this app
    const existingReview = await appsDB.queryRow`
      SELECT id FROM app_reviews 
      WHERE app_id = ${app.id} AND user_email = ${user.email}
    `;

    if (existingReview) {
      throw APIError.alreadyExists("you have already reviewed this app");
    }

    // Create review
    const review = await appsDB.queryRow<{ id: number }>`
      INSERT INTO app_reviews (app_id, user_name, user_email, rating, title, comment)
      VALUES (${app.id}, ${user.username}, ${user.email}, ${rating}, ${title}, ${comment})
      RETURNING id
    `;

    // Update app rating
    const ratingStats = await appsDB.queryRow<{ avg_rating: number; count: number }>`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM app_reviews 
      WHERE app_id = ${app.id}
    `;

    if (ratingStats) {
      await appsDB.exec`
        UPDATE apps 
        SET rating_average = ${ratingStats.avg_rating}, rating_count = ${ratingStats.count}
        WHERE id = ${app.id}
      `;
    }

    return {
      id: review!.id,
      message: "review created successfully"
    };
  }
);
