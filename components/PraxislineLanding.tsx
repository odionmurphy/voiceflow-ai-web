import Link from "next/link";

export default function PraxislineLanding() {
  return (
    <div className="praxisline-landing" lang="de">
      <header>
        <nav className="wrap">
          <div className="logo">
            <span className="logo-mark"></span>Praxisline AI
          </div>
          <div className="nav-links">
            <a href="#problem">Warum</a>
            <a href="#demo">Demo</a>
            <a href="#funktionen">Funktionen</a>
            <a href="#preise">Preise</a>
            <Link href="/login">Anmelden</Link>
            <a className="nav-cta" href="https://calendly.com/djmurphy041/30min">
              Erstgespräch buchen
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">KI-Telefonassistent für Praxen</div>
            <h1>
              Ihre Praxis geht
              <br />
              nie mehr <em>ans Band.</em>
            </h1>
            <p className="lead">
              Praxisline AI beantwortet jeden Anruf, führt ein natürliches Gespräch auf
              Deutsch und trägt Termine direkt in Ihren Kalender ein — abends, am
              Wochenende und wenn Ihre Rezeption gerade voll ist.
            </p>
            <div className="hero-ctas">
              <a className="btn-primary" href="https://calendly.com/djmurphy041/30min">
                Kostenloses Erstgespräch buchen
              </a>
              <a className="btn-ghost" href="#demo">
                Beispielanruf ansehen ↓
              </a>
            </div>
            <div className="stat-row">
              <div className="stat">
                <b>24/7</b>
                <span>Erreichbar</span>
              </div>
              <div className="stat">
                <b>&lt;2 Sek.</b>
                <span>Bis zur Begrüßung</span>
              </div>
              <div className="stat">
                <b>100%</b>
                <span>Anrufe beantwortet</span>
              </div>
              <div className="stat">
                <b>DSGVO</b>
                <span>Konform, EU-Hosting</span>
              </div>
            </div>
          </div>

          <div className="call-card-wrap">
            <div className="call-card">
              <div className="call-card-top">
                <span className="dot"></span> EINGEHENDER ANRUF · 0:07
              </div>
              <div className="call-status">Zahnarztpraxis Dr. Feldmann</div>
              <div className="call-sub">Praxisline AI antwortet automatisch</div>
              <div className="wave">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="booked">
                <div className="check">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12L9.5 17.5L20 6"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="booked-title">Termin gebucht</div>
                  <div className="booked-sub">Fr. 09:00 · Kontrolle · M. Schneider</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="wrap">
          <div className="problem-head">
            <div className="eyebrow">Das Problem</div>
            <h2>Jeder verpasste Anruf ist ein Patient, der nicht zurückkommt</h2>
          </div>
          <div className="card-grid">
            <div className="p-card">
              <div className="ic">📞</div>
              <h3>Anrufe während der Behandlung</h3>
              <p>
                Ihr Team steht am Stuhl, das Telefon klingelt durch. Der Patient legt auf
                — und ruft die nächste Praxis an.
              </p>
            </div>
            <div className="p-card">
              <div className="ic">🌙</div>
              <h3>Nach Feierabend keine Erreichbarkeit</h3>
              <p>
                Schmerzpatienten und neue Anfragen kommen abends und am Wochenende. Ihre
                Praxis ist dann offline.
              </p>
            </div>
            <div className="p-card">
              <div className="ic">🗂️</div>
              <h3>Terminvergabe frisst Zeit</h3>
              <p>
                Jeder Rückruf, jede Verschiebung bindet Ihre Rezeption — Zeit, die
                eigentlich am Empfang gebraucht wird.
              </p>
            </div>
            <div className="p-card">
              <div className="ic">📋</div>
              <h3>Keine Übersicht über Anfragen</h3>
              <p>Wer hat angerufen, warum, wurde zurückgerufen? Ohne System geht das im Alltag unter.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="wrap">
          <div className="eyebrow">So funktioniert es</div>
          <h2>In drei Schritten vom Klingeln zum gebuchten Termin</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Anruf kommt an</h3>
              <p>
                Praxisline AI nimmt sofort ab, in Ihrem Namen, mit Ihrer eigenen
                Begrüßung — egal ob die Rezeption besetzt ist oder nicht.
              </p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Natürliches Gespräch</h3>
              <p>
                Die KI versteht das Anliegen, beantwortet häufige Fragen zur Praxis und
                schlägt passende freie Termine vor.
              </p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Termin steht</h3>
              <p>
                Der Termin wird direkt in Ihren Kalender eingetragen, Ihr Team wird
                sofort benachrichtigt. Kein Zettel, kein Rückruf nötig.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo">
        <div className="wrap">
          <div className="demo-head">
            <div className="eyebrow">Live-Demo</div>
            <h2>So klingt ein echter Anruf</h2>
          </div>
          <div className="transcript">
            <div className="t-head">
              <div className="t-head-left">
                <span className="dot"></span>
                <b>Praxisline AI · Zahnarztpraxis Dr. Feldmann</b>
              </div>
              <span className="t-badge">Live-Transkript</span>
            </div>

            <div className="bubble-label">Anrufer</div>
            <div className="bubble caller">
              Guten Tag, ich hätte gerne einen Termin zur Kontrolle, am liebsten diese
              Woche.
            </div>

            <div className="bubble-label right">Praxisline AI</div>
            <div className="bubble ai">
              Guten Tag! Gerne. Ich habe am Donnerstag um 14:30 Uhr oder Freitag um 09:00
              Uhr einen Platz frei — passt Ihnen einer der beiden Termine?
            </div>

            <div className="bubble-label">Anrufer</div>
            <div className="bubble caller">Freitag um neun passt gut.</div>

            <div className="bubble-label right">Praxisline AI</div>
            <div className="bubble ai">
              Perfekt, ich trage Sie für Freitag, 09:00 Uhr zur Kontrolle ein. Wie ist Ihr
              Name, damit ich den Termin korrekt anlegen kann?
            </div>
          </div>
        </div>
      </section>

      <section id="funktionen">
        <div className="wrap">
          <div className="feat-head">
            <div className="eyebrow">Funktionen</div>
            <h2>Gebaut für den Alltag einer Praxis</h2>
          </div>
          <div className="feat-grid">
            <div className="feat">
              <div className="ic">🕐</div>
              <h3>24/7 Erreichbarkeit</h3>
              <p>
                Auch nach Feierabend, am Wochenende und in der Mittagspause nimmt
                Praxisline AI jeden Anruf entgegen.
              </p>
            </div>
            <div className="feat">
              <div className="ic">🗣️</div>
              <h3>Natürliche deutsche Sprache</h3>
              <p>
                Kein starres Menü, kein &quot;Drücken Sie die 1&quot; — echte Gespräche,
                die sich für Patienten normal anfühlen.
              </p>
            </div>
            <div className="feat">
              <div className="ic">📆</div>
              <h3>Kalender-Synchronisation</h3>
              <p>Termine landen direkt in Ihrem bestehenden Kalender — keine doppelte Terminpflege.</p>
            </div>
            <div className="feat">
              <div className="ic">📊</div>
              <h3>Anruf-Zusammenfassungen</h3>
              <p>
                Jeder Anruf wird protokolliert und zusammengefasst — volle Übersicht ohne
                Mehraufwand für Ihr Team.
              </p>
            </div>
            <div className="feat">
              <div className="ic">↩️</div>
              <h3>Automatische Rückrufe</h3>
              <p>
                Wenn ein Anrufer buchen wollte, aber unterbrochen wurde, ruft Praxisline
                AI selbstständig zurück.
              </p>
            </div>
            <div className="feat">
              <div className="ic">🔒</div>
              <h3>DSGVO-konform</h3>
              <p>
                Daten werden verschlüsselt übertragen und in der EU gehostet — konform
                mit den Anforderungen einer Praxis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-wrap">
          <div className="trust-title">Vertrauen ist in der Medizin nicht verhandelbar.</div>
          <div className="trust-items">
            <div className="trust-item">
              <span className="dotc"></span>DSGVO-konform
            </div>
            <div className="trust-item">
              <span className="dotc"></span>Server in der EU
            </div>
            <div className="trust-item">
              <span className="dotc"></span>Verschlüsselte Übertragung
            </div>
            <div className="trust-item">
              <span className="dotc"></span>Kein Verkauf von Patientendaten
            </div>
          </div>
        </div>
      </div>

      <section id="preise">
        <div className="wrap">
          <div className="price-head">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              Preise
            </div>
            <h2 style={{ fontSize: "clamp(30px,3.4vw,40px)" }}>
              Klar kalkuliert, ohne Überraschungen
            </h2>
          </div>
          <div className="price-grid">
            <div className="plan">
              <div className="plan-name">Basis</div>
              <div className="plan-price">
                €497 <span>einmalig</span>
              </div>
              <div className="plan-note">Für Einzelpraxen · Einrichtung</div>
              <ul className="plan-list">
                <li>KI-Telefonassistent für eine Rufnummer</li>
                <li>Begrüßung & FAQ auf Ihre Praxis abgestimmt</li>
                <li>Terminbuchung nach Ihren Regeln</li>
                <li>1 Anpassungsrunde</li>
              </ul>
              <a className="plan-cta" href="https://calendly.com/djmurphy041/30min">
                Erstgespräch buchen
              </a>
            </div>

            <div className="plan popular">
              <div className="plan-badge">Meistgewählt</div>
              <div className="plan-name">Praxis</div>
              <div className="plan-price">
                €997 <span>einmalig</span>
              </div>
              <div className="plan-note">Für Praxen mit hohem Anrufaufkommen</div>
              <ul className="plan-list">
                <li>Alles aus Basis</li>
                <li>Kalender-Synchronisation inklusive</li>
                <li>Automatische Rückrufe</li>
                <li>Anruf-Zusammenfassungen & Auswertung</li>
                <li>2 Anpassungsrunden</li>
              </ul>
              <a className="plan-cta" href="https://calendly.com/djmurphy041/30min">
                Erstgespräch buchen
              </a>
            </div>

            <div className="plan">
              <div className="plan-name">Mehrere Standorte</div>
              <div className="plan-price">Individuell</div>
              <div className="plan-note">Für Praxisketten & MVZ</div>
              <ul className="plan-list">
                <li>Alles aus Praxis</li>
                <li>Mehrere Standorte & Rufnummern</li>
                <li>Monatliche Betreuung & Updates</li>
                <li>Priorisierter Support</li>
              </ul>
              <a className="plan-cta" href="https://calendly.com/djmurphy041/30min">
                Gespräch vereinbaren
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <h2>Bereit, keinen Anruf mehr zu verpassen?</h2>
          <p>
            30 Minuten, unverbindlich. Wir sprechen über Ihre Praxis und wie Praxisline
            AI ab dem ersten Tag Anrufe übernimmt.
          </p>
          <a className="btn-primary" href="https://calendly.com/djmurphy041/30min">
            Kostenloses Erstgespräch buchen →
          </a>
        </div>
      </section>

      <footer>
        <div className="wrap foot-wrap">
          <div>
            Praxisline AI · von <a href="https://murphy1.onrender.com">Murphy Odion</a>
          </div>
          <div>
            <a href="mailto:djmurphy041@gmail.com">djmurphy041@gmail.com</a> · Menden,
            Deutschland
          </div>
        </div>
      </footer>
    </div>
  );
}
