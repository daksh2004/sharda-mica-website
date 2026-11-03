import { fail, defineAction } from "@agent-native/core/action";
import { getActiveFileUploadProviderForRequest } from "@agent-native/core/server";
import { getDb, schema } from "../server/db.js";
import { assertStoreAdmin } from "../server/lib/admin-access.js";
import { z } from "zod";

const productCategory = z.enum([
  "Plywood & Boards",
  "Laminates",
  "Doors",
  "Carpentry Materials",
  "Modular Kitchen",
  "Louvers",
  "Adhesives",
]);

export default defineAction({
  description: "Add a product with its category, description, and hosted photo to the customer catalog.",
  agentTool: false,
  schema: z.object({
    name: z.string().trim().min(2).max(120).describe("Product name shown on the storefront"),
    category: productCategory.describe("Existing storefront category"),
    description: z.string().trim().max(500).default("").describe("Short customer-facing product description"),
    imageUrl: z.string().trim().url().max(2048).describe("HTTPS URL returned by the configured product photo upload provider"),
  }),
  run: async ({ name, category, description, imageUrl }) => {
    assertStoreAdmin();
    const parsedUrl = new URL(imageUrl);
    if (parsedUrl.protocol !== "https:") {
      fail("Product photos must be uploaded to secure hosted storage first.", {
        errorCode: "invalid_product_photo",
      });
    }

    const provider = await getActiveFileUploadProviderForRequest();
    if (!provider?.isOwnedUrl || !(await provider.isOwnedUrl(imageUrl))) {
      fail("Upload this photo through the product photo field before saving the product.", {
        errorCode: "unverified_product_photo",
      });
    }

    const db = getDb();
    const [row] = await db
      .insert(schema.storeProducts)
      .values({
        id: `added-${crypto.randomUUID()}`,
        name,
        category,
        description,
        imageUrl,
      })
      .returning({
        id: schema.storeProducts.id,
        name: schema.storeProducts.name,
        category: schema.storeProducts.category,
        imageUrl: schema.storeProducts.imageUrl,
      });
    return row;
  },
});
