import { siteConfig } from "../data/story";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="wordmark" href="#story">
            <span className="wordmark-mark" aria-hidden="true" />
            {siteConfig.name.toUpperCase()}
          </a>
          <p>Rooted in Ethiopia.<br />Carried through generations.</p>
        </div>

        <nav aria-label="Footer navigation">
          {siteConfig.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>

        <div className="footer-social" aria-label="Social links coming soon">
          {siteConfig.footerLinks.map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Coffee Legacy. All rights reserved.</p>
        <p>Made with respect for the journey.</p>
      </div>
    </footer>
  );
}
