import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type VideoStatus = "loading" | "ready" | "error";

type ScrollVideoOptions = {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
};

const getVisibility = (progress: number, start: number, end: number) => {
  const fadeWindow = 0.055;
  if (progress < start || progress > end) return 0;

  const fadeIn = start === 0 ? 1 : Math.min(1, (progress - start) / fadeWindow);
  const fadeOut = end === 1 ? 1 : Math.min(1, (end - progress) / fadeWindow);
  const visibility = Math.max(0, Math.min(fadeIn, fadeOut));
  return visibility * visibility * (3 - 2 * visibility);
};

export function useScrollVideo({ containerRef, videoRef }: ScrollVideoOptions) {
  const [status, setStatus] = useState<VideoStatus>("loading");

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let targetTime = 0;
    let seekPending = false;
    let scrubTween: gsap.core.Tween | undefined;
    let metadataHandler: (() => void) | undefined;

    const requestSeek = () => {
      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        frameId = 0;
        if (video.seeking) {
          seekPending = true;
          return;
        }

        if (Math.abs(video.currentTime - targetTime) > 0.025) {
          seekPending = false;
          video.currentTime = targetTime;
        }
      });
    };

    const handleSeeked = () => {
      if (seekPending || Math.abs(video.currentTime - targetTime) > 0.05) {
        seekPending = false;
        requestSeek();
      }
    };

    const setCopyProgress = (progress: number) => {
      container.querySelectorAll<HTMLElement>("[data-story-copy]").forEach((element) => {
        const start = Number(element.dataset.start ?? 0);
        const end = Number(element.dataset.end ?? 1);
        const visibility = getVisibility(progress, start, end);
        gsap.set(element, {
          autoAlpha: visibility,
          y: (1 - visibility) * 24,
        });
      });

      const activeIndex = progress < 0.35 ? 0 : progress < 0.69 ? 1 : 2;
      container.querySelectorAll<HTMLElement>("[data-progress-item]").forEach((element, index) => {
        element.dataset.active = String(index === activeIndex);
      });
      container.style.setProperty("--story-progress", `${progress * 100}%`);
    };

    const prepareVideo = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        setStatus("error");
        return;
      }

      setStatus("ready");

      if (reducedMotion.matches) {
        video.currentTime = Math.min(0.05, video.duration);
        return;
      }

      setCopyProgress(0);
      const playhead = { time: 0 };
      scrubTween = gsap.to(playhead, {
        time: video.duration,
        ease: "none",
        onUpdate: () => {
          targetTime = playhead.time;
          setCopyProgress(playhead.time / video.duration);
          requestSeek();
        },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
    };

    const handleError = () => setStatus("error");
    video.addEventListener("error", handleError);
    video.addEventListener("seeked", handleSeeked);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      prepareVideo();
    } else {
      metadataHandler = prepareVideo;
      video.addEventListener("loadedmetadata", metadataHandler, { once: true });
    }

    return () => {
      cancelAnimationFrame(frameId);
      scrubTween?.scrollTrigger?.kill();
      scrubTween?.kill();
      video.removeEventListener("error", handleError);
      video.removeEventListener("seeked", handleSeeked);
      if (metadataHandler) video.removeEventListener("loadedmetadata", metadataHandler);
    };
  }, [containerRef, videoRef]);

  return status;
}
