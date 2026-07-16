import * as Sentry from "@sentry/nextjs";

// Client bundles can only see env vars prefixed NEXT_PUBLIC_ - separate from the
// server-side SENTRY_DSN in sentry.server.config.ts/sentry.edge.config.ts. Same DSN
// value works for both; it's just not a secret (Sentry DSNs are meant to be public,
// they only allow *sending* events, not reading data).
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
