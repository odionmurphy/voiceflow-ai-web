"use client";
import Industries from "@/components/Industries";
import { useEffect, useState } from "react";
import Link from "next/link";

type Lang = "de" | "en";

const BOOKING_URL = "https://calendly.com/djmurphy041/30min";

/* Background images for the first three problem cards (unchanged from the old page). */
const PROBLEM_MEDIA = [
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(221,150,51,0.08) 60%), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60)",
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(30,78,89,0.05) 60%), url(https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=60)",
  "linear-gradient(135deg, rgba(241,235,220,1) 0%, rgba(110,143,115,0.06) 60%), url(https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60)",
];
const FEATURE_ICONS = ["🕐", "🗣️", "📆", "📊", "↩️", "🔒"];

/*
  All page text lives here, once per language. Edit wording in this object.
  The page structure and styling are the old Praxisline landing page.
*/
const de = {
  nav: {
    why: "🤔 Warum",
    demo: "🎧 Demo",
    features: "✨ Funktionen",
    pricing: "💶 Preise",
    login: "🔑 Anmelden",
    cta: "📅 Erstgespräch buchen",
  },
  hero: {
    eyebrow: "KI-Telefonassistent für Praxen",
    l1: "Ihre Praxis geht",
    l2: "Du hast nie wieder. ",
    em: " einen Anruf verpasst.",
    lead: "WellSpring.AI beantwortet jeden Anruf, führt ein natürliches Gespräch auf Deutsch und trägt Termine direkt in Ihren Kalender ein, abends, am Wochenende und wenn Ihre Rezeption gerade voll ist.",
    cta1: "Kostenloses Erstgespräch buchen",
    cta2: "Beispielanruf ansehen ↓",
    stats: [
      ["24/7", "Erreichbar"],
      ["<2 Sek.", "Bis zur Begrüßung"],
      ["100%", "Anrufe beantwortet"],
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
    summaryTitle: "Zusammenfassung für die Praxis",
    note: "Beispiel: Zahnarztpraxis Dr. Feldmann (erfunden)",
    steps: [
      { kind: "msg", who: "caller", text: "Guten Tag, ich hätte gerne einen Termin zur Kontrolle, am liebsten diese Woche." },
      { kind: "msg", who: "ai", text: "Guten Tag! Gerne. Ich habe am Donnerstag um 14:30 Uhr oder Freitag um 09:00 Uhr einen Platz frei. Passt Ihnen einer der beiden Termine?" },
      { kind: "msg", who: "caller", text: "Freitag um neun passt gut." },
      { kind: "msg", who: "ai", text: "Perfekt, ich trage Sie für Freitag, 09:00 Uhr zur Kontrolle ein. Wie ist Ihr Name, damit ich den Termin korrekt anlegen kann?" },
      { kind: "msg", who: "caller", text: "Markus Schneider." },
      { kind: "msg", who: "ai", text: "Vielen Dank, Herr Schneider. Der Termin steht. Kann ich sonst noch helfen?" },
      { kind: "msg", who: "caller", text: "Nein, danke." },
      { kind: "event", who: "", text: "Termin im Kalender eingetragen" },
      { kind: "summary", who: "", text: "Herr Schneider, Kontrolle am Freitag um 09:00 Uhr. Rufnummer gespeichert." },
    ],
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Jeder verpasste Anruf ist ein Patient, der nicht zurückkommt",
    cards: [
      {
        t: "Anrufe während der Behandlung",
        d: "Ihr Team steht am Stuhl, das Telefon klingelt durch. Der Patient legt auf und ruft die nächste Praxis an.",
      },
      {
        t: "Nach Feierabend keine Erreichbarkeit",
        d: "Schmerzpatienten und neue Anfragen kommen abends und am Wochenende. Ihre Praxis ist dann offline.",
      },
      {
        t: "Terminvergabe frisst Zeit",
        d: "Jeder Rückruf, jede Verschiebung bindet Ihre Rezeption, Zeit, die eigentlich am Empfang gebraucht wird.",
      },
      {
        t: "Keine Übersicht über Anfragen",
        d: "Wer hat angerufen, warum, wurde zurückgerufen? Ohne System geht das im Alltag unter.",
      },
    ],
  },
  how: {
    eyebrow: "So funktioniert es",
    title: "In drei Schritten vom Klingeln zum gebuchten Termin",
    steps: [
      {
        t: "Anruf kommt an",
        d: "WellSpring.AI nimmt sofort ab, in Ihrem Namen, mit Ihrer eigenen Begrüßung, egal ob die Rezeption besetzt ist oder nicht.",
      },
      {
        t: "Natürliches Gespräch",
        d: "Die KI versteht das Anliegen, beantwortet häufige Fragen zur Praxis und schlägt passende freie Termine vor.",
      },
      {
        t: "Termin steht",
        d: "Der Termin wird direkt in Ihren Kalender eingetragen, Ihr Team wird sofort benachrichtigt. Kein Zettel, kein Rückruf nötig.",
      },
    ],
  },
  phone: {
    eyebrow: "Nach dem Anruf",
    title: "Jeder Anruf endet mit einer Nachricht für Ihr Team",
    lead: "Sobald der Anrufer auflegt, sehen Sie auf dem Handy, was passiert ist. Die Zusammenfassung finden Sie auch im Dashboard.",
    listTitle: "Alles Wichtige auf einen Blick",
    list: [
      "Name und Rückrufnummer",
      "Was der Anrufer wollte, in einfachen Worten",
      "Welcher Termin gebucht wurde",
      "Ob ein Rückruf nötig ist",
    ],
    footnote:
      "Die Benachrichtigung kommt über die WellSpring-App. Das Dashboard läuft im Browser.",
    lockDay: "Mittwoch",
    lockTime: "14:34",
    appName: "WellSpring.AI",
    now: "jetzt",
    notifTitle: "Neuer Termin gebucht",
    notifBody: "Herr Schneider, Kontrolle, Fr. 09:00",
    appTitle: "Anruf von Herrn Schneider",
    rows: [
      ["Anliegen", "Kontrolltermin"],
      ["Termin", "Freitag, 09:00 Uhr"],
      ["Rückruf", "Nummer gespeichert"],
    ],
    booked: "Im Kalender eingetragen",
  },

  
  
  features: {
    eyebrow: "Funktionen",
    title: "Gebaut für den Alltag einer Praxis",
    items: [
      {
        t: "24/7 Erreichbarkeit",
        d: "Auch nach Feierabend, am Wochenende und in der Mittagspause nimmt WellSpring.AI jeden Anruf entgegen.",
      },
      {
        t: "Natürliche deutsche Sprache",
        d: "Kein starres Menü, kein „Drücken Sie die 1“, sondern echte Gespräche, die sich für Patienten normal anfühlen.",
      },
      {
        t: "Kalender-Synchronisation",
        d: "Termine landen direkt in Ihrem bestehenden Kalender, ohne doppelte Terminpflege.",
      },
      {
        t: "Anruf-Zusammenfassungen",
        d: "Jeder Anruf wird protokolliert und zusammengefasst, mit voller Übersicht ohne Mehraufwand für Ihr Team.",
      },
      {
        t: "Automatische Rückrufe",
        d: "Wenn ein Anrufer buchen wollte, aber unterbrochen wurde, ruft WellSpring.AI selbstständig zurück.",
      },
      {
        t: "DSGVO-konform",
        d: "Daten werden verschlüsselt übertragen und in der EU gehostet, konform mit den Anforderungen einer Praxis.",
      },
    ],
  },
  trust: {
    title: "Vertrauen ist in der Medizin nicht verhandelbar.",
    items: [
      "DSGVO-konform",
      "Server in der EU",
      "Verschlüsselte Übertragung",
      "Kein Verkauf von Patientendaten",
    ],
  },
  pricing: {
    eyebrow: "Preise",
    title: "Klar kalkuliert, ohne Überraschungen",
    badge: "Meistgewählt",
    plans: [
      {
        name: "Basis",
        price: "€497",
        unit: "einmalig",
        note: "Für Einzelpraxen · Einrichtung",
        list: [
          "KI-Telefonassistent für eine Rufnummer",
          "Begrüßung & FAQ auf Ihre Praxis abgestimmt",
          "Terminbuchung nach Ihren Regeln",
          "1 Anpassungsrunde",
        ],
        cta: "Erstgespräch buchen",
        popular: false,
      },
      {
        name: "Praxis",
        price: "€997",
        unit: "einmalig",
        note: "Für Praxen mit hohem Anrufaufkommen",
        list: [
          "Alles aus Basis",
          "Kalender-Synchronisation inklusive",
          "Automatische Rückrufe",
          "Anruf-Zusammenfassungen & Auswertung",
          "2 Anpassungsrunden",
        ],
        cta: "Erstgespräch buchen",
        popular: true,
      },
      {
        name: "Mehrere Standorte",
        price: "Individuell",
        unit: "",
        note: "Für Praxisketten & MVZ",
        list: [
          "Alles aus Praxis",
          "Mehrere Standorte & Rufnummern",
          "Monatliche Betreuung & Updates",
          "Priorisierter Support",
        ],
        cta: "Gespräch vereinbaren",
        popular: false,
      },
    ],
  },
  final: {
    title: "Bereit, keinen Anruf mehr zu verpassen?",
    text: "30 Minuten, unverbindlich. Wir sprechen über Ihre Praxis und wie WellSpring.AI ab dem ersten Tag Anrufe übernimmt.",
    cta: "Kostenloses Erstgespräch buchen →",
  },
  footer: { by: "WellSpring.AI · von", where: "Menden, Deutschland" },
};

type Copy = typeof de;

const en: Copy = {
  nav: {
    why: "🤔 Why",
    demo: "🎧 Demo",
    features: "✨ Features",
    pricing: "💶 Pricing",
    login: "🔑 Log in",
    cta: "📅 Book a first call",
  },
  hero: {
    eyebrow: "AI phone assistant for practices",
    l1: "Your never misses ",
    l2: "a call ",
    em: "Again.",
    lead: "WellSpring.AI answers every call, holds a natural conversation, and books appointments straight into your calendar, in the evening, at weekends, and when your front desk is busy.",
    cta1: "Book a free first call",
    cta2: "See an example call ↓",
    stats: [
      ["24/7", "Reachable"],
      ["<2 sec.", "To greeting"],
      ["100%", "Answered"],
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
    summaryTitle: "Summary for the practice",
    note: "Example: Dr. Feldmann dental practice (invented)",
    steps: [
      { kind: "msg", who: "caller", text: "Hello, I'd like a check-up appointment, preferably this week." },
      { kind: "msg", who: "ai", text: "Hello! Of course. I have a slot on Thursday at 2:30 pm or Friday at 9:00 am. Does either of those work for you?" },
      { kind: "msg", who: "caller", text: "Friday at nine works well." },
      { kind: "msg", who: "ai", text: "Perfect, I'll book you for a check-up on Friday at 9:00 am. What is your name, so I can create the appointment correctly?" },
      { kind: "msg", who: "caller", text: "Markus Schneider." },
      { kind: "msg", who: "ai", text: "Thank you, Mr Schneider. Your appointment is booked. Is there anything else I can help with?" },
      { kind: "msg", who: "caller", text: "No, thank you." },
      { kind: "event", who: "", text: "Appointment added to the calendar" },
      { kind: "summary", who: "", text: "Mr Schneider, check-up on Friday at 9:00 am. Phone number saved." },
    ],
  },
  problem: {
    eyebrow: "The problem",
    title: "Every missed call is a patient who doesn't come back",
    cards: [
      {
        t: "Calls during treatment",
        d: "Your team is at the chair and the phone rings out. The patient hangs up and calls the next practice.",
      },
      {
        t: "Nobody there after hours",
        d: "Patients in pain and new enquiries come in the evening and at weekends. Your practice is offline.",
      },
      {
        t: "Booking eats time",
        d: "Every call back and every reschedule ties up your front desk, time that is needed at reception.",
      },
      {
        t: "No overview of enquiries",
        d: "Who called, why, and did anyone call back? Without a system that gets lost in the daily routine.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "From the first ring to a booked appointment in three steps",
    steps: [
      {
        t: "The call comes in",
        d: "WellSpring.AI picks up straight away, in your name and with your own greeting, whether the front desk is free or not.",
      },
      {
        t: "A natural conversation",
        d: "The AI understands the request, answers common questions about the practice, and offers suitable free slots.",
      },
      {
        t: "The appointment is set",
        d: "The appointment goes straight into your calendar and your team is notified at once. No note, no call back needed.",
      },
    ],
  },
  phone: {
    eyebrow: "After the call",
    title: "Every call ends with a message for your team",
    lead: "As soon as the caller hangs up, you see on your phone what happened. The summary is also in your dashboard.",
    listTitle: "Everything important at a glance",
    list: [
      "Name and call-back number",
      "What the caller wanted, in plain words",
      "Which appointment was booked",
      "Whether a call back is needed",
    ],
    footnote:
      "The notification comes through the WellSpring app. The dashboard runs in your browser.",
    lockDay: "Wednesday",
    lockTime: "2:34",
    appName: "WellSpring.AI",
    now: "now",
    notifTitle: "New appointment booked",
    notifBody: "Mr Schneider, check-up, Fri 09:00",
    appTitle: "Call from Mr Schneider",
    rows: [
      ["Reason", "Check-up appointment"],
      ["Appointment", "Friday, 9:00 am"],
      ["Call back", "Number saved"],
    ],
    booked: "Added to the calendar",
  },


  features: {
    eyebrow: "Features",
    title: "Built for the daily routine of a practice",
    items: [
      {
        t: "Available 24/7",
        d: "After hours, at weekends and during lunch, WellSpring.AI takes every call.",
      },
      {
        t: "Natural German language",
        d: "No rigid menu, no “press 1”, just real conversations that feel normal to patients.",
      },
      {
        t: "Calendar sync",
        d: "Appointments land directly in your existing calendar, with no double entry.",
      },
      {
        t: "Call summaries",
        d: "Every call is logged and summarised, giving full overview with no extra work for your team.",
      },
      {
        t: "Automatic call backs",
        d: "If a caller wanted to book but was interrupted, WellSpring.AI calls back by itself.",
      },
      {
        t: "GDPR-compliant",
        d: "Data is transferred encrypted and hosted in the EU, in line with a practice's requirements.",
      },
    ],
  },
  trust: {
    title: "Trust is not negotiable in medicine.",
    items: [
      "GDPR-compliant",
      "Servers in the EU",
      "Encrypted transfer",
      "No sale of patient data",
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Clearly priced, no surprises",
    badge: "Most chosen",
    plans: [
      {
        name: "Basic",
        price: "€497",
        unit: "one-off",
        note: "For single practices · Setup",
        list: [
          "AI phone assistant for one phone number",
          "Greeting & FAQ tailored to your practice",
          "Booking following your rules",
          "1 round of adjustments",
        ],
        cta: "Book a first call",
        popular: false,
      },
      {
        name: "Practice",
        price: "€997",
        unit: "one-off",
        note: "For practices with many calls",
        list: [
          "Everything in Basic",
          "Calendar sync included",
          "Automatic call backs",
          "Call summaries & reporting",
          "2 rounds of adjustments",
        ],
        cta: "Book a first call",
        popular: true,
      },
      {
        name: "Multiple locations",
        price: "Custom",
        unit: "",
        note: "For practice groups & medical centres",
        list: [
          "Everything in Practice",
          "Several locations & phone numbers",
          "Monthly support & updates",
          "Priority support",
        ],
        cta: "Arrange a call",
        popular: false,
      },
    ],
  },
  final: {
    title: "Ready to stop missing calls?",
    text: "30 minutes, no obligation. We talk about your practice and how WellSpring.AI takes over calls from day one.",
    cta: "Book a free first call →",
  },
  footer: { by: "WellSpring.AI · by", where: "Menden, Germany" },
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
      <span className="wsx-who">{ai ? c.live.aiLabel : c.live.callerLabel}</span>
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
            <FeedItem c={c} step={current} text={current.text.slice(0, typed)} typing />
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

export default function PraxislineLanding() {
  const [lang, setLang] = useLang();
  const c = COPY[lang];

  return (
    <div className="praxisline-landing" lang={lang}>
      <header>
        <nav className="wrap">
          <div className="logo">
            <span className="logo-mark"></span>WellSpring.AI
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
              <div className="feat" key={f.t}>
                <div className="ic">{FEATURE_ICONS[i]}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
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

      <section id="preise">
        <div className="wrap">
          <div className="price-head">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              {c.pricing.eyebrow}
            </div>
            <h2 style={{ fontSize: "clamp(30px,3.4vw,40px)" }}>
              {c.pricing.title}
            </h2>
          </div>
          <div className="price-grid">
            {c.pricing.plans.map((p) => (
              <div className={`plan ${p.popular ? "popular" : ""}`} key={p.name}>
                {p.popular && (
                  <div className="plan-badge">{c.pricing.badge}</div>
                )}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
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
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <h2>{c.final.title}</h2>
          <p>{c.final.text}</p>
          <a className="btn-primary" href={BOOKING_URL}>
            {c.final.cta}
          </a>
        </div>
      </section>

      <footer>
        <div className="wrap foot-wrap">
          <div>
            {c.footer.by}{" "}
            <a href="https://murphy1.onrender.com">Murphy Odion</a>
          </div>
          <div>
            <a href="mailto:djmurphy041@gmail.com">djmurphy041@gmail.com</a> ·{" "}
            {c.footer.where}
          </div>
        </div>
      </footer>
    </div>
  );
}
