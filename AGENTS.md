# App — Agent Guide

Sharda Mica Palace is a public storefront for retail and wholesale enquiries in Jabalpur. See `DEVELOPING.md` before making source code changes.

## Skills

Search with `rg --hidden --follow`; read the exact linked guide before deeper work. `.agents/skills/build-an-app/SKILL.md` — start here for vague requests to create a domain app. `.agents/skills/adding-a-feature/SKILL.md` — cross-area feature checklist. Data/integrations: `.agents/skills/actions/SKILL.md`, `.agents/skills/storing-data/SKILL.md`, `.agents/skills/security/SKILL.md`, `.agents/skills/secrets/SKILL.md`, `.agents/skills/sharing/SKILL.md`. UI: `.agents/skills/frontend-design/SKILL.md`, `.agents/skills/shadcn-ui/SKILL.md`, `.agents/skills/client-side-routing/SKILL.md`. Agent context/workflows: `.agents/skills/context-awareness/SKILL.md`, `.agents/skills/real-time-sync/SKILL.md`, `.agents/skills/reliable-mutations/SKILL.md`, `.agents/skills/performance/SKILL.md`, `.agents/skills/delegate-to-agent/SKILL.md`. Framework: `.agents/skills/agent-native-docs/SKILL.md`, `.agents/skills/agent-native-toolkit/SKILL.md`, `.agents/skills/customizing-agent-native/SKILL.md`.

Use local docs only (no web research): `pnpm action docs-search --query "<topic>"`, `pnpm action docs-search --slug "<slug>"`, `pnpm action docs-search --list`, `pnpm action source-search --query "<pattern>"`, `pnpm action source-search --path <path>`, or `pnpm action source-search --list`. For external-agent integrations, read `pnpm action docs-search --slug "external-agents"`.

This repo is a single standalone app (`agent-native.scaffold.shape:
"standalone"`), not a workspace root. If the user asks for a workspace, a
platform or suite of apps, a second app, an app shell or launcher, or Dispatch,
read the `multi-app-workspace` skill before touching the repo layout.

## Core rules

- UI feedback: target 100 ms, never exceed 400 ms; acknowledge before network work.
- Normal app data must flow through actions. Keep actions deterministic and focused; use agent chat/AgentSidebar for AI work and follow-ups in the same thread. Keep structured state in SQL and large files in configured storage; persist references only.
- For external integrations, inspect the workspace/provider connection catalog first; reuse its scoped resolver. Never hardcode credentials, webhook URLs, or private/customer data.
- Never fabricate. Report failures and recover; verify writes by reading the row or screen. Navigation is in `<current-screen>`; use `view-screen` for fresh visible-record details.

For custom branding, keep `server/plugins/agent-native-email-branding.ts` aligned: `app.name` appears in transactional email and optional `app.logoUrl` must be an absolute HTTPS URL.

## Application state

- `navigation` describes the view and selected ids. The default home view is
  `home` at `/` (blank app canvas). No agent rail or chat is mounted by
  default; add one only when the user asks.
- Use `navigate` when supported and `view-screen` for a fresh read of visible details; basic navigation is already in `<current-screen>`.

## Building a domain app

Choose the primary workflow and route before editing. Build on the blank canvas in `app/routes/_index.tsx` or add domain routes under `app/routes/`. This starter has no Chat route, sidebar, header, or agent rail; add only the navigation the product needs. Set `app.homePath` in the existing `defineAppConfig` in `server/plugins/config.ts` as `DEVELOPING.md` describes.

Use `adding-a-feature` for functional parity and `frontend-design` for a user-facing screen. Keep feature guidance here and update `README.md` as `DEVELOPING.md` describes. After all edits, run one typecheck, one doctor check, and one browser smoke of the primary workflow and its authenticated landing. Skip production build and extra test suites.

Before building common workspace or agent UI, read `agent-native-toolkit`; for supported customization, read `customizing-agent-native`.

- Guarded verification: run `pnpm agent-native:doctor`; fix findings before done.

## Sharda Mica Palace storefront

- Public routes: /, /products, /kitchen-hardware, /cart, /contact, /about, /privacy, and /terms; unknown paths use the branded 404. The /admin route is private and requires authentication.
- Keep verified business details and the original catalog in `app/lib/store.tsx`; owner-added products live in the SQL-backed store catalog and are loaded through actions. Built-in product IDs allowed for Admin removal are listed in `app/lib/store-catalog-ids.ts`, and hidden IDs are persisted in SQL. Never add paint products, unconfirmed prices/specifications/stock, unsupported service claims, or customer review metrics.
- Keep the original catalog's photos empty until the owner supplies its final image set. Products created from the admin form must use their own uploaded photo; do not reuse the earlier sheet scans or add dimensions to product names.
- Guest browsing needs no login. The enquiry cart uses versioned local browser storage. The contact form stores submitted details only after explicit consent; product and cart WhatsApp handoff requests are also logged. WhatsApp is a user-reviewed draft handoff, never a confirmed order or proof that a message was sent.
- Sharda Assistant is a local FAQ/navigation fallback unless a real server-side AI integration is configured. It must not claim live inventory or sent enquiries.
- Report unavailable details as needing store confirmation. Customer catalog/cart state is client-side; saved products and enquiries use SQL actions. Product photo bytes use the configured managed file-upload provider, and only the hosted URL is stored in SQL.
- Storefront actions: `list-store-products` returns added products and active built-in product IDs for the storefront in one read; `list-hidden-store-products` remains available for compatibility but is not fetched by the storefront UI; `create-store-product` adds a product for the allowlisted admin; `delete-store-product` removes an Admin-added product or hides a built-in product for that admin; `create-store-enquiry` records consented contact-form submissions and product/cart handoffs; `list-store-enquiries` returns a paginated private inbox; `list-store-enquiries-by-date` returns paginated, date-filtered private inbox records for the Admin PDF export; `update-store-enquiry-status` marks an inbox row reviewed. Admin actions must keep `agentTool: false` where they handle customer PII or destructive UI-only operations.
- The /admin page is private and provides an enquiry inbox, date-filtered PDF download for saved enquiries, product creation, and removal of any active catalog product after confirmation. Enquiry PDF data is loaded only through the admin-authorized action and rendered locally in the browser. Admin-added products are deleted from SQL; built-in products are hidden from the storefront with their catalog definitions preserved in source. Only the verified email configured in SHARDA_ADMIN_EMAIL may sign in; new admin passwords must be 6–15 characters with at least one letter, one number, and one symbol, with at most two concurrent sessions. Password reset uses the approved email and requires a configured transactional email provider. Keep AUTH_DISABLED unset whenever admin access is exposed. Shared deployment requires persistent PostgreSQL and configured managed file storage; deployment remains pending owner approval.
