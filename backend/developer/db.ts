import { SQLDatabase } from "encore.dev/storage/sqldb";

export const developerDB = new SQLDatabase("developer", {
  migrations: "./migrations",
});
