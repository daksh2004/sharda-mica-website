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
- Enquiries are retained for 30 days. The `enquiries:purge` job has a safe dry-run by default; the scheduled GitHub Actions workflow reads `DATABASE_URL` from a repository secret (preferred) or repository variable and skips cleanup with a warning when neither is configured.

## Checks

Run these from the project folder:

```powershell
corepack pnpm test
corepack pnpm typecheck
corepack pnpm agent-native:doctor
corepack pnpm build
```

The production build runs the Agent-Native doctor as part of its build command. A successful local build alone does not confirm that production secrets, the hosted database, image storage, email delivery or the deployed domain are configured.

## Deployment on Render

This is a React Router and Nitro Node.js server app, so deploy it as a **Render Web Service**, not a Static Site. The Git remote is `https://github.com/daksh2004/sharda-mica-website.git` on `main`.

1. In Render, create **New > Web Service**, connect GitHub, and choose this repository and the `main` branch. Leave Root Directory blank when the repository root is this project.
2. Set Node.js to `22.22.0` (or newer compatible Node 22) and enter:

   - Build: `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build`
   - Start: `pnpm start`

3. Set the required private environment values in Render. Never commit real values to this repository:

   - `DATABASE_URL`: pooled connection URL from the persistent hosted PostgreSQL provider (Neon is supported).
   - `DATABASE_URL_UNPOOLED`: the same database's direct/unpooled connection URL, used for Drizzle migrations.
   - `BETTER_AUTH_SECRET`: newly generated random secret of at least 32 bytes.
   - `SHARDA_ADMIN_EMAIL`: `shardamica@gmail.com` (the verified owner email).
   - `BETTER_AUTH_TRUSTED_ORIGINS`: exact production origins, comma-separated if there is more than one; do not use `*`.
   - Email recovery: `RESEND_API_KEY` with its verified sender setup, or `SENDGRID_API_KEY` plus `EMAIL_FROM` set to a verified sender.
   - Keep `AUTH_DISABLED` unset. Do not put credentials in client-side React variables.

4. For a paid Render Web Service, set the Pre-Deploy Command to `pnpm migrate:production`. It runs the Agent-Native and Drizzle migrations before new code starts. Render does not offer pre-deploy commands on Free web services. Before the first Free deploy, or before pushing a schema-changing update, stop the local dev server and run the production migration from this project folder against Neon. Enter the connection strings at the hidden prompts; do not put them in a command or commit them:

   ```powershell
   function Set-SecretEnv([string]$Name) {
     $secure = Read-Host -Prompt $Name -AsSecureString
     $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
     try {
       Set-Item -Path "Env:$Name" -Value ([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer))
     } finally {
       [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
     }
   }
   Set-SecretEnv "DATABASE_URL"
   Set-SecretEnv "DATABASE_URL_UNPOOLED"
   pnpm migrate:production
   $migrationExitCode = $LASTEXITCODE
   Remove-Item Env:DATABASE_URL, Env:DATABASE_URL_UNPOOLED
   if ($migrationExitCode -ne 0) { throw "Production migration failed; do not deploy until resolved." }
   ```

   Do not run `db:push` against production. Wait for the migration command to finish successfully before starting a deploy.
5. Configure product image uploads with a durable S3-compatible provider such as Cloudflare R2. The framework upload setup requires bucket credentials and a public URL; local disk uploads are not durable on Render. Save those values only in the app's secured file-storage settings or the hosting secret store.
6. Set Render's health check path to `/` and confirm the server starts using Render's `PORT` (Nitro reads `PORT` automatically). Check the deployment logs and verify public pages, `/admin` sign-in, image upload, saved enquiry, and email reset before sharing the service URL.
7. Add GitHub Actions `DATABASE_URL` to repository secrets (preferred) or repository variables for the scheduled retention workflow. `.github/workflows/purge-enquiries.yml` runs daily and deletes only enquiries older than 30 days when that value is configured; otherwise it exits successfully with a warning. Run it once manually after adding the value and verify its Actions log. This lets the cleanup run even if a Free Render service is asleep.
8. Connect Render to the GitHub `main` branch and enable Auto-Deploy after checks. `.github/workflows/ci.yml` runs typecheck, tests, the framework doctor and production build on pushes and pull requests. It uses fake build-only database/auth values, not production secrets. Commit and push changes to deploy them:

   ```powershell
   git add .
   git commit -m "Describe the change"
   git push origin main
   ```

9. For traffic controls, put Cloudflare in front of the custom domain after the domain is registered and DNS is ready. Enable appropriate bot/rate rules conservatively; cache static assets only, and bypass cache for admin, auth, action/API and enquiry routes. Cloudflare does not keep Render awake. Set UptimeRobot to check the public Render URL every 5 minutes and email on failure.

**Availability note:** Render Free web services sleep after 15 idle minutes, take about a minute to wake, use ephemeral files, and have monthly usage caps. Render says Free instances are intended for testing/hobby use, not production. A reliable always-on business website needs an always-on paid web service and durable hosted PostgreSQL and image storage. Do not use a one-second ping loop to evade idle behavior.

The custom domain and Google Search Console/Business Profile setup should use the final domain and verified business details. Do not invent business details or verification. Review the privacy policy and terms for the hosted data-retention and email setup before launch.

## Security and privacy notes

- Keep `.env`, database files, uploaded customer information and local build output out of Git.
- Keep admin authentication enabled on any public deployment.
- Do not log customer form contents or credentials.
- Collect and store contact details only after consent, and verify the 30-day scheduled deletion job before launch.
- Review the privacy policy and terms against the final hosting and data-retention setup before publishing.
