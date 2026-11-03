import { eq } from "drizzle-orm";
import { NoWriteError, defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { assertStoreAdmin } from "../server/lib/admin-access.js";
import { STORE_CATALOG_PRODUCT_IDS } from "../app/lib/store-catalog-ids.js";

export default defineAction({
  description: "Remove an Admin-added product or hide a built-in catalog product from the storefront. Only the allowlisted store admin may do this.",
  agentTool: false,
  schema: z.object({
    id: z
      .string()
      .min(1)
      .max(80)
      .regex(/^(?:added-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9]+(?:-[a-z0-9]+)*)$/i)
      .describe("ID of an active product in the store catalog"),
  }),
  http: { method: "DELETE" },
  run: async ({ id }) => {
    assertStoreAdmin();
    if (id.startsWith("added-")) {
      const [row] = await getDb()
        .delete(schema.storeProducts)
        .where(eq(schema.storeProducts.id, id))
        .returning({
          id: schema.storeProducts.id,
          name: schema.storeProducts.name,
        });

      if (!row) {
        throw new NoWriteError("This Admin-added product is no longer in the catalog. Refresh the page and try again.", {
          errorCode: "store_product_missing",
          statusCode: 400,
        });
      }

      return row;
    }

    if (!STORE_CATALOG_PRODUCT_IDS.includes(id as (typeof STORE_CATALOG_PRODUCT_IDS)[number])) {
      throw new NoWriteError("This product is not part of the store catalog. Refresh the page and try again.", {
        errorCode: "store_product_missing",
        statusCode: 400,
      });
    }

    const [row] = await getDb()
      .insert(schema.hiddenStoreProducts)
      .values({ id })
      .onConflictDoNothing()
      .returning({ id: schema.hiddenStoreProducts.id });

    if (!row) {
      throw new NoWriteError("This product has already been removed from the customer catalog.", {
        errorCode: "store_product_already_hidden",
        statusCode: 400,
      });
    }

    return row;
  },
});
