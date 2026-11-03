import { eq } from "drizzle-orm";
import { defineAction, fail } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { assertStoreAdmin } from "../server/lib/admin-access.js";

export default defineAction({
  description: "Mark a store inbox enquiry as new or reviewed.",
  agentTool: false,
  schema: z.object({
    id: z.string().uuid().describe("Enquiry id"),
    status: z.enum(["new", "reviewed"]).describe('New or reviewed status'),
  }),
  run: async ({ id, status }) => {
    assertStoreAdmin();
    const db = getDb();
    const [row] = await db
      .update(schema.storeEnquiries)
      .set({ status })
      .where(eq(schema.storeEnquiries.id, id))
      .returning({
        id: schema.storeEnquiries.id,
        status: schema.storeEnquiries.status,
      });
    if (!row) {
      fail("This enquiry is no longer available in the inbox.", {
        errorCode: "enquiry_missing",
        statusCode: 400,
      });
    }
    return row;
  },
});
