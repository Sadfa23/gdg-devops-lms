import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrate/Studio connect directly with this URL. The app itself connects
    // through the Neon driver adapter instead (src/lib/db.ts) — see that
    // file's comment for why the two paths differ.
    url: env("DATABASE_URL"),
  },
});
