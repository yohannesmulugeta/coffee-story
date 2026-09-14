import { useEffect, useState } from "react";
import { siteConfig } from "../data/story";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <a className="wordmark" href="#story" aria-label="Coffee Legacy — back to the beginning">
        <span className="wordmark-mark" aria-hidden="true" />
        {siteConfig.name.toUpperCase()}
      </a>
      <nav aria-label="Primary navigation">
        <ul className="header-nav">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
