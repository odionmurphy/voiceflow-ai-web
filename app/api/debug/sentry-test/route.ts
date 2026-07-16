import * as Sentry from "@sentry/nextjs";

// TEMPORARY - verifying Sentry actually receives events end-to-end. Remove once
// confirmed.
export async function GET() {
  Sentry.captureException(new Error("Sentry verification test error - web"));
  // Vercel can freeze the function's execution environment the moment a response is
  // sent, cutting off any still-in-flight async work (like the HTTP request to
  // Sentry's ingest API) - explicitly awaiting flush() here guarantees the send
  // completes before we respond, instead of relying on background continuation.
  await Sentry.flush(2000);
  return new Response("Sentry test error captured and flushed", { status: 500 });
}
