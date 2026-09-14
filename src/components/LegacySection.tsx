import { legacyCopy } from "../data/story";

export function LegacySection() {
  return (
    <section id="legacy" className="legacy-section">
      <div className="legacy-inner">
        <div className="legacy-heading">
          <p className="eyebrow eyebrow--dark">{legacyCopy.eyebrow}</p>
          <h2>{legacyCopy.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        </div>
        <div className="legacy-copy">
          {legacyCopy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>

      <ol className="generation-strip" aria-label="Three generations">
        {legacyCopy.generations.map((generation, index) => (
          <li key={generation.name}>
            <span className="generation-number">0{index + 1}</span>
            <strong>{generation.name}</strong>
            <small>{generation.value}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
