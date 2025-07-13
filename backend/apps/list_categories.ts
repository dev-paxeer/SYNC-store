import { api } from "encore.dev/api";
import { appsDB } from "./db";
import type { Category } from "./types";

interface ListCategoriesResponse {
  categories: Category[];
}

// Retrieves all app categories.
export const listCategories = api<void, ListCategoriesResponse>(
  { expose: true, method: "GET", path: "/categories" },
  async () => {
    const categories = await appsDB.queryAll<Category>`
      SELECT * FROM categories 
      ORDER BY name ASC
    `;

    return { categories };
  }
);
