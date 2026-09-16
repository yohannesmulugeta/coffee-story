import { useRef } from "react";
import { generations } from "../data/story";
import { useScrollVideo } from "../hooks/useScrollVideo";
import { StoryChapter } from "./StoryChapter";
import { StoryIntro } from "./StoryIntro";

export function ScrollStory() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status, reducedMotion } = useScrollVideo({ containerRef, videoRef });
  const staticStory = status === "error" || reducedMotion;

  return (
    <section id="story" className={`story-scroll${staticStory ? " story-scroll--static" : ""}`} ref={containerRef} aria-label="Three generations of coffee heritage">
      <div className="story-viewport">
        <div className={`video-shell ${status === "error" ? "video-shell--fallback" : ""}`}>
          <img className="hero-poster" src={`${import.meta.env.BASE_URL}video/coffee-poster.jpg`} alt="" aria-hidden="true" />
          <video
            ref={videoRef}
            className="hero-video"
            data-src={`${import.meta.env.BASE_URL}video/coffee-scrub-v3.mp4`}
            poster={`${import.meta.env.BASE_URL}video/coffee-poster.jpg`}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="cinematic-overlay" />
          <div className="side-vignette" />
        </div>

        {status === "loading" && !reducedMotion && (
          <div className="video-state" role="status" aria-live="polite">
            <span>COFFEE LEGACY</span>
            <i />
            <small>Preparing the journey</small>
          </div>
        )}

        <div className="story-copy-layer">
          {status === "error" && <p className="video-notice" role="status">Video unavailable. Read the story below.</p>}
          <StoryIntro />
          {generations.map((chapter) => (
            <StoryChapter key={chapter.number} chapter={chapter} />
          ))}
        </div>

        <aside className="story-progress" aria-hidden="true">
          <span className="story-progress__track"><i /></span>
          <ol>
            {generations.map((chapter) => (
              <li key={chapter.number} data-progress-item data-active={chapter.number === "01"}>
                {chapter.number}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
