# Sharda Mica Palace Website

A React storefront for Sharda Mica Palace, a retail and wholesale plywood, laminates, doors, carpenter materials, modular kitchen and hardware business in Jabalpur, India.

The site lets visitors browse the catalog, create an enquiry cart, and open a WhatsApp message draft to review and send. Website form enquiries can be saved to the private admin inbox with customer consent. The admin area also supports reviewing enquiries, downloading date-filtered enquiry PDFs, and managing additional products and their photos.

Prices, stock and product specifications are not published unless confirmed by the store. A WhatsApp draft is not proof that a message was sent or received.

## Technology

- React 19 and React Router
- Vite
- TypeScript and Tailwind CSS
- Agent-Native actions for application operations
- Drizzle ORM with PostgreSQL for saved enquiries and admin-managed catalog data
- PGlite for local development only

## Requirements

- Node.js 22.22 or newer
- Corepack and pnpm 10.14 (the package manager version is pinned in `package.json`)

## Run locally on Windows

Open PowerShell in this project folder. Install dependencies once, apply the local schema while the dev server is stopped, and start the app:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm db:migrate
npm run dev
```

Open the local URL printed in the terminal, normally <http://127.0.0.1:8080/>. If port 8080 is already in use, Vite may select another port and print that URL. Stop the server with `Ctrl+C` before running migrations or starting another server that uses the same local database directory.

`corepack enable` is not needed. If you see a PGlite ownership message, stop other development servers using this project first. Do not delete `data/pglite` to clear a process lock; that directory contains local development data.

## Environment configuration

Local secrets and settings belong in `.env`. This file is ignored by Git. Start from `.env.example` and configure the values needed for the feature you are using. Never commit `.env` or paste credentials into issues or chat.

Important settings include:

| Variable | Purpose |
| --- | --- |
| `SHARDA_ADMIN_EMAIL` | The verified email address allowed to use the private admin area |
| `BETTER_AUTH_SECRET` | Stable secret used by hosted authentication |
| `DATABASE_URL` or `NETLIFY_DATABASE_URL` | Persistent PostgreSQL connection for a hosted deployment |
| `BETTER_AUTH_TRUSTED_ORIGINS` | The real deployed website origin(s) allowed by authentication |
| `RESEND_API_KEY` and verified sender, or `SENDGRID_API_KEY` and `EMAIL_FROM` | Email delivery for password-reset links |

Do not set `AUTH_DISABLED` on a public deployment. Admin access must use the verified allowlisted email and password. Email-based password recovery requires a configured email provider; no SMS recovery is configured.

## Project structure

```text
app/                 React pages, components, hooks and storefront data
  routes/            Public pages and private admin route
  lib/store.tsx      Catalog, verified store details and enquiry cart
actions/             Application reads and writes used by the UI
drizzle/             PostgreSQL schema and migrations
server/              Authentication, database and server configuration
public/              Brand assets and product photographs served by the site
tests/               Automated unit and integration tests
scripts/             Local and production maintenance scripts
```

Public routes include `/`, `/products`, `/kitchen-hardware`, `/cart`, `/contact`, `/about`, `/privacy` and `/terms`. Unknown paths show the branded not-found page. `/admin` is private.

## Catalog and enquiry behavior

- The catalog and verified business details are maintained in `app/lib/store.tsx`.
- Supplied product images are stored as separate assets under `public/` and matched to their product names. Do not substitute unrelated images or add unconfirmed product details.
- Visitors do not need an account. The enquiry cart is saved in their browser; this is separate from the admin enquiry inbox.
- Contact details are saved only when the visitor gives consent. WhatsApp opens a draft for the visitor to check and send.
- Saved enquiries, their review status, and admin-added product records use SQL. Shared production use therefore needs a persistent hosted PostgreSQL service; local PGlite data is not shared or persistent production storage.
- Product image uploads need a persistent hosted image-storage provider in production. Store image references in the database, not image file bodies.
- Enquiries are retained for 30 days. The `enquiries:purge` job has a safe dry-run by default; add `--apply` only for the scheduled Render Cron Job. This repository cannot run scheduled cleanup until that Cron Job is configured in Render.

## Checks

Run these from the project folder:

```powershell
corepack pnpm test
corepack pnpm typecheck
corepack pnpm agent-native:doctor
corepack pnpm build
```

The production build runs the Agent-Native doctor as part of its build command. A successful local build alone does not confirm that production secrets, the hosted database, image storage, email delivery or the deployed domain are configured.

## Deployment

`netlify.toml` contains Netlify build configuration. Before connecting or publishing a production site, configure the real site domain and production environment variables in the hosting dashboard, including:

1. A persistent hosted PostgreSQL URL (`NETLIFY_DATABASE_URL` or `DATABASE_URL`).
2. A stable `BETTER_AUTH_SECRET` and the real origin in `BETTER_AUTH_TRUSTED_ORIGINS`.
3. The verified admin email in `SHARDA_ADMIN_EMAIL`.
4. Managed image storage for admin-uploaded product photographs.
5. A verified email sender if admin password-reset links are required.
6. A Render Cron Job that runs `pnpm run enquiries:purge -- --apply` against the same `DATABASE_URL` as the website. Schedule it daily or weekly and verify its first run in Render logs. The job deletes only enquiries older than 30 days; without the Cron Job, automatic deletion is not active.
7. A GitHub repository connected to the hosting project and a successful production build/migration.

Deployment, DNS changes, publication and Google Search Console or Google Business Profile connections require the owner's approval. Use the verified business name, address, phone numbers and real domain; do not invent verification or business claims.

## Security and privacy notes

- Keep `.env`, database files, uploaded customer information and local build output out of Git.
- Keep admin authentication enabled on any public deployment.
- Do not log customer form contents or credentials.
- Collect and store contact details only after consent, and verify the 30-day scheduled deletion job before launch.
- Review the privacy policy and terms against the final hosting and data-retention setup before publishing.
