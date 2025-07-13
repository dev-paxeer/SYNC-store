import { SQLDatabase } from "encore.dev/storage/sqldb";

export const legalDB = new SQLDatabase("legal", {
  migrations: "./migrations",
});
