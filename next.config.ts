import path from "path";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Pin the project root to this folder. The parent directory has its own
  // package-lock.json, which made Next treat the whole monorepo as the root.
  turbopack: { root: path.join(__dirname) },
  outputFileTracingRoot: path.join(__dirname),
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // No Sentry auth token is configured, so source-map upload is disabled rather than
  // failing the build - error reporting still works, stack traces just won't be
  // de-minified in the Sentry dashboard until one's added.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});