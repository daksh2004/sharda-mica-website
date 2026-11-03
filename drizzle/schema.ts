import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const storeProducts = pgTable("store_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const hiddenStoreProducts = pgTable("hidden_store_products", {
  id: text("id").primaryKey(),
  hiddenAt: timestamp("hidden_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const storeEnquiries = pgTable(
  "store_enquiries",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    customerName: text("customer_name").notNull().default(""),
    customerPhone: text("customer_phone").notNull().default(""),
    customerType: text("customer_type").notNull().default(""),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("store_enquiries_status_created_idx").on(table.status, table.createdAt),
  ],
);
