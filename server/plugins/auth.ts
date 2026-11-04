import { APIError, createAuthMiddleware } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { multiSession } from "better-auth/plugins";

import { createAuthPlugin, getAppBasePath } from "@agent-native/core/server";
import { signInJourneyInlineScript } from "@agent-native/core/shared";

const adminEmail = () =>
  process.env.SHARDA_ADMIN_EMAIL?.trim().toLowerCase() ?? ""; // guard:allow-env-credential — server-only admin email allowlist, not a user credential.

const appBasePath = getAppBasePath().replace(/\/$/, "");
const authPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#141414" />
    <title>Admin sign in · Sharda Mica Palace</title>
    <style>
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #10110f; color: #f3f1ec; font: 16px/1.5 system-ui, sans-serif; }
      main { width: min(100%, 470px); padding: 36px; background: #151614; border: 1px solid #30312e; border-radius: 14px; }
      .brand { margin-bottom: 28px; color: #d2b783; font: 600 14px/1.4 system-ui, sans-serif; letter-spacing: .13em; text-transform: uppercase; }
      h1 { margin: 0 0 4px; font-size: 25px; line-height: 1.25; }
      .subtitle { margin: 0 0 24px; color: #a7a7a3; }
      label { display: block; margin: 16px 0 7px; color: #b9b8b3; font-size: 14px; }
      input { width: 100%; min-height: 46px; padding: 10px 13px; border: 1px solid #393a37; border-radius: 8px; background: #151614; color: #f3f1ec; font: inherit; }
      input:focus { outline: 3px solid #c8a46755; border-color: #c8a467; }
      input::placeholder { color: #747570; }
      .password-wrap { position: relative; }
      .password-wrap input { padding-right: 54px; }
      .toggle-password { position: absolute; top: 4px; right: 4px; display: grid; width: 40px; height: 38px; place-items: center; border: 0; border-radius: 6px; background: transparent; color: #b8b8b2; cursor: pointer; }
      .toggle-password:hover { background: #292a27; color: #fff; }
      .toggle-password:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid #c8a467; outline-offset: 2px; }
      .toggle-password svg { width: 20px; height: 20px; }
      .submit { width: 100%; min-height: 48px; margin-top: 22px; border: 0; border-radius: 8px; background: #f5f4f1; color: #141414; font: 600 16px system-ui, sans-serif; cursor: pointer; }
      .submit:hover { background: #e5ddcb; }
      .submit:disabled { opacity: .65; cursor: wait; }
      .links { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; }
      a, .text-button { padding: 0; border: 0; background: none; color: #aaa9a4; font: inherit; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
      a:hover, .text-button:hover { color: #fff; }
      #status { min-height: 24px; margin: 16px 0 0; color: #ff716b; }
      #status.success { color: #b6d1a4; }
      .hint { margin: 14px 0 0; color: #888983; font-size: 13px; }
      @media (max-width: 520px) { main { padding: 28px 22px; } }
    </style>
  </head>
  <body>
    <main>
      <div class="brand">Sharda Mica Palace</div>
      <h1 id="title">Welcome back</h1>
      <p class="subtitle" id="subtitle">Sign in to your admin account</p>
      <form id="auth-form" novalidate>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="username" inputmode="email" placeholder="you@example.com" required />
        <div id="password-fields">
          <label for="password">Password</label>
          <div class="password-wrap">
            <input id="password" name="password" type="password" autocomplete="current-password" minlength="6" maxlength="15" placeholder="6 to 15 characters" required />
            <button class="toggle-password" id="toggle-password" type="button" aria-label="Show password" aria-pressed="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <button class="submit" id="submit" type="submit">Sign in</button>
        <p id="status" role="status" aria-live="polite"></p>
      </form>
      <p class="hint" id="hint">Use the approved admin email and your 6–15 character password.</p>
      <div class="links">
        <button class="text-button" id="mode-toggle" type="button">Create admin account</button>
        <button class="text-button" id="forgot-toggle" type="button">Forgot password?</button>
      </div>
    </main>
    <script>${signInJourneyInlineScript()}</script>
    <script>
      const basePath = ${JSON.stringify(appBasePath)};
      const authUrl = (path) => basePath + path;
      const form = document.getElementById("auth-form");
      const emailField = document.getElementById("email");
      const passwordField = document.getElementById("password");
      const passwordFields = document.getElementById("password-fields");
      const status = document.getElementById("status");
      const submit = document.getElementById("submit");
      const modeToggle = document.getElementById("mode-toggle");
      const forgotToggle = document.getElementById("forgot-toggle");
      const title = document.getElementById("title");
      const subtitle = document.getElementById("subtitle");
      const hint = document.getElementById("hint");
      const eyeButton = document.getElementById("toggle-password");
      let mode = "login";
      const journey = __anCreateSignInJourney("", "/");
      const resumeHref = journey.journeyForLocation(window.location).resumeHref;

      eyeButton.addEventListener("click", () => {
        const showing = passwordField.type === "password";
        passwordField.type = showing ? "text" : "password";
        eyeButton.setAttribute("aria-label", showing ? "Hide password" : "Show password");
        eyeButton.setAttribute("aria-pressed", String(showing));
      });
      modeToggle.addEventListener("click", () => {
        mode = mode === "login" ? "signup" : "login";
        title.textContent = mode === "signup" ? "Create admin account" : "Welcome back";
        subtitle.textContent = mode === "signup" ? "Create access for the approved admin email" : "Sign in to your admin account";
        submit.textContent = mode === "signup" ? "Create account" : "Sign in";
        modeToggle.textContent = mode === "signup" ? "Back to sign in" : "Create admin account";
        forgotToggle.hidden = mode === "signup";
        passwordField.autocomplete = mode === "signup" ? "new-password" : "current-password";
        hint.textContent = mode === "signup" ? "Use 6–15 characters with a letter, a number, and a symbol. Keep it private." : "Use the approved admin email and your 6–15 character password.";
        status.textContent = "";
        status.className = "";
      });
      forgotToggle.addEventListener("click", async () => {
        const email = emailField.value.trim().toLowerCase();
        status.className = "";
        if (!email) { status.textContent = "Enter the admin email first."; emailField.focus(); return; }
        submit.disabled = true;
        status.textContent = "Requesting a reset link…";
        try {
          const response = await fetch(authUrl("/_agent-native/auth/ba/request-password-reset"), {
            method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, redirectTo: window.location.origin + authUrl("/sign-in") }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.error) throw new Error(result.message || result.error || "Reset could not be requested. Configure email delivery, then try again.");
          status.className = "success";
          status.textContent = "If reset email is configured, a secure link will arrive at the approved admin email.";
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : "Could not request a reset link.";
        } finally { submit.disabled = false; }
      });
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.className = "";
        const email = emailField.value.trim().toLowerCase();
        const password = passwordField.value;
        if (!emailField.validity.valid) { status.textContent = "Enter a valid email address."; emailField.focus(); return; }
        if (!/^[!-~]{6,15}$/.test(password)) { status.textContent = "Password must be 6 to 15 characters with no spaces."; passwordField.focus(); return; }
        if (mode === "signup" && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password))) {
          status.textContent = "For a new password, include at least one letter, one number, and one symbol.";
          passwordField.focus();
          return;
        }
        submit.disabled = true;
        status.textContent = mode === "signup" ? "Creating your account…" : "Signing in…";
        try {
          const post = async (path, body) => {
            const response = await fetch(authUrl(path), { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.error || result.ok === false) {
              const message = result.message || result.error || "";
              if (message === "We couldn't sign you in right now. Please try again." || message === "We couldn't create your account right now. Please try again.") {
                throw new Error("The server could not access the account database. Check the VS Code terminal. If it says the PGlite database is already owned by another process, stop the other dev server terminals and run only one server from the Website folder.");
              }
              throw new Error(message || "The request failed. Check that one dev server is running from the Website folder.");
            }
            return result;
          };
          if (mode === "signup") {
            const created = await post("/_agent-native/auth/register", { email, password });
            if (created.verificationRequired) {
              status.className = "success";
              status.textContent = "Account created. Verify the email, then sign in.";
              submit.disabled = false;
              return;
            }
          }
          await post("/_agent-native/auth/login", { email, password });
          window.location.replace(resumeHref);
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : "Sign in failed. Check the server and try again.";
          submit.disabled = false;
        }
      });
    </script>
  </body>
</html>`;

const adminPasswordPolicy: BetterAuthPlugin = {
  id: "sharda-admin-account-policy",
  init: ({ options }) => {
    // Keep Better Auth's own password validation aligned with the store's
    // 6–15 character password policy; request hooks enforce the allowed format.
    if (options.emailAndPassword) {
      options.emailAndPassword.minPasswordLength = 6;
      options.emailAndPassword.maxPasswordLength = 15;
    }
  },
  hooks: {
    before: [
      {
        matcher: ({ path }) =>
          [
            "/sign-in/email",
            "/sign-up/email",
            "/reset-password",
            "/request-password-reset",
            "/change-password",
            "/set-password",
          ].includes(path ?? ""),
        handler: createAuthMiddleware(async (context) => {
          const body = (context.body ?? {}) as Record<string, unknown>;
          const path = context.path;
          const email =
            typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
          const configuredAdminEmail = adminEmail();

          if (
            (path === "/sign-in/email" ||
              path === "/sign-up/email" ||
              path === "/request-password-reset") &&
            (!configuredAdminEmail || email !== configuredAdminEmail)
          ) {
            throw new APIError("FORBIDDEN", {
              message: "This account is not authorized.",
            });
          }

          const passwordValues = [body.password, body.newPassword].filter(
            (value): value is string => typeof value === "string",
          );
          if (passwordValues.some((password) => !/^[!-~]{6,15}$/.test(password))) {
            throw new APIError("BAD_REQUEST", {
              message: "Use a password containing 6 to 15 characters without spaces.",
            });
          }
          if (
            path !== "/sign-in/email" &&
            passwordValues.some(
              (password) =>
                !/[A-Za-z]/.test(password) ||
                !/[0-9]/.test(password) ||
                !/[^A-Za-z0-9]/.test(password),
            )
          ) {
            throw new APIError("BAD_REQUEST", {
              message: "For a new password, include at least one letter, one number, and one symbol.",
            });
          }
        }),
      },
    ],
  },
};

// Customer pages remain public. Admin login is limited to the email configured
// in SHARDA_ADMIN_EMAIL and uses a maximum of two concurrent sessions.
export default createAuthPlugin({
  rootAuth: false,
  loginHtml: authPage,
  // The storefront is public, so its catalog read and customer enquiry submit
  // actions must be callable without an admin session. Keep this list explicit:
  // inbox and product-management actions remain protected by authentication.
  publicPaths: [
    "/_agent-native/actions/list-store-products",
    "/_agent-native/actions/create-store-enquiry",
  ],
  workspaceAppPublicPaths: [
    "/",
    "/products",
    "/kitchen-hardware",
    "/cart",
    "/contact",
    "/about",
    "/privacy",
    "/terms",
  ],
  workspaceAppProtectedPaths: ["/admin"],
  renderResetPasswordPage: ({ appBasePath }) => {
    const resetEndpoint = `${appBasePath}/_agent-native/auth/ba/reset-password`;
    const signInPath = `${appBasePath}/sign-in`;
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset admin password · Sharda Mica Palace</title>
    <style>
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #f5f2e9; color: #263b2a; font: 16px/1.5 system-ui, sans-serif; }
      main { width: min(100%, 430px); padding: 32px; background: #fffdf8; border: 1px solid #e5dece; border-radius: 12px; box-shadow: 0 12px 40px #263b2a12; }
      h1 { margin: 0 0 8px; font: 600 28px/1.15 Georgia, serif; }
      p { margin: 0 0 24px; color: #647064; }
      label { display: block; margin: 16px 0 6px; font-weight: 600; }
      input { width: 100%; min-height: 46px; padding: 10px 12px; border: 1px solid #cfc8b8; border-radius: 6px; font: inherit; }
      input:focus { outline: 3px solid #c9a87955; border-color: #9c7548; }
      button { width: 100%; min-height: 46px; margin-top: 20px; border: 0; border-radius: 6px; background: #314631; color: white; font: 600 16px system-ui, sans-serif; cursor: pointer; }
      button:disabled { opacity: .65; cursor: wait; }
      #status { min-height: 24px; margin: 14px 0 0; color: #9b342f; }
      #status.success { color: #314631; }
      a { display: inline-block; margin-top: 18px; color: #314631; }
      @media (max-width: 480px) { main { padding: 24px; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Reset admin password</h1>
      <p>Choose a new password with 6–15 characters, including a letter, a number, and a symbol.</p>
      <form id="reset-form">
        <label for="password">New password</label>
        <input id="password" name="password" type="password" autocomplete="new-password" minlength="6" maxlength="15" required />
        <label for="confirm-password">Confirm new password</label>
        <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" minlength="6" maxlength="15" required />
        <button type="submit">Save new password</button>
        <p id="status" role="status" aria-live="polite"></p>
      </form>
      <a href="${signInPath}">Back to admin sign in</a>
    </main>
    <script>
      const form = document.getElementById("reset-form");
      const status = document.getElementById("status");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = document.getElementById("password").value;
        const confirmation = document.getElementById("confirm-password").value;
        const token = new URLSearchParams(window.location.search).get("token");
        if (!/^[!-~]{6,15}$/.test(password)) {
          status.textContent = "Use 6 to 15 characters with no spaces.";
          return;
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
          status.textContent = "Include at least one letter, one number, and one symbol.";
          return;
        }
        if (password !== confirmation) {
          status.textContent = "The passwords do not match.";
          return;
        }
        if (!token) {
          status.textContent = "This reset link is missing or invalid. Request a new one.";
          return;
        }
        const button = form.querySelector("button");
        button.disabled = true;
        status.textContent = "Saving password…";
        try {
          const response = await fetch("${resetEndpoint}", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password, token }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.message || result.error || "The reset link may have expired.");
          form.hidden = true;
          status.className = "success";
          status.textContent = "Password updated. You can now sign in.";
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : "Could not reset the password. Request a new link.";
          button.disabled = false;
        }
      });
    </script>
  </body>
</html>`;
  },
  betterAuth: {
    plugins: [multiSession({ maximumSessions: 2 }), adminPasswordPolicy],
  },
});



