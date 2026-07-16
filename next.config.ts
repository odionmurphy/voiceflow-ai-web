import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // No Sentry auth token is configured, so source-map upload is disabled rather than
  // failing the build - error reporting still works, stack traces just won't be
  // de-minified in the Sentry dashboard until one's added.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
