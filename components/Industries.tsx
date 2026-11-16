type Lang = "de" | "en";

/*
  "Built for your trade" section. Add a photo to any card by putting a file in
  /public/industries/ and setting `img` below, e.g. img: "/industries/plumbing.jpg".
  Without `img` the card shows its emoji on a soft colour tile.
*/
const ITEMS: {
  icon: string;
  tint: string;
  img?: string;
  de: [string, string];
  en: [string, string];
}[] = [
  { icon: "🦷", tint: "#e4ede6", de: ["Zahnarztpraxen", "Kontrolltermine und Schmerzfälle, sortiert."], en: ["Dental practices", "Check-ups and pain cases, sorted."] },
  { icon: "🩺", tint: "#e3ebee", de: ["Arztpraxen", "Terminwünsche und Rezeptanfragen, aufgenommen."], en: ["Medical practices", "Appointment and prescription requests, taken."] },
  { icon: "💆", tint: "#f2e6d3", de: ["Physiotherapie", "Folgetermine ohne Dauerklingeln."], en: ["Physiotherapy", "Follow-up bookings without the constant ringing."] },
  { icon: "🔧", tint: "#e3ebee", de: ["Sanitär & Heizung", "Notfälle am Abend, direkt weitergegeben."], en: ["Plumbing & heating", "After-hours emergencies, passed on at once."] },
  { icon: "⚖️", tint: "#ece6d6", de: ["Anwälte & Steuerberater", "Erstanfragen mit allen wichtigen Angaben."], en: ["Law & tax advisers", "First enquiries with every key detail."] },
  { icon: "✂️", tint: "#f2e6d3", de: ["Friseur & Kosmetik", "Termine buchen, während Sie am Kunden sind."], en: ["Hair & beauty", "Bookings made while you're with a client."] },
  { icon: "🚗", tint: "#e4ede6", de: ["Autowerkstätten", "Werkstatttermine und Rückfragen, erfasst."], en: ["Car workshops", "Service bookings and questions, logged."] },
  { icon: "🏠", tint: "#ece6d6", de: ["Immobilienmakler", "Besichtigungen auch abends vereinbart."], en: ["Estate agents", "Viewings booked in the evening too."] },
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
