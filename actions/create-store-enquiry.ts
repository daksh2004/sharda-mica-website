import { defineAction, fail } from "@agent-native/core/action";
import { getDb, schema } from "../server/db.js";
import { z } from "zod";

export default defineAction({
  description: "Save a website contact form submission, product enquiry, or WhatsApp handoff request in the store inbox.",
  agentTool: false,
  schema: z
    .object({
      source: z.enum(["contact", "product", "cart"]).describe("Where this enquiry started"),
      customerName: z.string().trim().max(100).default(""),
      customerPhone: z.string().trim().max(24).default(""),
      customerType: z.string().trim().max(80).default(""),
      message: z.string().trim().min(4).max(1800).describe("Customer request or product list"),
      consent: z.boolean().default(false).describe("Customer consent to store submitted contact details"),
      website: z.string().max(120).default("").describe("Spam prevention field; keep empty"),
    })
    .superRefine((values, context) => {
      if (values.source === "contact") {
        if (!values.customerName || !values.customerPhone || !values.customerType) {
          context.addIssue({ code: "custom", message: "Name, mobile number, and customer type are required for contact enquiries." });
        }
        if (!values.consent) {
          context.addIssue({ code: "custom", message: "Consent is required before storing contact details." });
        }
      }
      if ((values.source === "cart" || values.source === "product") && !values.consent) {
        context.addIssue({ code: "custom", message: "Consent is required before saving this website enquiry." });
      }
      if (values.customerPhone) {
        const digits = values.customerPhone.replace(/\D/g, "");
        if (digits.length < 8 || digits.length > 15) {
          context.addIssue({ code: "custom", message: "Enter a valid mobile number." });
        }
      }
    }),
  run: async ({ source, customerName, customerPhone, customerType, message, website }) => {
    if (website.trim()) {
      fail("The enquiry could not be processed.", { errorCode: "invalid_enquiry" });
    }

    const db = getDb();
    const [row] = await db
      .insert(schema.storeEnquiries)
      .values({
        id: crypto.randomUUID(),
        source,
        customerName,
        customerPhone,
        customerType,
        message,
      })
      .returning({
        id: schema.storeEnquiries.id,
        createdAt: schema.storeEnquiries.createdAt,
      });
    return row;
  },
});
