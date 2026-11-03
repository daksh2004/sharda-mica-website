import { count, desc, eq } from "drizzle-orm";
import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { assertStoreAdmin } from "../server/lib/admin-access.js";

export default defineAction({
  description: "List the latest website enquiries and WhatsApp handoff requests for the private store inbox.",
  agentTool: false,
  schema: z.object({
    limit: z.number().int().min(1).max(100).default(50).describe("Page size, up to 100 records"),
    offset: z.number().int().min(0).max(1000000).default(0).describe("Number of earlier records to skip"),
    status: z.enum(["all", "new", "reviewed"]).default("all").describe('Status filter: "all", "new", or "reviewed"'),
  }),
  http: { method: "GET" },
  run: async ({ limit, offset, status }) => {
    assertStoreAdmin();
    const db = getDb();
    const where = status === "all" ? undefined : eq(schema.storeEnquiries.status, status);
    const [totalRow] = await db
      .select({ total: count() })
      .from(schema.storeEnquiries)
      .where(where);
    const [newRow] = await db
      .select({ total: count() })
      .from(schema.storeEnquiries)
      .where(eq(schema.storeEnquiries.status, "new"));
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
    return { records, total: totalRow?.total ?? 0, newTotal: newRow?.total ?? 0 };
  },
});
