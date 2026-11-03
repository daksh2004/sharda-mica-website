import { fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";

export function assertStoreAdmin() {
  const allowedEmail = process.env.SHARDA_ADMIN_EMAIL?.trim().toLowerCase() ?? ""; // guard:allow-env-credential — server-only admin email allowlist.
  const callerEmail = getRequestUserEmail()?.trim().toLowerCase() ?? "";

  if (!allowedEmail) {
    fail("Admin access is not configured on this server.", {
      errorCode: "admin_not_configured",
      statusCode: 503,
    });
  }
  if (!callerEmail) {
    fail("Sign in with the store admin account to continue.", {
      errorCode: "authentication_required",
      statusCode: 401,
    });
  }
  if (callerEmail !== allowedEmail) {
    fail("This account is not authorized to manage the store.", {
      errorCode: "admin_forbidden",
      statusCode: 403,
    });
  }
}
