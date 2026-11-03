CREATE TABLE "hidden_store_products" (
	"id" text PRIMARY KEY NOT NULL,
	"hidden_at" timestamp with time zone DEFAULT now() NOT NULL
);
