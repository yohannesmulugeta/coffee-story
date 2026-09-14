import { intro } from "../data/story";

export function StoryIntro() {
  return (
    <article
      className="story-copy story-copy--intro"
      data-story-copy
      data-start={intro.range[0]}
      data-end={intro.range[1]}
    >
      <p className="eyebrow">{intro.eyebrow}</p>
      <h1>{intro.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
      <p className="story-description story-description--intro">{intro.description}</p>
      <div className="scroll-cue" aria-hidden="true">
        <span>SCROLL TO FOLLOW THE JOURNEY</span>
        <i />
      </div>
    </article>
  );
}
