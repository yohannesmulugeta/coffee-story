const mediaBase =
  "https://raw.githubusercontent.com/yohannesmulugeta/Sibu-trading/main/public/images/";

const coffeeTypes = [
  {
    number: "01",
    title: "Specialty coffee",
    description:
      "Distinctive Ethiopian lots for buyers seeking character, clarity, and a strong sense of origin.",
    image: `${mediaBase}coffee-specialty.webp`,
  },
  {
    number: "02",
    title: "Commercial coffee",
    description:
      "Dependable green-coffee supply prepared for wholesale programmes and long-term purchasing needs.",
    image: `${mediaBase}coffee-commercial.webp`,
  },
  {
    number: "03",
    title: "Certified coffee",
    description:
      "Coffee prepared around traceability, structured lot handling, and buyer-specific sourcing requirements.",
    image: `${mediaBase}coffee-certified.webp`,
  },
] as const;

const origins = [
  {
    name: "Abaya Gelana",
    label: "Coffee farms",
    image: `${mediaBase}farm-abaya-landscape.webp`,
  },
  {
    name: "Hambella Wamena",
    label: "Farm and washing station",
    image: `${mediaBase}farm-hambella-washing.webp`,
  },
  {
    name: "Guji Kercha / Guracho",
    label: "Coffee farms",
    image: `${mediaBase}farm-kercha-landscape.webp`,
  },
] as const;

const journey = [
  ["01", "Harvest", "Coffee begins with careful picking at origin."],
  ["02", "Selection", "Lots are sorted and prepared with attention to quality."],
  ["03", "Processing", "Coffee moves through the process required for each programme."],
  ["04", "Preparation", "Green coffee is organised for buyer and export requirements."],
  ["05", "Export", "Prepared lots move from Ethiopia toward international buyers."],
] as const;

export function SibuSections() {
  return (
    <>
      <section className="sibu-transition" aria-label="Sibu Trading introduction">
        <div className="sibu-shell sibu-transition__inner">
          <p className="sibu-kicker">SIBU TRADING PLC · GUJI, ETHIOPIA</p>
          <h2>A legacy carried forward.</h2>
          <p>
            The family story continues today through Sibu Trading PLC — connecting generations of
            coffee knowledge with the needs of modern green-coffee buyers.
          </p>
        </div>
      </section>

      <section className="sibu-about" id="about">
        <div className="sibu-shell sibu-about__grid">
          <div className="sibu-about__copy">
            <p className="sibu-kicker">ABOUT SIBU</p>
            <h2>From generations of coffee knowledge to a modern Ethiopian export company.</h2>
            <p>
              Sibu Trading PLC brings more than 25 years of experience in Ethiopian coffee. From
              Guji, the company works with green coffee prepared for international buyers, with
              attention to quality, origin, and dependable export preparation.
            </p>
            <div className="sibu-about__meta" aria-label="Sibu Trading highlights">
              <div>
                <strong>25+</strong>
                <span>Years of coffee export experience</span>
              </div>
              <div>
                <strong>Guji</strong>
                <span>Ethiopia</span>
              </div>
            </div>
            <a className="sibu-text-link" href="#coffee">
              Explore our coffee <span aria-hidden="true">↘</span>
            </a>
          </div>

          <figure className="sibu-about__image">
            <img
              src={`${mediaBase}ethiopia-coffee-growers-hawassa.webp`}
              alt="Coffee-growing family in Ethiopia"
              loading="lazy"
            />
            <figcaption>ETHIOPIA · COFFEE BEGINS WITH PEOPLE</figcaption>
          </figure>
        </div>
      </section>

      <section className="sibu-coffee" id="coffee">
        <div className="sibu-shell">
          <div className="sibu-section-heading">
            <p className="sibu-kicker">OUR COFFEE</p>
            <h2>Coffee shaped by origin.</h2>
            <p>
              A focused green-coffee offering for buyers looking for Ethiopian character,
              dependable preparation, and clear sourcing conversations.
            </p>
          </div>

          <div className="sibu-coffee__list">
            {coffeeTypes.map((coffee) => (
              <article className="sibu-coffee__item" key={coffee.title}>
                <div className="sibu-coffee__visual">
                  <img src={coffee.image} alt={coffee.title} loading="lazy" />
                </div>
                <div className="sibu-coffee__copy">
                  <span>{coffee.number}</span>
                  <h3>{coffee.title}</h3>
                  <p>{coffee.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sibu-origin" id="origin">
        <div className="sibu-shell">
          <div className="sibu-section-heading sibu-section-heading--light">
            <p className="sibu-kicker">FROM THE LAND</p>
            <h2>The story remains connected to where coffee grows.</h2>
            <p>
              Sibu&apos;s current coffee story is closely connected with Guji and the surrounding
              coffee-growing areas represented across its existing portfolio.
            </p>
          </div>

          <div className="sibu-origin__grid">
            {origins.map((origin, index) => (
              <figure className={`sibu-origin__panel sibu-origin__panel--${index + 1}`} key={origin.name}>
                <img src={origin.image} alt={origin.name} loading="lazy" />
                <div className="sibu-origin__shade" />
                <figcaption>
                  <span>0{index + 1}</span>
                  <strong>{origin.name}</strong>
                  <small>{origin.label}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sibu-journey" id="journey">
        <div className="sibu-shell">
          <div className="sibu-section-heading">
            <p className="sibu-kicker">COFFEE JOURNEY</p>
            <h2>From harvest to shipment.</h2>
            <p>
              One clear journey from origin to export preparation, kept simple enough to understand
              at a glance.
            </p>
          </div>

          <div className="sibu-journey__track" role="list">
            {journey.map(([number, title, description]) => (
              <article className="sibu-journey__step" role="listitem" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sibu-export" aria-label="Sibu export statement">
        <img
          src={`${mediaBase}service-wholesale-export.webp`}
          alt="Green coffee prepared for export"
          loading="lazy"
        />
        <div className="sibu-export__overlay" />
        <div className="sibu-shell sibu-export__content">
          <p className="sibu-kicker">ETHIOPIA → THE WORLD</p>
          <h2>From Guji<br />to your roastery.</h2>
          <p>Ethiopian green coffee prepared for international buyers.</p>
          <a className="sibu-button" href="#contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="sibu-contact" id="contact">
        <div className="sibu-shell sibu-contact__grid">
          <div>
            <p className="sibu-kicker">CONTACT</p>
            <h2>Let&apos;s talk coffee.</h2>
          </div>
          <div className="sibu-contact__actions">
            <p>
              Tell us the origin, process, grade, quantity, and destination you are looking for.
              Official contact details can be connected here once confirmed.
            </p>
            <div className="sibu-contact__links">
              <a
                className="sibu-button sibu-button--dark"
                href="https://yohannesmulugeta.github.io/Sibu-trading/contact/"
                target="_blank"
                rel="noreferrer"
              >
                Request coffee <span aria-hidden="true">↗</span>
              </a>
              <a className="sibu-text-link" href="#story">
                Back to the story <span aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
