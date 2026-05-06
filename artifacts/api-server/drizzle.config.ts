import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL deve estar definida. Verifique se o banco de dados está provisionado.");
}

export default defineConfig({
  schema: "./src/db/schema/appointments.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
