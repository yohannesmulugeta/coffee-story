import { siteConfig } from "../data/story";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="wordmark" href="#story">
            <span className="wordmark-mark" aria-hidden="true" />
            {siteConfig.name.toUpperCase()}
          </a>
          <p>Rooted in Ethiopia.<br />Carried through generations.</p>
        </div>

        <nav aria-label="Footer navigation">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="footer-social" aria-label="Company location">
          <span>Sibu Trading PLC</span>
          <span>Guji, Ethiopia</span>
          <a href="#contact">Start a conversation</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sibu Trading PLC. All rights reserved.</p>
        <p>Ethiopian green coffee · Guji</p>
      </div>
    </footer>
  );
}
