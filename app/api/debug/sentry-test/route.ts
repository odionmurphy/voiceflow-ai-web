// TEMPORARY - verifying Sentry actually receives events end-to-end. Remove once
// confirmed.
export async function GET() {
  throw new Error("Sentry verification test error - web");
}
