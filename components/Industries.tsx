type Lang = "de" | "en";

/* Built for your trade section. Image URLs can be replaced with local assets later. */
const ITEMS: {
  icon: string;
  tint: string;
  img?: string;
  de: [string, string];
  en: [string, string];
}[] = [
  {
    icon: "🦷",
    tint: "#e4ede6",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    de: ["Zahnarztpraxen", "Kontrolltermine und Schmerzfälle, sortiert."],
    en: ["Dental practices", "Check-ups and pain cases, sorted."],
  },
  {
    icon: "🩺",
    tint: "#e3ebee",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
    de: ["Arztpraxen", "Terminwünsche und Rezeptanfragen, aufgenommen."],
    en: ["Medical practices", "Appointment and prescription requests, taken."],
  },
  {
    icon: "💆",
    tint: "#f2e6d3",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    de: ["Physiotherapie", "Folgetermine ohne Dauerklingeln."],
    en: ["Physiotherapy", "Follow-up bookings without the constant ringing."],
  },
  {
    icon: "🔧",
    tint: "#e3ebee",
    img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    de: ["Sanitär & Heizung", "Notfälle am Abend, direkt weitergegeben."],
    en: ["Plumbing & heating", "After-hours emergencies, passed on at once."],
  },
  {
    icon: "⚖️",
    tint: "#ece6d6",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    de: [
      "Anwälte & Steuerberater",
      "Erstanfragen mit allen wichtigen Angaben.",
    ],
    en: ["Law & tax advisers", "First enquiries with every key detail."],
  },
  {
    icon: "✂️",
    tint: "#f2e6d3",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    de: ["Friseur & Kosmetik", "Termine buchen, während Sie am Kunden sind."],
    en: ["Hair & beauty", "Bookings made while you're with a client."],
  },
  {
    icon: "🚗",
    tint: "#e4ede6",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
    de: ["Autowerkstätten", "Werkstatttermine und Rückfragen, erfasst."],
    en: ["Car workshops", "Service bookings and questions, logged."],
  },
  {
    icon: "🏠",
    tint: "#ece6d6",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    de: ["Immobilienmakler", "Besichtigungen auch abends vereinbart."],
    en: ["Estate agents", "Viewings booked in the evening too."],
  },
];

const COPY = {
  de: {
    eyebrow: "Für jede Branche",
    title: "Abgestimmt auf die Anrufe, die Sie wirklich bekommen.",
    lead: "Jeder Assistent kennt die richtigen Fragen, Ihre Öffnungszeiten und die freien Termine in Ihrem Kalender.",
    more: "Ihre Branche fehlt?",
    cta: "Sprechen Sie mit uns",
  },
  en: {
    eyebrow: "For every trade",
    title: "Tuned for the calls you actually get.",
    lead: "Each assistant knows the right questions, your opening hours and the free slots in your calendar.",
    more: "Not on the list?",
    cta: "Talk to us",
  },
};

export default function Industries({
  lang,
  bookingUrl,
}: {
  lang: Lang;
  bookingUrl: string;
}) {
  const t = COPY[lang];
  return (
    <section id="branchen" className="wsx-ind">
      <div className="wrap">
        <div className="wsx-ind-head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>{t.title}</h2>
          <p>{t.lead}</p>
        </div>
        <ul className="wsx-ind-grid">
          {ITEMS.map((it) => {
            const [name, line] = it[lang];
            return (
              <li className="wsx-ind-card" key={it.icon}>
                <div
                  className="wsx-ind-media"
                  style={{
                    backgroundColor: it.tint,
                    backgroundImage: it.img ? `url(${it.img})` : undefined,
                  }}
                >
                  {!it.img && <span aria-hidden="true">{it.icon}</span>}
                </div>
                <div className="wsx-ind-body">
                  <h3>{name}</h3>
                  <p>{line}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="wsx-ind-more">
          {t.more} <a href={bookingUrl}>{t.cta}</a>
        </p>
      </div>
    </section>
  );
}
