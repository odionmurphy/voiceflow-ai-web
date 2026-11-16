import Link from "next/link";
import { notFound } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import "../../landing.css";
import "../../landing-extras.css";
import "./feature-detail.css";

type Lang = "de" | "en";

type FeatureContent = {
  eyebrow: string;
  title: string;
  lead: string;
  previewLabel: string;
  previewTitle: string;
  previewStatus: string;
  rows: [string, string][];
  result: string;
  proof: [string, string, string];
  book: string;
  allFeatures: string;
  login: string;
};

const featureContent: Record<string, Record<Lang, FeatureContent>> = {
  "always-on-answering": {
    de: {
      eyebrow: "Telefonannahme rund um die Uhr",
      title:
        "Jeder Anruf wird angenommen. Auch wenn Ihr Team gerade nicht kann.",
      lead: "Während einer Behandlung, in der Mittagspause oder nach Feierabend: WellSpring.AI begrüßt Anrufer in Ihrem Namen und nimmt ihr Anliegen auf.",
      previewLabel: "EINGEHENDER ANRUF",
      previewTitle: "Ein neuer Patient ruft an",
      previewStatus: "Wird betreut",
      rows: [
        ["Erreichbarkeit", "24 Stunden, 7 Tage"],
        ["Anliegen", "Kontrolltermin"],
        ["Nächster Schritt", "Freie Zeiten anbieten"],
      ],
      result: "Das Team erhält eine klare Zusammenfassung.",
      proof: [
        "Auch nach Feierabend",
        "Kein starres Telefonmenü",
        "Sofort einsatzbereit",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "Always-on call answering",
      title: "Every call answered, even when your team can't pick up.",
      lead: "During an appointment, at lunch, or after hours, WellSpring.AI greets callers on your behalf and captures what they need.",
      previewLabel: "INCOMING CALL",
      previewTitle: "A new patient is calling",
      previewStatus: "Being helped",
      rows: [
        ["Availability", "24 hours, 7 days"],
        ["Reason", "Check-up appointment"],
        ["Next step", "Offer available times"],
      ],
      result: "Your team gets a clear call summary.",
      proof: [
        "After-hours coverage",
        "No rigid phone menus",
        "Ready when you are",
      ],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
  "natural-conversations": {
    de: {
      eyebrow: "Natürliche Gespräche",
      title: "Ein Gespräch statt Ansagen und Tastenauswahl.",
      lead: "Anrufer können ihr Anliegen in eigenen Worten schildern. WellSpring.AI fragt passend nach und führt das Gespräch freundlich und verständlich weiter.",
      previewLabel: "GESPRÄCH MIT DER PRAXIS",
      previewTitle: "Ein natürlicher Gesprächsverlauf",
      previewStatus: "Deutsch",
      rows: [
        ["Patient", "Ich brauche einen Termin zur Kontrolle."],
        ["WellSpring.AI", "Gerne. Welcher Tag passt Ihnen am besten?"],
        ["Patient", "Am liebsten am Freitagnachmittag."],
      ],
      result: "Ruhig, klar und auf das Anliegen fokussiert.",
      proof: [
        "Freie Spracheingabe",
        "Freundliche Rückfragen",
        "Auf Ihre Praxis abgestimmt",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "Natural conversations",
      title: "A real conversation, not menus and keypad prompts.",
      lead: "Callers can explain what they need in their own words. WellSpring.AI asks relevant follow-up questions and keeps the conversation clear and friendly.",
      previewLabel: "A CONVERSATION WITH YOUR PRACTICE",
      previewTitle: "A natural call flow",
      previewStatus: "German",
      rows: [
        ["Patient", "I need a check-up appointment."],
        ["WellSpring.AI", "Of course. What day works best for you?"],
        ["Patient", "Friday afternoon, if possible."],
      ],
      result: "Calm, clear, and focused on the caller.",
      proof: [
        "Everyday language",
        "Helpful follow-up questions",
        "Configured for your practice",
      ],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
  "calendar-sync": {
    de: {
      eyebrow: "Kalender-Synchronisation",
      title: "Gebuchte Termine landen direkt in Ihrem Kalender.",
      lead: "WellSpring.AI schlägt passende freie Zeiten vor und trägt bestätigte Termine in Ihren bestehenden Kalender ein. Ihr Team muss sie nicht ein zweites Mal erfassen.",
      previewLabel: "KALENDER DER PRAXIS",
      previewTitle: "Freitag, 21. November",
      previewStatus: "Synchronisiert",
      rows: [
        ["09:00", "Kontrolltermin · M. Schneider"],
        ["11:30", "Akutsprechstunde · L. Weber"],
        ["14:30", "Frei für neue Termine"],
      ],
      result: "Bestätigte Termine sind für Ihr Team sichtbar.",
      proof: [
        "Bestehenden Kalender verbinden",
        "Freie Zeiten anbieten",
        "Doppelte Pflege vermeiden",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "Calendar synchronization",
      title: "Booked appointments go straight into your calendar.",
      lead: "WellSpring.AI offers suitable available times and adds confirmed appointments to your existing calendar, without asking your team to enter them twice.",
      previewLabel: "PRACTICE CALENDAR",
      previewTitle: "Friday, November 21",
      previewStatus: "Synced",
      rows: [
        ["9:00 am", "Check-up · M. Schneider"],
        ["11:30 am", "Urgent visit · L. Weber"],
        ["2:30 pm", "Open for new bookings"],
      ],
      result: "Confirmed appointments are visible to your team.",
      proof: [
        "Connect your existing calendar",
        "Offer available times",
        "Avoid duplicate entry",
      ],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
  "call-summaries": {
    de: {
      eyebrow: "Zusammenfassung nach jedem Anruf",
      title: "Sie wissen sofort, worum es ging und was als Nächstes ansteht.",
      lead: "Nach dem Gespräch erhält Ihr Team die wichtigsten Informationen übersichtlich zusammengefasst, damit Rückrufe und nächste Schritte nicht untergehen.",
      previewLabel: "ANRUF-ZUSAMMENFASSUNG",
      previewTitle: "Kontrolltermin angefragt",
      previewStatus: "Gerade eben",
      rows: [
        ["Anrufer", "Markus Schneider"],
        ["Anliegen", "Kontrolltermin nächste Woche"],
        ["Rückruf", "Nicht erforderlich"],
      ],
      result: "Alle wichtigen Details auf einen Blick.",
      proof: [
        "Name und Anliegen",
        "Gebuchter Termin",
        "Nächster Schritt fürs Team",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "A summary after every call",
      title: "Know what callers needed and what should happen next.",
      lead: "After the conversation, your team gets the important details in a clear summary, so callbacks and follow-ups don't disappear in the daily rush.",
      previewLabel: "CALL SUMMARY",
      previewTitle: "Check-up requested",
      previewStatus: "Just now",
      rows: [
        ["Caller", "Markus Schneider"],
        ["Reason", "Check-up next week"],
        ["Callback", "Not needed"],
      ],
      result: "The useful details, all in one place.",
      proof: [
        "Caller and reason",
        "Booked appointment",
        "Next step for your team",
      ],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
  "automatic-callbacks": {
    de: {
      eyebrow: "Automatische Rückrufe",
      title: "Ein unterbrochener Anruf muss kein verlorener Termin sein.",
      lead: "Wenn ein Anrufer buchen wollte, das Gespräch aber abbricht, kann WellSpring.AI den Rückruf übernehmen und Ihrem Team den Gesprächsstand mitteilen.",
      previewLabel: "RÜCKRUF-STATUS",
      previewTitle: "Buchung nicht abgeschlossen",
      previewStatus: "Rückruf geplant",
      rows: [
        ["Anliegen", "Termin vereinbaren"],
        ["Gespräch", "Vor der Auswahl beendet"],
        ["Nächster Schritt", "Anrufer zurückrufen"],
      ],
      result: "Ihr Team bleibt über den Verlauf informiert.",
      proof: [
        "Abgebrochene Buchungen erkennen",
        "Rückruf anstoßen",
        "Verlauf im Blick behalten",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "Automatic callbacks",
      title: "An interrupted call doesn't have to mean a lost appointment.",
      lead: "If a caller wanted to book but the conversation drops, WellSpring.AI can handle the callback and keep your team informed about the conversation so far.",
      previewLabel: "CALLBACK STATUS",
      previewTitle: "Booking not completed",
      previewStatus: "Callback queued",
      rows: [
        ["Reason", "Schedule an appointment"],
        ["Call", "Ended before choosing a time"],
        ["Next step", "Call the patient back"],
      ],
      result: "Your team can follow the conversation.",
      proof: [
        "Spot interrupted bookings",
        "Start a callback",
        "Keep the call context",
      ],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
  "privacy-and-security": {
    de: {
      eyebrow: "Datenschutz und Sicherheit",
      title: "Sorgfältiger Umgang mit sensiblen Praxisdaten.",
      lead: "Anrufdaten werden verschlüsselt übertragen und in der EU gehostet. WellSpring.AI ist darauf ausgelegt, die Anforderungen im Praxisalltag ernst zu nehmen.",
      previewLabel: "SICHERHEITSSTATUS",
      previewTitle: "Datenübertragung geschützt",
      previewStatus: "Aktiv",
      rows: [
        ["Übertragung", "Verschlüsselt"],
        ["Hosting", "Europäische Union"],
        ["Zugriff", "Für Ihr Praxisteam"],
      ],
      result: "Datenschutz ist Teil des Ablaufs, nicht nachträglich ergänzt.",
      proof: [
        "Verschlüsselte Übertragung",
        "Hosting in der EU",
        "Kein Verkauf von Patientendaten",
      ],
      book: "Erstgespräch buchen",
      allFeatures: "Alle Funktionen",
      login: "Anmelden",
    },
    en: {
      eyebrow: "Privacy and security",
      title: "Sensitive practice data deserves careful handling.",
      lead: "Call data is transferred encrypted and hosted in the EU. WellSpring.AI is designed to take the needs of a healthcare practice seriously.",
      previewLabel: "SECURITY STATUS",
      previewTitle: "Protected data transfer",
      previewStatus: "Active",
      rows: [
        ["Transfer", "Encrypted"],
        ["Hosting", "European Union"],
        ["Access", "Your practice team"],
      ],
      result: "Privacy is part of the workflow, not an afterthought.",
      proof: ["Encrypted transfer", "EU hosting", "No sale of patient data"],
      book: "Book an introduction",
      allFeatures: "All features",
      login: "Log in",
    },
  },
};

export default async function FeatureDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const lang: Lang = query.lang === "de" ? "de" : "en";
  const copy = featureContent[slug]?.[lang];

  if (!copy) notFound();

  return (
    <div
      className="praxisline-landing feature-detail notranslate"
      lang={lang}
      translate="no"
    >
      <header>
        <nav className="wrap">
          <Link className="logo" href="/">
            <BrandMark />
            WellSpring.AI
          </Link>
          <div className="nav-links">
            <Link href="/#funktionen">{copy.allFeatures}</Link>
            <Link href="/login">{copy.login}</Link>
            <a
              className="nav-cta"
              href="https://calendly.com/djmurphy041/30min"
            >
              {copy.book}
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="feature-hero">
          <div className="wrap feature-hero-grid">
            <div className="feature-copy">
              <div className="eyebrow">{copy.eyebrow}</div>
              <h1>{copy.title}</h1>
              <p className="feature-lead">{copy.lead}</p>
              <div className="feature-actions">
                <a
                  className="btn-primary"
                  href="https://calendly.com/djmurphy041/30min"
                >
                  {copy.book}
                </a>
                <Link className="btn-ghost" href="/#funktionen">
                  {copy.allFeatures}
                </Link>
              </div>
              <ul className="feature-proof">
                {copy.proof.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="feature-preview" aria-label={copy.previewTitle}>
              <div className="feature-preview-bar">
                <span className="feature-preview-icon" aria-hidden="true">
                  W
                </span>
                <div>
                  <strong>WellSpring.AI</strong>
                  <span>
                    {lang === "de"
                      ? "Praxis Dr. Feldmann"
                      : "Dr. Feldmann's practice"}
                  </span>
                </div>
                <span className="feature-preview-status">
                  <i />
                  {copy.previewStatus}
                </span>
              </div>
              <div className="feature-preview-body">
                <div className="feature-preview-label">{copy.previewLabel}</div>
                <h2>{copy.previewTitle}</h2>
                <dl>
                  {copy.rows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="feature-preview-result">
                  <span aria-hidden="true">✓</span>
                  {copy.result}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-bottom">
          <div className="wrap feature-bottom-inner">
            <p>
              {lang === "de"
                ? "WellSpring.AI für Ihre Praxis entdecken"
                : "See what WellSpring.AI can do for your practice"}
            </p>
            <Link href="/#funktionen">
              {copy.allFeatures}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
