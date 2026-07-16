import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  // eslint-disable-next-line no-console
  console.log("[sentry] initializing with DSN:", process.env.SENTRY_DSN);
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
    // TEMPORARY - diagnosing why events aren't arriving. Remove once resolved.
    debug: true,
  });
} else {
  // eslint-disable-next-line no-console
  console.warn("[sentry] SENTRY_DSN not set - error monitoring is disabled.");
}
