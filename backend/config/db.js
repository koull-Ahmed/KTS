import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL, PGUSER, PGHOST, PGDATABASE, PGPASSWORD } = process.env;
let connectionString = DATABASE_URL;

if (!connectionString) {
  const missingDatabaseVariables = [
    ["PGUSER", PGUSER],
    ["PGHOST", PGHOST],
    ["PGDATABASE", PGDATABASE],
    ["PGPASSWORD", PGPASSWORD],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingDatabaseVariables.length > 0) {
    throw new Error(
      `Missing required database environment variables: ${missingDatabaseVariables.join(", ")}`,
    );
  }

  connectionString = `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(
    PGPASSWORD,
  )}@${PGHOST}/${encodeURIComponent(PGDATABASE)}?sslmode=require`;
}

export const sql = neon(connectionString);
