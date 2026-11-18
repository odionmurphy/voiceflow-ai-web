"use client";
import Industries from "@/components/Industries";
import BrandMark from "@/components/BrandMark";
import { useEffect, useState } from "react";
import Link from "next/link";

type Lang = "de" | "en";

const BOOKING_URL = "https://calendly.com/djmurphy041/30min";
const CONTACT_EMAIL = "kontakt.wellspringai@gmail.com";
const FEATURE_SLUGS = [
  "always-on-answering",
  "natural-conversations",
  "calendar-sync",
  "call-summaries",
  "automatic-callbacks",
  "privacy-and-security",
] as const;

/* Background images for the first three problem cards (unchanged from the old page). */
const PROBLEM_MEDIA = [
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(221,150,51,0.08) 60%), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60)",
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(30,78,89,0.05) 60%), url(https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=60)",
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(110,143,115,0.06) 60%), url(https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60)",
];
const FEATURE_ICONS = ["🕐", "🗣️", "📆", "📊", "↩️", "🔒"];
const PROMPT_EXAMPLES: {
  icon: string;
  label: Record<Lang, string>;
  prompt: Record<Lang, string>;
}[] = [
  {
    icon: "⌁",
    label: { de: "Sanitär", en: "Plumbing" },
    prompt: {
      de: "Wenn jemand einen Wasserschaden meldet, frage zuerst, ob das Wasser abgestellt ist.\n\nNotiere die Adresse, das betroffene Zimmer und eine Rückrufnummer. Bei einem aktiven Leck markiere den Anruf als dringend.\n\nBiete anschließend den frühesten verfügbaren Termin an.",
      en: "When someone reports a leak, first ask if they have been able to shut off the water.\n\nGet the service address, affected room, and a callback number. Mark active leaks as urgent.\n\nThen offer the earliest available appointment.",
    },
  },
  {
    icon: "◇",
    label: { de: "Heizung & Klima", en: "HVAC" },
    prompt: {
      de: "Wenn die Heizung oder Klimaanlage ausgefallen ist, frage nach dem betroffenen Gerät und der Temperatur im Gebäude.\n\nBei extremen Temperaturen oder gefährdeten Personen informiere das Team sofort.\n\nErfasse Adresse und bevorzugte Rückrufzeit.",
      en: "If the heating or air conditioning has stopped working, ask which system is affected and the temperature inside.\n\nFlag extreme temperatures or vulnerable occupants for the team right away.\n\nCollect the address and a good callback time.",
    },
  },
  {
    icon: "✚",
    label: { de: "Zahnarztpraxis", en: "Dental" },
    prompt: {
      de: "Frage neue Patienten, welchen Zahnversicherungstarif sie haben.\n\nVersprich niemals eine Kostenübernahme. Notiere den Tarif und sage, dass unser Team den Versicherungsschutz prüft.\n\nBiete danach den nächsten freien Termin an und sende den Buchungslink.",
      en: "For new patients, ask which dental plan they have.\n\nNever promise that a treatment is covered. Note the plan and tell them our team will verify their benefits.\n\nThen offer the next available appointment and send the booking link.",
    },
  },
  {
    icon: "§",
    label: { de: "Kanzlei", en: "Law office" },
    prompt: {
      de: "Frage nach dem Anliegen und den Namen aller beteiligten Personen oder Unternehmen.\n\nGib keine Rechtsberatung und verspreche keine Ergebnisse. Weise darauf hin, dass das Team zuerst eine Interessenkollision prüft.\n\nErfasse die beste Rückrufzeit.",
      en: "Ask what the caller needs help with and the names of everyone involved.\n\nDo not give legal advice or promise an outcome. Let them know the team will check for conflicts before scheduling.\n\nCapture the best time to call back.",
    },
  },
  {
    icon: "⌂",
    label: { de: "Dachdecker", en: "Roofing" },
    prompt: {
      de: "Bei einem Sturmschaden frage, ob Wasser eindringt und ob der Bereich sicher betreten werden kann.\n\nNotiere Adresse, Art des Schadens und eine Rückrufnummer. Bitte um Fotos, falls dies gefahrlos möglich ist.\n\nLeite dringende Schäden sofort ans Team weiter.",
      en: "For storm damage, ask whether water is coming in and if the area is safe to access.\n\nCollect the address, type of damage, and a callback number. Ask for photos only if it is safe to take them.\n\nEscalate urgent damage to the team.",
    },
  },
  {
    icon: "⌖",
    label: { de: "Immobilien", en: "Real estate" },
    prompt: {
      de: "Frage nach dem Objekt oder der Anzeige, für die sich der Anrufer interessiert.\n\nErfasse den gewünschten Besichtigungstermin und die bevorzugte Kontaktmethode. Beantworte Fragen sachlich anhand der freigegebenen Objektdaten.\n\nLeite offene Fragen ans Team weiter.",
      en: "Ask which property or listing the caller is interested in.\n\nCapture their preferred viewing time and contact method. Answer questions using approved listing details only.\n\nPass unanswered questions to the team.",
    },
  },
];

/* All landing-page text lives here, once per language. */
const de = {
  nav: {
    why: "Warum",
    demo: "Demo",
    features: "Funktionen",
    pricing: "Preise",
    login: "Anmelden",
    cta: "Erstgespräch vereinbaren",
  },
  hero: {
    eyebrow: "KI-Telefonassistenz für Unternehmen",
    l1: "Kein Anruf geht",
    l2: "mehr ",
    em: "verloren.",
    lead: "WellSpring.AI nimmt Anrufe entgegen, führt natürliche Gespräche und vereinbart Termine direkt in Ihrem Kalender – auch abends, am Wochenende und wenn Ihr Team gerade beschäftigt ist.",
    cta1: "Kostenloses Erstgespräch vereinbaren",
    cta2: "Beispielanruf ansehen ↓",
    stats: [
      ["24/7", "Erreichbar"],
      ["Direkt", "Anrufannahme"],
      ["Klar", "Zusammenfassungen"],
      ["DSGVO", "Konform, EU-Hosting"],
    ],
  },
  live: {
    header: "Anruf live · gerade eben",
    incoming: "Eingehender Anruf",
    callerLine: "Anrufer: Herr Schneider",
    elapsed: "vergangen",
    ended: "Beendet",
    active: "Läuft",
    callerLabel: "Anrufer",
    aiLabel: "WellSpring.AI",
    summaryTitle: "Zusammenfassung für Ihr Team",
    note: "Beispielgespräch · fiktiver Betrieb",
    steps: [
      {
        kind: "msg",
        who: "caller",
        text: "Guten Tag, ich möchte gerne einen Termin vereinbaren, am liebsten noch diese Woche.",
      },
      {
        kind: "msg",
        who: "ai",
        text: "Guten Tag! Gerne. Am Donnerstag um 14:30 Uhr oder Freitag um 09:00 Uhr ist noch ein Termin frei. Passt Ihnen einer der beiden?",
      },
      { kind: "msg", who: "caller", text: "Freitag um neun passt gut." },
      {
        kind: "msg",
        who: "ai",
        text: "Perfekt, ich trage Sie für Freitag um 09:00 Uhr ein. Wie ist Ihr Name, damit ich den Termin korrekt buchen kann?",
      },
      { kind: "msg", who: "caller", text: "Markus Schneider." },
      {
        kind: "msg",
        who: "ai",
        text: "Vielen Dank, Herr Schneider. Der Termin ist eingetragen. Kann ich sonst noch etwas für Sie tun?",
      },
      { kind: "msg", who: "caller", text: "Nein, danke." },
      { kind: "event", who: "", text: "Termin im Kalender eingetragen" },
      {
        kind: "summary",
        who: "",
        text: "Herr Schneider, Termin am Freitag um 09:00 Uhr. Rufnummer gespeichert.",
      },
    ],
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Verpasste Anrufe können verlorene Aufträge bedeuten",
    cards: [
      {
        t: "Anrufe, während Ihr Team beschäftigt ist",
        d: "Ihr Team ist im Gespräch oder bei einem Kunden. Der Anruf bleibt unbeantwortet – und die Anfrage geht vielleicht an den nächsten Anbieter.",
      },
      {
        t: "Anfragen nach Feierabend",
        d: "Viele Anfragen kommen abends oder am Wochenende. Mit einer Telefonassistenz bleiben Sie auch außerhalb Ihrer Geschäftszeiten erreichbar.",
      },
      {
        t: "Weniger Aufwand für Terminabsprachen",
        d: "Rückrufe und Terminänderungen kosten Zeit. Ihre Telefonassistenz nimmt die wichtigsten Informationen direkt auf.",
      },
      {
        t: "Alle Anfragen im Blick",
        d: "Wer hat angerufen und worum ging es? Gesprächsnotizen helfen Ihrem Team, den Überblick zu behalten und gezielt zurückzurufen.",
      },
    ],
  },
  how: {
    eyebrow: "So funktioniert es",
    title: "Vom ersten Klingeln zur gut dokumentierten Anfrage",
    steps: [
      {
        t: "Anruf kommt an",
        d: "WellSpring.AI nimmt Anrufe mit Ihrer individuellen Begrüßung entgegen – auch wenn Ihr Team gerade nicht erreichbar ist.",
      },
      {
        t: "Das Anliegen wird geklärt",
        d: "Die KI beantwortet häufige Fragen, erfasst wichtige Informationen und kann passende freie Termine vorschlagen.",
      },
      {
        t: "Ihr Team bleibt informiert",
        d: "Termine werden in Ihren Kalender eingetragen. Ihr Team erhält eine übersichtliche Zusammenfassung und kann bei Bedarf zurückrufen.",
      },
    ],
  },
  phone: {
    eyebrow: "Nach dem Anruf",
    title: "Jeder Anruf endet mit einer Nachricht für Ihr Team",
    lead: "Nach dem Anruf erhält Ihr Team eine übersichtliche Zusammenfassung – auf dem Handy und im Dashboard.",
    listTitle: "Alles Wichtige auf einen Blick",
    list: [
      "Name und Rückrufnummer",
      "Das Anliegen des Anrufers",
      "Vereinbarte Termine oder nächste Schritte",
      "Ob ein Rückruf erforderlich ist",
    ],
    footnote:
      "Die Benachrichtigung kommt über die WellSpring-App. Das Dashboard läuft im Browser.",
    lockDay: "Mittwoch",
    lockTime: "14:34",
    appName: "WellSpring.AI",
    now: "jetzt",
    notifTitle: "Neue Anfrage eingegangen",
    notifBody: "Herr Schneider, Terminwunsch, Fr. 09:00",
    appTitle: "Anruf von Herrn Schneider",
    rows: [
      ["Anliegen", "Terminwunsch"],
      ["Termin", "Freitag, 09:00 Uhr"],
      ["Rückruf", "Nummer gespeichert"],
    ],
    booked: "Im Kalender eingetragen",
  },

  features: {
    eyebrow: "Funktionen",
    title: "Für den Alltag Ihres Unternehmens gemacht",
    items: [
      {
        t: "24/7 Erreichbarkeit",
        d: "Auch nach Feierabend, am Wochenende und in der Mittagspause nimmt WellSpring.AI jeden Anruf entgegen.",
      },
      {
        t: "Natürliche Gespräche",
        d: "Kein starres Menü und kein „Drücken Sie die 1“ – Ihre Anrufer können ihr Anliegen einfach schildern.",
      },
      {
        t: "Kalender-Synchronisation",
        d: "Termine landen direkt in Ihrem bestehenden Kalender, ohne doppelte Terminpflege.",
      },
      {
        t: "Anruf-Zusammenfassungen",
        d: "Ihr Team erhält klare Gesprächsnotizen und behält Anfragen im Blick, ohne jedes Gespräch selbst entgegennehmen zu müssen.",
      },
      {
        t: "Automatische Rückrufe",
        d: "Wenn ein Anrufer einen Rückruf wünscht, kann WellSpring.AI ihn nach Ihren Vorgaben kontaktieren.",
      },
      {
        t: "DSGVO-konform",
        d: "Daten werden verschlüsselt übertragen und in der EU gehostet. Die Verarbeitung ist auf geltende Datenschutzanforderungen ausgerichtet.",
      },
    ],
  },
  trust: {
    title: "Vertrauen und Datenschutz haben Priorität.",
    items: [
      "DSGVO-konform",
      "Server in der EU",
      "Verschlüsselte Übertragung",
      "Kein Verkauf Ihrer Kundendaten",
    ],
  },
  pricing: {
    eyebrow: "Preise",
    title: "Wächst mit Ihrem Unternehmen – nicht mit Ihrer Rechnung.",
    intro: "Feste Monatspreise, keine Einrichtungsgebühr und ein klares Anruflimit in jedem Tarif.",
    badge: "Mehr Spielraum",
    terms:
      "Monatliche Preise ohne Einrichtungsgebühr. Enthalten sind beantwortete Anrufe pro Abrechnungszeitraum. Nach Erreichen des Limits pausiert die KI-Anrufannahme bis zum nächsten Zeitraum oder einem Tarifwechsel.",
    plans: [
      {
        name: "Basis",
        price: "€49",
        unit: "/ Monat",
        note: "Für kleinere Anrufvolumen",
        list: [
          "Bis zu 100 beantwortete Anrufe pro Monat",
          "KI-Telefonassistenz für Ihr Unternehmen",
          "Anruf-Zusammenfassungen im Dashboard",
        ],
        cta: "Tarif besprechen",
        popular: false,
      },
      {
        name: "Professional",
        price: "€99",
        unit: "/ Monat",
        note: "Für wachsende Anrufvolumen",
        list: [
          "Bis zu 500 beantwortete Anrufe pro Monat",
          "Alle Funktionen des Basis-Tarifs",
          "Terminverwaltung und Kalenderanbindung",
        ],
        cta: "Tarif besprechen",
        popular: true,
      },
      {
        name: "Business",
        price: "Individuelles Angebot",
        unit: "",
        note: "Für höhere Anrufvolumen",
        list: [
          "Bis zu 1.000 beantwortete Anrufe pro Monat",
          "Monatlicher Preis nach Absprache",
          "Anruflimit und Anforderungen vorab abstimmen",
        ],
        cta: "Angebot anfragen",
        popular: false,
      },
    ],
  },
  final: {
    eyebrow: "LASSEN SIE UNS SPRECHEN",
    title: "Bereit, keinen Anruf mehr zu verpassen?",
    text: "In einem unverbindlichen Gespräch von 30 Minuten klären wir, wie WellSpring.AI Ihre Telefonkommunikation unterstützen kann.",
    cta: "Kostenloses Erstgespräch vereinbaren",
    secondary: "Beispielanruf hören",
  },
  footer: {
    tagline:
      "KI-gestützte Telefonannahme für Unternehmen – damit Anfragen zuverlässig entgegengenommen und übersichtlich weiterbearbeitet werden können.",
    explore: "WellSpring.AI",
    legal: "Rechtliches",
    contact: "Kontakt",
    contactNote: "Sie haben Fragen? Schreiben Sie uns oder vereinbaren Sie ein unverbindliches Gespräch.",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    impressum: "Impressum",
    where: "Menden, Deutschland",
  },
};

type Copy = typeof de;

const en: Copy = {
  nav: {
    why: "Why",
    demo: "Demo",
    features: "Features",
    pricing: "Pricing",
    login: "Log in",
    cta: "Book an introductory call",
  },
  hero: {
    eyebrow: "AI phone answering for businesses",
    l1: "Every call",
    l2: "answered. Every ",
    em: "enquiry captured.",
    lead: "WellSpring.AI answers calls, has natural conversations, and can schedule appointments directly in your calendar—even after hours, at weekends, and whenever your team is busy.",
    cta1: "Book a free introductory call",
    cta2: "See an example call ↓",
    stats: [
      ["24/7", "Reachable"],
      ["Direct", "Call answering"],
      ["Clear", "Call summaries"],
      ["GDPR", "EU hosting"],
    ],
  },
  live: {
    header: "Live call · just now",
    incoming: "Incoming call",
    callerLine: "Caller: Mr Schneider",
    elapsed: "elapsed",
    ended: "Ended",
    active: "Live",
    callerLabel: "Caller",
    aiLabel: "WellSpring.AI",
    summaryTitle: "Summary for your team",
    note: "Example conversation · fictional business",
    steps: [
      {
        kind: "msg",
        who: "caller",
        text: "Hello, I'd like to book an appointment, preferably sometime this week.",
      },
      {
        kind: "msg",
        who: "ai",
        text: "Of course. I have an opening on Thursday at 2:30 pm or Friday at 9:00 am. Would either of those work for you?",
      },
      { kind: "msg", who: "caller", text: "Friday at nine works well." },
      {
        kind: "msg",
        who: "ai",
        text: "Perfect, I'll book you for Friday at 9:00 am. May I have your name so I can confirm the appointment?",
      },
      { kind: "msg", who: "caller", text: "Markus Schneider." },
      {
        kind: "msg",
        who: "ai",
        text: "Thank you, Mr Schneider. Your appointment is confirmed. Is there anything else I can help you with?",
      },
      { kind: "msg", who: "caller", text: "No, thank you." },
      { kind: "event", who: "", text: "Appointment added to the calendar" },
      {
        kind: "summary",
        who: "",
        text: "Mr Schneider, appointment on Friday at 9:00 am. Phone number saved.",
      },
    ],
  },
  problem: {
    eyebrow: "The problem",
    title: "A missed call can mean a missed opportunity",
    cards: [
      {
        t: "Calls while your team is busy",
        d: "Your team is with a customer or handling a task. The call goes unanswered—and the enquiry may go to another provider.",
      },
      {
        t: "Enquiries after hours",
        d: "Potential customers often call in the evening or at weekends. Stay reachable beyond your usual business hours.",
      },
      {
        t: "Time spent arranging appointments",
        d: "Callbacks and schedule changes take time. Your phone assistant can capture the details and handle routine requests.",
      },
      {
        t: "A clearer view of enquiries",
        d: "Call summaries help your team see who called, what they need, and whether a follow-up is required.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "From the first ring to a well-handled enquiry",
    steps: [
      {
        t: "The call comes in",
        d: "WellSpring.AI answers with your personalised greeting, even when your team is unavailable.",
      },
      {
        t: "Understands the request",
        d: "The AI answers common questions, captures key details, and can offer suitable appointment times.",
      },
      {
        t: "Your team stays informed",
        d: "Appointments are added to your calendar. Your team receives a concise summary and can follow up when needed.",
      },
    ],
  },
  phone: {
    eyebrow: "After the call",
    title: "Every call ends with a message for your team",
    lead: "After each call, your team receives a clear summary on their phone and in the dashboard.",
    listTitle: "Everything important at a glance",
    list: [
      "Name and call-back number",
      "What the caller needs",
      "Appointments arranged or next steps",
      "Whether a follow-up is needed",
    ],
    footnote:
      "The notification comes through the WellSpring app. The dashboard runs in your browser.",
    lockDay: "Wednesday",
    lockTime: "2:34",
    appName: "WellSpring.AI",
    now: "now",
    notifTitle: "New enquiry received",
    notifBody: "Mr Schneider, appointment request, Fri 09:00",
    appTitle: "Call from Mr Schneider",
    rows: [
      ["Enquiry", "Appointment request"],
      ["Appointment", "Friday, 9:00 am"],
      ["Call back", "Number saved"],
    ],
    booked: "Added to the calendar",
  },

  features: {
    eyebrow: "Features",
    title: "Built for the way your business works",
    items: [
      {
        t: "Available 24/7",
        d: "After hours, at weekends and during lunch, WellSpring.AI takes every call.",
      },
      {
        t: "Natural conversations",
        d: "No rigid menu or “press 1” instructions—callers can simply explain what they need.",
      },
      {
        t: "Calendar sync",
        d: "Appointments land directly in your existing calendar, with no double entry.",
      },
      {
        t: "Call summaries",
        d: "Clear call summaries help your team track enquiries without having to answer every call themselves.",
      },
      {
        t: "Automatic call backs",
        d: "When a caller requests a follow-up, WellSpring.AI can contact them according to your instructions.",
      },
      {
        t: "GDPR-compliant",
        d: "Data is encrypted in transit and hosted in the EU, with processing designed around applicable privacy requirements.",
      },
    ],
  },
  trust: {
    title: "Trust and privacy come first.",
    items: [
      "GDPR-compliant",
      "Servers in the EU",
      "Encrypted transfer",
      "We never sell your customer data",
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Built to grow with your business—not your bill.",
    intro: "Fixed monthly pricing, no setup fee, and a clear answered-call allowance in every plan.",
    badge: "More room to grow",
    terms:
      "Monthly prices with no setup fee. Each plan includes a set number of answered calls per billing period. When the limit is reached, AI call answering pauses until the next period or a plan change.",
    plans: [
      {
        name: "Starter",
        price: "€49",
        unit: "/ month",
        note: "For lower call volumes",
        list: [
          "Up to 100 answered calls per month",
          "AI phone answering for your business",
          "Call summaries in your dashboard",
        ],
        cta: "Discuss this plan",
        popular: false,
      },
      {
        name: "Professional",
        price: "€99",
        unit: "/ month",
        note: "For growing call volumes",
        list: [
          "Up to 500 answered calls per month",
          "Everything in Starter",
          "Appointment management and calendar connection",
        ],
        cta: "Discuss this plan",
        popular: true,
      },
      {
        name: "Business",
        price: "Custom monthly quote",
        unit: "",
        note: "For higher call volumes",
        list: [
          "Up to 1,000 answered calls per month",
          "Monthly price agreed with you",
          "Discuss call limits and requirements in advance",
        ],
        cta: "Request a quote",
        popular: false,
      },
    ],
  },
  final: {
    eyebrow: "LET'S TALK",
    title: "Ready to stop missing calls?",
    text: "A no-obligation 30-minute conversation about how WellSpring.AI can support your phone operations.",
    cta: "Book a free introductory call",
    secondary: "Hear a sample call",
  },
  footer: {
    tagline:
      "AI-powered call answering for businesses—helping teams capture enquiries reliably and manage follow-ups with clarity.",
    explore: "WellSpring.AI",
    legal: "Legal",
    contact: "Contact",
    contactNote: "Questions about WellSpring.AI? Email us or arrange an introductory call.",
    privacy: "Privacy policy",
    terms: "Terms of service",
    impressum: "Imprint",
    where: "Menden, Germany",
  },
};

const COPY: Record<Lang, Copy> = { de, en };

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("de");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("wsx-lang");
      if (saved === "de" || saved === "en") setLang(saved);
    } catch {
      /* storage can be blocked; the page still works */
    }
  }, []);
  const change = (l: Lang) => {
    setLang(l);
    try {
      window.localStorage.setItem("wsx-lang", l);
    } catch {
      /* ignore */
    }
  };
  return [lang, change];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}

type Step = Copy["live"]["steps"][number];

function FeedItem({
  c,
  step,
  text,
  typing = false,
}: {
  c: Copy;
  step: Step;
  text: string;
  typing?: boolean;
}) {
  if (step.kind === "event") {
    return (
      <div className="wsx-event">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12.5 9.5 18 20 6.5"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {text}
      </div>
    );
  }
  if (step.kind === "summary") {
    return (
      <div className="wsx-summary">
        <strong>{c.live.summaryTitle}</strong>
        <span>{text}</span>
      </div>
    );
  }
  const ai = step.who === "ai";
  return (
    <div className={`wsx-msg ${ai ? "is-ai" : "is-caller"}`}>
      <span className="wsx-who">
        {ai ? c.live.aiLabel : c.live.callerLabel}
      </span>
      <p>
        {text}
        {typing && <span className="wsx-caret" />}
      </p>
    </div>
  );
}

/* A call that types itself, then starts over. With reduced motion it shows the
   finished conversation. Screen readers get the full text once. */
function LiveCall({ c }: { c: Copy }) {
  const steps = c.live.steps;
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const finished = reduced || shown >= steps.length;
  const current = !finished ? steps[shown] : undefined;

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    if (shown >= steps.length) {
      timer = setTimeout(() => {
        setShown(0);
        setTyped(0);
        setSeconds(0);
      }, 7000);
    } else if (current?.kind === "msg") {
      if (typed < current.text.length) {
        timer = setTimeout(() => setTyped(typed + 1), 24);
      } else {
        timer = setTimeout(() => {
          setShown(shown + 1);
          setTyped(0);
        }, 650);
      }
    } else {
      timer = setTimeout(() => setShown(shown + 1), 1100);
    }
    return () => clearTimeout(timer);
  }, [reduced, shown, typed, steps.length, current]);

  useEffect(() => {
    if (reduced || finished) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [reduced, finished]);

  const doneSteps = reduced ? steps : steps.slice(0, shown);
  const mm = String(Math.floor(seconds / 60));
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="wsx-live">
      <p className="wsx-sr">
        {steps
          .map((s) =>
            s.kind === "msg"
              ? `${s.who === "ai" ? c.live.aiLabel : c.live.callerLabel}: ${s.text}`
              : s.text,
          )
          .join(" ")}
      </p>
      <div className="wsx-bar" aria-hidden="true">
        <span className="wsx-dot" />
        {c.live.header}
      </div>
      <div className="wsx-body" aria-hidden="true">
        <div className="wsx-status">
          <div>
            <strong>{c.live.incoming}</strong>
            <span>
              {c.live.callerLine}
              {!reduced && ` · ${mm}:${ss} ${c.live.elapsed}`}
            </span>
          </div>
          <span className={`wsx-chip ${finished ? "ended" : "live"}`}>
            {finished ? c.live.ended : c.live.active}
          </span>
        </div>
        <div className="wsx-feed">
          {doneSteps.map((s, i) => (
            <FeedItem key={i} c={c} step={s} text={s.text} />
          ))}
          {current?.kind === "msg" && (
            <FeedItem
              c={c}
              step={current}
              text={current.text.slice(0, typed)}
              typing
            />
          )}
        </div>
      </div>
      <p className="wsx-note">{c.live.note}</p>
    </div>
  );
}

/* A phone that alternates between the lock screen with a notification and the
   app with the call summary. Static (app view) with reduced motion. */
function PhoneDemo({ c }: { c: Copy }) {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<"lock" | "app">("lock");

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(
      () => setView((v) => (v === "lock" ? "app" : "lock")),
      4800,
    );
    return () => clearInterval(t);
  }, [reduced]);

  const shown = reduced ? "app" : view;
  const p = c.phone;

  return (
    <div
      className="wsx-phone"
      role="img"
      aria-label={`${p.notifTitle}: ${p.notifBody}`}
    >
      <div className="wsx-island" aria-hidden="true" />
      {shown === "lock" ? (
        <div className="wsx-lock" key="lock" aria-hidden="true">
          <span className="wsx-lock-day">{p.lockDay}</span>
          <span className="wsx-lock-time">{p.lockTime}</span>
          <div className="wsx-notif">
            <div className="wsx-notif-top">
              <span className="wsx-notif-icon" />
              <span>{p.appName}</span>
              <span className="wsx-notif-now">{p.now}</span>
            </div>
            <strong>{p.notifTitle}</strong>
            <span>{p.notifBody}</span>
          </div>
        </div>
      ) : (
        <div className="wsx-app" key="app" aria-hidden="true">
          <div className="wsx-app-head">{p.appTitle}</div>
          <dl>
            {p.rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="wsx-booked">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5 9.5 18 20 6.5"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {p.booked}
          </div>
        </div>
      )}
    </div>
  );
}

function PromptPlayground({ lang }: { lang: Lang }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const example = PROMPT_EXAMPLES[active];
  const prompt = example.prompt[lang];
  const copy =
    lang === "de"
      ? {
          eyebrow: "IHRE KI, IHRE REGELN",
          title: "Gestalten Sie Ihre Telefonassistenz in eigenen Worten.",
          lead: "Wählen Sie eine Branche und sehen Sie, wie eine passende Anweisung für Ihren Betrieb entsteht.",
          fieldTitle: "Aufgabe der Telefonassistenz",
          helper:
            "Keine Syntax lernen, einfach beschreiben, wie Ihr Team arbeitet.",
          saved: "GESPEICHERT",
        }
      : {
          eyebrow: "YOUR AI, YOUR RULES",
          title: "Shape your receptionist in plain English.",
          lead: "Choose an industry and see how a tailored instruction can reflect the way your business works.",
          fieldTitle: "Receptionist goal",
          helper: "No syntax to learn. Just describe how your team works.",
          saved: "AUTO-SAVED",
        };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % PROMPT_EXAMPLES.length);
    }, 9200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cursor = 0;
    if (reduced) {
      const timer = window.setTimeout(() => setTyped(prompt), 0);
      return () => window.clearTimeout(timer);
    }

    const resetTimer = window.setTimeout(() => setTyped(""), 0);
    const timer = window.setInterval(() => {
      cursor += 1;
      setTyped(prompt.slice(0, cursor));
      if (cursor >= prompt.length) window.clearInterval(timer);
    }, 24);
    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(timer);
    };
  }, [prompt, reduced]);

  return (
    <section className="prompt-section" aria-labelledby="prompt-title">
      <div className="wrap">
        <div className="prompt-head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2 id="prompt-title">{copy.title}</h2>
          <p>{copy.lead}</p>
        </div>

        <div className="prompt-demo">
          <div
            className="prompt-tabs"
            role="tablist"
            aria-label={lang === "de" ? "Branchen" : "Industries"}
          >
            {PROMPT_EXAMPLES.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === index}
                className={active === index ? "is-active" : ""}
                key={item.label.en}
                onClick={() => setActive(index)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label[lang]}
              </button>
            ))}
          </div>

          <div
            className="prompt-panel"
            role="tabpanel"
            aria-label={example.label[lang]}
          >
            <div className="prompt-panel-head">
              <div>
                <strong>
                  <i />
                  {copy.fieldTitle}
                </strong>
                <span>{example.label[lang]}</span>
              </div>
              <span className="prompt-saved">
                <i />
                {copy.saved}
              </span>
            </div>
            <div className="prompt-editor" aria-label={prompt}>
              <span>{typed}</span>
              {!reduced && typed.length < prompt.length && (
                <i className="prompt-caret" aria-hidden="true" />
              )}
            </div>
            <div className="prompt-helper">
              <span aria-hidden="true">ⓘ</span>
              {copy.helper}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PraxislineLanding() {
  const [lang, setLang] = useLang();
  const c = COPY[lang];

  return (
    <div
      id="top"
      className="praxisline-landing notranslate"
      lang={lang}
      translate="no"
    >
      <header>
        <nav className="wrap">
          <div className="logo">
            <BrandMark />
            WellSpring.AI
          </div>
          <div className="nav-links">
            <a href="#problem">{c.nav.why}</a>
            <a href="#demo">{c.nav.demo}</a>
            <a href="#funktionen">{c.nav.features}</a>
            <a href="#preise">{c.nav.pricing}</a>
            <div className="wsx-lang" role="group" aria-label="Language">
              <button
                type="button"
                aria-pressed={lang === "de"}
                onClick={() => setLang("de")}
              >
                DE
              </button>
              <button
                type="button"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
            <Link href="/login">{c.nav.login}</Link>
            <a className="nav-cta" href={BOOKING_URL}>
              {c.nav.cta}
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">{c.hero.eyebrow}</div>
            <h1>
              {c.hero.l1}
              <br />
              {c.hero.l2}
              <em>{c.hero.em}</em>
            </h1>
            <p className="lead">{c.hero.lead}</p>
            <div className="hero-ctas">
              <a className="btn-primary" href={BOOKING_URL}>
                {c.hero.cta1}
              </a>
              <a className="btn-ghost" href="#demo">
                {c.hero.cta2}
              </a>
            </div>
            <div className="stat-row">
              {c.hero.stats.map(([b, s]) => (
                <div className="stat" key={b}>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="call-card-wrap">
            <LiveCall key={lang} c={c} />
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="wrap">
          <div className="problem-head">
            <div className="eyebrow">{c.problem.eyebrow}</div>
            <h2>{c.problem.title}</h2>
          </div>
          <div className="card-grid">
            {c.problem.cards.map((card, i) => (
              <div className="p-card" key={card.t}>
                {i < 3 ? (
                  <div
                    className="p-card-media"
                    style={{
                      background: PROBLEM_MEDIA[i],
                      backgroundSize: "cover",
                    }}
                  />
                ) : (
                  <div className="ic">📋</div>
                )}
                {i < 3 ? (
                  <div className="p-card-content">
                    <h3>{card.t}</h3>
                    <p>{card.d}</p>
                  </div>
                ) : (
                  <>
                    <h3>{card.t}</h3>
                    <p>{card.d}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromptPlayground key={lang} lang={lang} />

      <section className="how">
        <div className="wrap">
          <div className="eyebrow">{c.how.eyebrow}</div>
          <h2>{c.how.title}</h2>
          <div className="steps">
            {c.how.steps.map((s, i) => (
              <div className="step" key={s.t}>
                <div className="step-num">{`0${i + 1}`}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="handy" className="wsx-phone-section">
        <div className="wrap wsx-phone-grid">
          <PhoneDemo key={lang} c={c} />
          <div>
            <div className="eyebrow">{c.phone.eyebrow}</div>
            <h2>{c.phone.title}</h2>
            <p className="wsx-lead">{c.phone.lead}</p>
            <h3 className="wsx-list-title">{c.phone.listTitle}</h3>
            <ul className="wsx-checks">
              {c.phone.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="wsx-foot">{c.phone.footnote}</p>
          </div>
        </div>
      </section>

      <Industries lang={lang} bookingUrl={BOOKING_URL} />

      <section id="funktionen">
        <div className="wrap">
          <div className="feat-head">
            <div className="eyebrow">{c.features.eyebrow}</div>
            <h2>{c.features.title}</h2>
          </div>
          <div className="feat-grid">
            {c.features.items.map((f, i) => (
              <Link
                className="feat"
                href={`/features/${FEATURE_SLUGS[i]}?lang=${lang}`}
                key={f.t}
                aria-label={`${f.t} — ${lang === "de" ? "Mehr erfahren" : "Learn more"}`}
              >
                <div className="ic" aria-hidden="true">
                  {FEATURE_ICONS[i]}
                </div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
                <span className="feat-link">
                  {lang === "de" ? "Mehr erfahren" : "Learn more"}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-wrap">
          <div className="trust-title">{c.trust.title}</div>
          <div className="trust-items">
            {c.trust.items.map((item) => (
              <div className="trust-item" key={item}>
                <span className="dotc"></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="preise" className="pricing">
        <div className="wrap">
          <div className="price-head">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              {c.pricing.eyebrow}
            </div>
            <h2>{c.pricing.title}</h2>
            <p className="price-intro">{c.pricing.intro}</p>
          </div>
          <div className="price-grid">
            {c.pricing.plans.map((p) => (
              <div
                className={`plan ${p.popular ? "popular" : ""}`}
                key={p.name}
              >
                {p.popular && (
                  <div className="plan-badge">{c.pricing.badge}</div>
                )}
                <div className="plan-name">{p.name}</div>
                <div className={`plan-price${p.unit ? "" : " plan-price-quote"}`}>
                  {p.price} {p.unit && <span>{p.unit}</span>}
                </div>
                <div className="plan-note">{p.note}</div>
                <ul className="plan-list">
                  {p.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
                <a className="plan-cta" href={BOOKING_URL}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="pricing-terms">
            {c.pricing.terms}
          </p>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <div className="final-panel">
            <div className="final-eyebrow">{c.final.eyebrow}</div>
            <h2>{c.final.title}</h2>
            <p>{c.final.text}</p>
            <div className="final-actions">
              <a className="final-primary" href={BOOKING_URL}>
                {c.final.cta}
                <span aria-hidden="true">→</span>
              </a>
              <a className="final-secondary" href="#handy">
                {c.final.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot-main">
          <div className="foot-brand">
            <a
              className="foot-logo"
              href="#top"
              aria-label="WellSpring.AI home"
            >
              <BrandMark />
              WellSpring.AI
            </a>
            <p>{c.footer.tagline}</p>
          </div>
          <div className="foot-column">
            <h3>{c.footer.explore}</h3>
            <a href="#problem">{c.nav.why}</a>
            <a href="#handy">{c.nav.demo}</a>
            <a href="#funktionen">{c.nav.features}</a>
            <a href="#preise">{c.nav.pricing}</a>
          </div>
          <div className="foot-column">
            <h3>{c.footer.legal}</h3>
            <Link href="/privacy">{c.footer.privacy}</Link>
            <Link href="/terms">{c.footer.terms}</Link>
            <Link href="/impressum">{c.footer.impressum}</Link>
          </div>
          <div className="foot-column foot-contact">
            <h3>{c.footer.contact}</h3>
            <p>{c.footer.contactNote}</p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={BOOKING_URL}>{c.final.cta}</a>
            <span>{c.footer.where}</span>
          </div>
        </div>
        <div className="wrap foot-bottom">
          <span>&copy; {new Date().getFullYear()} WellSpring.AI</span>
          <a href="#top">
            {lang === "de" ? "Zurück nach oben ↑" : "Back to top ↑"}
          </a>
        </div>
      </footer>
    </div>
  );
}
