import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({
  path: [".env.local", ".env"],
});
const queryClient = postgres(`${process.env.DB_URL}`, { max: 1 });
export const db = drizzle(queryClient);

migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration complete");
    return queryClient.end();
  })
  .catch((error) => {
    console.error(error);
  });
