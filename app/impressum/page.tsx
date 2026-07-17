import Link from "next/link";

export const metadata = {
  title: "Impressum — VoiceFlow AI",
};

// German law (§ 5 TMG / Telemediengesetz) requires every commercial website reachable
// from Germany to have accurate, real operator details here - name, address, and
// contact info can't be placeholders once this goes live. Replace every [BRACKETED]
// value below with your real details before launch.
export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-navy hover:underline">
        &larr; Back to VoiceFlow AI
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Impressum</h1>
      <p className="mt-1 text-sm text-ink-soft">Legal notice per § 5 TMG</p>

      <div className="mt-8 rounded-lg border border-amber bg-amber-soft/40 p-4 text-sm text-ink">
        <strong>Before going live, still needed:</strong> a full street address
        (house number - &quot;Horlecke&quot; alone isn&apos;t a complete address), a
        phone number, and your VAT status. Double-check the city (Menden (Sauerland)
        was inferred from the postal code - confirm that&apos;s correct).
      </div>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="mt-2">
            Greener-Tech
            <br />
            Horlecke [HOUSE NUMBER MISSING]
            <br />
            58706 Menden (Sauerland) [CONFIRM CITY]
            <br />
            Germany
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Phone: [YOUR PHONE NUMBER]
            <br />
            Email: smithcelestine430@gmail.com
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Umsatzsteuer-ID
          </h2>
          <p className="mt-2">
            VAT ID per § 27a Umsatzsteuergesetz: [YOUR VAT ID, IF YOU HAVE ONE]
            <br />
            <span className="text-xs">
              (If you&apos;re not yet VAT-registered - e.g. operating under the
              Kleinunternehmerregelung - state that instead: &quot;Gemäß §19 UStG wird
              keine Umsatzsteuer berechnet.&quot;)
            </span>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Commercial register (if applicable)
          </h2>
          <p className="mt-2">
            Registergericht: [REGISTER COURT]
            <br />
            Registernummer: [REGISTRATION NUMBER]
            <br />
            <span className="text-xs">
              (Only applies if you&apos;re registered as a GmbH, UG, or similar - a sole
              proprietorship / Einzelunternehmen usually doesn&apos;t have this.)
            </span>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Person responsible for content (§ 18 Abs. 2 MStV)
          </h2>
          <p className="mt-2">[SAME NAME AND ADDRESS AS ABOVE, UNLESS DIFFERENT]</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Dispute resolution
          </h2>
          <p className="mt-2">
            The European Commission provides a platform for online dispute resolution
            (OS):{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . We are not obligated and not willing to participate in dispute resolution
            proceedings before a consumer arbitration board, unless required by law -
            update this if that changes for you.
          </p>
        </section>
      </div>
    </div>
  );
}
