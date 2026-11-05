/// <reference types="node" />
import "dotenv/config";
import { createDrizzleConfig } from "@agent-native/core/db/drizzle-config";

export default createDrizzleConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  url: "postgresql://neondb_owner:npg_KNZxgdQfr2O0@ep-calm-forest-aowt98dt.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});