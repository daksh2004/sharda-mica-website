import "dotenv/config";

import postgres from "postgres";

const RETENTION_DAYS = 30;
const apply = process.argv.slice(2).includes("--apply");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.startsWith("pglite:")) {
  throw new Error(
    "Set DATABASE_URL to the hosted PostgreSQL connection before running the enquiry retention job.",
  );
}

const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
const sql = postgres(databaseUrl, { max: 1, connect_timeout: 10 });

try {
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count
    FROM store_enquiries
    WHERE created_at < ${cutoff.toISOString()}::timestamptz
  `;

  if (!apply) {
    console.info(
      `[enquiry-retention] Dry run: ${count} enquiries are older than ${RETENTION_DAYS} days (cutoff ${cutoff.toISOString()}). Pass --apply to delete them.`,
    );
  } else {
    const deleted = await sql<{ id: string }[]>`
      DELETE FROM store_enquiries
      WHERE created_at < ${cutoff.toISOString()}::timestamptz
      RETURNING id
    `;
    console.info(
      `[enquiry-retention] Deleted ${deleted.length} enquiries older than ${RETENTION_DAYS} days.`,
    );
  }
} finally {
  await sql.end({ timeout: 5 });
}
