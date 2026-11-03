import { and, count, desc, eq, gte, lt } from "drizzle-orm";
import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { assertStoreAdmin } from "../server/lib/admin-access.js";

const indiaDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return (
      parsed.getUTCFullYear() === year &&
      parsed.getUTCMonth() === month - 1 &&
      parsed.getUTCDate() === day
    );
  }, "Choose a valid calendar date.");

export default defineAction({
  description:
    "List every saved store enquiry for one India-local calendar date, in pages, for the private Admin PDF export.",
  agentTool: false,
  schema: z.object({
    date: indiaDate.describe("Calendar date in YYYY-MM-DD format, interpreted in Asia/Kolkata"),
    status: z
      .enum(["all", "new", "reviewed"])
      .default("all")
      .describe('Optional status filter: "all", "new", or "reviewed"'),
    limit: z.number().int().min(1).max(100).default(100),
    offset: z.number().int().min(0).max(1000000).default(0),
  }),
  http: { method: "GET" },
  run: async ({ date, status, limit, offset }) => {
    assertStoreAdmin();

    // Jabalpur uses Asia/Kolkata year-round (UTC+05:30).
    const start = new Date(`${date}T00:00:00+05:30`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const dateRange = and(
      gte(schema.storeEnquiries.createdAt, start.toISOString()),
      lt(schema.storeEnquiries.createdAt, end.toISOString()),
    );
    const where =
      status === "all"
        ? dateRange
        : and(dateRange, eq(schema.storeEnquiries.status, status));
    const db = getDb();
    const [totalRow] = await db
      .select({ total: count() })
      .from(schema.storeEnquiries)
      .where(where);
    const records = await db
      .select({
        id: schema.storeEnquiries.id,
        source: schema.storeEnquiries.source,
        customerName: schema.storeEnquiries.customerName,
        customerPhone: schema.storeEnquiries.customerPhone,
        customerType: schema.storeEnquiries.customerType,
        message: schema.storeEnquiries.message,
        status: schema.storeEnquiries.status,
        createdAt: schema.storeEnquiries.createdAt,
      })
      .from(schema.storeEnquiries)
      .where(where)
      .orderBy(desc(schema.storeEnquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return { records, total: totalRow?.total ?? 0 };
  },
});
