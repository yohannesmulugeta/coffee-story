import type { StoryChapter as StoryChapterType } from "../data/story";

type StoryChapterProps = {
  chapter: StoryChapterType;
};

export function StoryChapter({ chapter }: StoryChapterProps) {
  return (
    <article
      className={`story-copy story-copy--chapter story-copy--${chapter.position}`}
      data-story-copy
      data-start={chapter.range[0]}
      data-end={chapter.range[1]}
      style={{ opacity: 0 }}
    >
      <p className="chapter-label">
        <span>{chapter.number}</span>
        <i aria-hidden="true" />
        {chapter.eyebrow}
      </p>
      <h2>{chapter.title}</h2>
      <p className="story-description">{chapter.description}</p>
      {chapter.number === "03" && (
        <p className="chapter-coda">ROOTED IN ETHIOPIA. LOOKING FORWARD.</p>
      )}
    </article>
  );
}
