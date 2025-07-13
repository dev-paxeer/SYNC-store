import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { appsDB } from "./db";
import type { AppReview } from "./types";

interface ListReviewsParams {
  slug: string;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListReviewsResponse {
  reviews: AppReview[];
  total: number;
  has_more: boolean;
}

// Retrieves reviews for a specific app.
export const listReviews = api<ListReviewsParams, ListReviewsResponse>(
  { expose: true, method: "GET", path: "/apps/:slug/reviews" },
  async ({ slug, limit = 10, offset = 0 }) => {
    // Get app ID
    const app = await appsDB.queryRow`
      SELECT id FROM apps WHERE slug = ${slug} AND published = true
    `;

    if (!app) {
      return { reviews: [], total: 0, has_more: false };
    }

    const reviews = await appsDB.queryAll<AppReview>`
      SELECT * FROM app_reviews 
      WHERE app_id = ${app.id}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await appsDB.queryRow<{ total: number }>`
      SELECT COUNT(*) as total FROM app_reviews WHERE app_id = ${app.id}
    `;
    const total = countResult?.total || 0;

    return {
      reviews,
      total,
      has_more: offset + limit < total
    };
  }
);
