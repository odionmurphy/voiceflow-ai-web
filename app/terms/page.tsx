import Link from "next/link";

export const metadata = {
  title: "Terms of Service — VoiceFlow AI",
};

export default function TermsPage() {
  const updated = "July 16, 2026";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-navy hover:underline">
        &larr; Back to VoiceFlow AI
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Terms of Service</h1>
      <p className="mt-1 text-sm text-ink-soft">Last updated: {updated}</p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">1. The service</h2>
          <p className="mt-2">
            VoiceFlow AI provides an AI phone receptionist, appointment booking, and customer management dashboard
            for businesses. By creating an account, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">2. Your account</h2>
          <p className="mt-2">
            You&apos;re responsible for the accuracy of the business information you provide, for keeping your
            login credentials secure, and for all activity under your account. You must be authorized to act on
            behalf of the business you register.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">3. AI-handled calls</h2>
          <p className="mt-2">
            Your AI receptionist answers calls, has conversations, and can book appointments automatically based on
            the greeting, services, and rules you configure. You&apos;re responsible for reviewing bookings made by
            the AI and for the accuracy of the information (hours, services, pricing) you give it to work with. We
            don&apos;t guarantee the AI will handle every call perfectly — treat it as an assistant, not a
            replacement for your own oversight of your calendar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">4. Subscriptions &amp; billing</h2>
          <p className="mt-2">
            Paid plans are billed on a recurring basis through Stripe. Trials, if offered, convert to a paid
            subscription automatically unless canceled before the trial ends. You can change or cancel your plan
            at any time from the dashboard&apos;s Billing settings; cancellation takes effect at the end of the
            current billing period. Fees are non-refundable except where required by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">5. Acceptable use</h2>
          <p className="mt-2">You agree not to use the service to:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Harass, deceive, or defraud callers or customers.</li>
            <li>Handle calls for a business you&apos;re not authorized to represent.</li>
            <li>Violate applicable telecom, consumer protection, or recording-consent laws in your jurisdiction.</li>
            <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">6. Your data</h2>
          <p className="mt-2">
            You own the business and customer data you put into the service. See our{" "}
            <Link href="/privacy" className="font-medium text-navy hover:underline">
              Privacy Policy
            </Link>{" "}
            for how we handle it. You&apos;re responsible for complying with applicable law when collecting and
            storing your own customers&apos; information (including phone numbers and call transcripts) through the
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">7. Service availability</h2>
          <p className="mt-2">
            We aim for high uptime but don&apos;t guarantee the service will be uninterrupted or error-free.
            We&apos;re not liable for missed calls, bookings, or business loss resulting from downtime, third-party
            outages (Twilio, Stripe, Google, etc.), or misconfiguration of your AI settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">8. Limitation of liability</h2>
          <p className="mt-2">
            The service is provided &quot;as is.&quot; To the maximum extent permitted by law, we&apos;re not
            liable for indirect, incidental, or consequential damages arising from your use of the service,
            including lost revenue from a missed or mishandled booking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">9. Termination</h2>
          <p className="mt-2">
            You can delete your account at any time. We may suspend or terminate accounts that violate these terms
            or applicable law, with notice where practical.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">10. Changes</h2>
          <p className="mt-2">
            We may update these terms as the service evolves. We&apos;ll update the date at the top of this page
            when that happens; continued use after a change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">11. Contact</h2>
          <p className="mt-2">
            Questions about these terms? Reach out via the support channel provided at signup.
          </p>
        </section>
      </div>
    </div>
  );
}
