import { siteConfig } from "../data/story";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="wordmark" href="#story" aria-label="Sibu Trading PLC — back to the story">
            <span className="wordmark-mark" aria-hidden="true" />
            SIBU TRADING PLC
          </a>
          <p>Rooted in Ethiopia.<br />Carried through generations.</p>
        </div>

        <nav aria-label="Footer navigation">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="footer-social" aria-label="Company information">
          <span>Guji, Ethiopia</span>
          <span>Premium Ethiopian green coffee</span>
          <a
            href="https://yohannesmulugeta.github.io/Sibu-trading/contact/"
            target="_blank"
            rel="noreferrer"
          >
            Start a conversation ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sibu Trading PLC. All rights reserved.</p>
        <p>Ethiopian green coffee · Guji</p>
      </div>
    </footer>
  );
}
