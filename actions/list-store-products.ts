import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { STORE_CATALOG_PRODUCT_IDS } from "../app/lib/store-catalog-ids.js";
import { getDb, schema } from "../server/db.js";

export default defineAction({
  description:
    "List added store products and active built-in product IDs for the public catalog.",
  requiresAuth: false,
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    const addedProducts = await db
      .select({
        id: schema.storeProducts.id,
        name: schema.storeProducts.name,
        category: schema.storeProducts.category,
        description: schema.storeProducts.description,
        imageUrl: schema.storeProducts.imageUrl,
        createdAt: schema.storeProducts.createdAt,
      })
      .from(schema.storeProducts)
      .orderBy(desc(schema.storeProducts.createdAt));

    const hiddenRows = await db
      .select({ id: schema.hiddenStoreProducts.id })
      .from(schema.hiddenStoreProducts);
    const hiddenIds = new Set(hiddenRows.map((row) => row.id));

    return {
      addedProducts,
      activeCatalogIds: STORE_CATALOG_PRODUCT_IDS.filter(
        (id) => !hiddenIds.has(id),
      ),
    };
  },
});
