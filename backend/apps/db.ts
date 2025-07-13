import { SQLDatabase } from "encore.dev/storage/sqldb";

export const appsDB = new SQLDatabase("apps", {
  migrations: "./migrations",
});
