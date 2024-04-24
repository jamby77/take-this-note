import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

import * as schema from "./schema";

dotenv.config({
  path: [".env.local", ".env"],
});

const queryClient = postgres(`${process.env.DB_URL}`);
export const db = drizzle(queryClient, { schema });
