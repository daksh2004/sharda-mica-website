import { defineAppConfig } from "@agent-native/core/server";

export default defineAppConfig({
  plugins: {
    disabled: ["integrations", "observational-memory", "sentry", "terminal"],
  },
  // Local development has no email sender, so let the allowlisted admin create
  // the first local account. Hosted environments require verified email.
  auth: {
    requireEmailVerification: process.env.NODE_ENV !== "development",
  },
  app: { homePath: "/" },
});

