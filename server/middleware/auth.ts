import { getSession, runAuthGuard } from "@agent-native/core/server";
import {
  defineEventHandler,
  getRequestURL,
  sendRedirect,
  setResponseHeader,
  setResponseStatus,
} from "h3";

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminPath) {
    setResponseHeader(event, "Cache-Control", "private, no-store, max-age=0");

    const authDisabledFlag = process.env.AUTH_DISABLED?.trim().toLowerCase() ?? ""; // guard:allow-env-credential — read only this on/off flag to fail closed on /admin; it is not a credential.
    const authDisabled = ["true", "1"].includes(authDisabledFlag);
    if (authDisabled) {
      setResponseStatus(event, 503);
      return { error: "Admin access requires authentication. Remove AUTH_DISABLED and restart the server." };
    }
  }

  const guardResult = await runAuthGuard(event);
  if (guardResult !== undefined) return guardResult;
  if (!isAdminPath) return;

  const configuredAdminEmail =
    process.env.SHARDA_ADMIN_EMAIL?.trim().toLowerCase() ?? ""; // guard:allow-env-credential — server-only admin email allowlist, not a user credential.
  if (!configuredAdminEmail) {
    setResponseStatus(event, 503);
    return { error: "Private admin access has not been configured." };
  }

  const session = await getSession(event);
  if (!session) return sendRedirect(event, "/sign-in");

  if (session.email.trim().toLowerCase() !== configuredAdminEmail) {
    setResponseStatus(event, 403);
    return { error: "This account is not authorized for the admin dashboard." };
  }

  if (process.env.NODE_ENV !== "development" && session.emailVerified !== true) {
    setResponseStatus(event, 403);
    return { error: "Verify the approved admin email before opening the admin dashboard." };
  }
});


