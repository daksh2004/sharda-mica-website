import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List store catalog product IDs hidden from the public storefront.",
  agentTool: false,
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const rows = await getDb()
      .select({ id: schema.hiddenStoreProducts.id })
      .from(schema.hiddenStoreProducts);
    return rows.map((row) => row.id);
  },
});
