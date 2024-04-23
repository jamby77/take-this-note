import type { Config } from "drizzle-kit";
// @ts-ignore
import dotenv from "dotenv";
dotenv.config({
  path: [".env.local", ".env"],
});

export default {
  schema: "./src/data/schema.ts",
  out: "./drizzle",
  driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
} satisfies Config;
