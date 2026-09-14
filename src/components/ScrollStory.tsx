import { useRef } from "react";
import { generations } from "../data/story";
import { useScrollVideo } from "../hooks/useScrollVideo";
import { StoryChapter } from "./StoryChapter";
import { StoryIntro } from "./StoryIntro";

export function ScrollStory() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const status = useScrollVideo({ containerRef, videoRef });

  return (
    <section id="story" className="story-scroll" ref={containerRef} aria-label="Three generations of coffee heritage">
      <div className="story-viewport">
        <div className={`video-shell ${status === "error" ? "video-shell--fallback" : ""}`}>
          <video
            ref={videoRef}
            className="hero-video"
            src={`${import.meta.env.BASE_URL}video/coffee-legacy.mp4`}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="cinematic-overlay" />
          <div className="side-vignette" />
        </div>

        {status === "loading" && (
          <div className="video-state" role="status" aria-live="polite">
            <span>COFFEE LEGACY</span>
            <i />
            <small>Preparing the journey</small>
          </div>
        )}
        {status === "error" && (
          <div className="video-state video-state--error" role="status">
            <span>COFFEE LEGACY</span>
            <small>The visual story is unavailable. The legacy continues below.</small>
          </div>
        )}

        <div className="story-copy-layer">
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
