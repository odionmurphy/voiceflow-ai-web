import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — VoiceFlow AI",
};

export default function PrivacyPage() {
  const updated = "July 16, 2026";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-navy hover:underline">
        &larr; Back to VoiceFlow AI
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
      <p className="mt-1 text-sm text-ink-soft">Last updated: {updated}</p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">1. Who this applies to</h2>
          <p className="mt-2">
            This policy covers two kinds of people: <strong className="text-ink">business owners</strong> who
            sign up for a VoiceFlow AI dashboard account, and <strong className="text-ink">callers</strong> whose
            calls are answered by a business&apos;s AI receptionist. If you&apos;re a caller with questions about a
            specific business&apos;s own data practices, contact that business directly — they control their own
            customer records.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">2. What we collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-ink">Account data:</strong> name, email, and password (stored as a salted
              hash, never in plain text) for dashboard login.
            </li>
            <li>
              <strong className="text-ink">Business data:</strong> business name, hours, services, and AI
              receptionist settings you configure.
            </li>
            <li>
              <strong className="text-ink">Customer &amp; appointment data:</strong> names, phone numbers, and
              booking details entered by you, your staff, or collected during AI-handled calls.
            </li>
            <li>
              <strong className="text-ink">Call data:</strong> call recordings are not collected by default. Call
              transcripts and AI-generated summaries are stored so you can review how calls were handled.
            </li>
            <li>
              <strong className="text-ink">Billing data:</strong> subscription plan and status. Full payment card
              details are handled entirely by Stripe and never touch our servers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">3. Third-party services we use</h2>
          <p className="mt-2">
            We rely on the following processors to run the service. Each only receives the data needed to perform
            its function:
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-ink">Twilio</strong> — routes and connects phone calls to our AI
              receptionist.
            </li>
            <li>
              <strong className="text-ink">Google Gemini</strong> — processes call audio/text to hold a
              conversation and determine booking intent.
            </li>
            <li>
              <strong className="text-ink">Stripe</strong> — processes subscription payments.
            </li>
            <li>
              <strong className="text-ink">Resend</strong> — sends appointment confirmation and reminder emails.
            </li>
            <li>
              <strong className="text-ink">Google Calendar</strong> (optional) — if you connect it, appointment
              details sync to your calendar.
            </li>
            <li>
              <strong className="text-ink">Render &amp; Neon</strong> — host our application servers and database.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">4. How we use it</h2>
          <p className="mt-2">
            Data is used solely to operate the service: answering calls, booking and managing appointments, sending
            confirmations/reminders, processing your subscription, and improving reliability. We do not sell your
            data or your customers&apos; data to third parties, and we do not use call content to train AI models
            beyond what Google&apos;s API terms govern for Gemini.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">5. Data retention</h2>
          <p className="mt-2">
            Business, customer, and appointment data is retained for as long as your account is active. Call
            transcripts are retained to give you a call history; you can request deletion at any time (see below).
            If you delete your account, we delete your business data within 30 days, except where we&apos;re
            required to retain billing records for tax/legal purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">6. Your rights</h2>
          <p className="mt-2">
            You can access, correct, export, or delete your business&apos;s data at any time from the dashboard, or
            by contacting us. Callers who want a business to delete their information should contact that business
            directly, or reach out to us and we&apos;ll forward the request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">7. Security</h2>
          <p className="mt-2">
            Passwords are hashed, data in transit is encrypted (HTTPS/TLS), and access to production data is
            limited to what&apos;s needed to operate the service. No system is perfectly secure, and we can&apos;t
            guarantee absolute security, but we take reasonable, industry-standard measures to protect your data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">8. Changes to this policy</h2>
          <p className="mt-2">
            We&apos;ll update the date at the top of this page when this policy changes, and post material changes
            here before they take effect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">9. Contact</h2>
          <p className="mt-2">
            Questions about this policy or your data? Contact the account owner listed for your VoiceFlow AI
            dashboard, or reach out via the support channel provided at signup.
          </p>
        </section>
      </div>
    </div>
  );
}
