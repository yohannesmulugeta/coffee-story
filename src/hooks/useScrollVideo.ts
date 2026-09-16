import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type VideoStatus = "loading" | "ready" | "error";
type ScrollVideoOptions = {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
};

const visibilityAt = (progress: number, start: number, end: number) => {
  if (progress < start || progress > end) return 0;
  const value = Math.min(start === 0 ? 1 : (progress - start) / 0.035,
    end === 1 ? 1 : (end - progress) / 0.035, 1);
  return value * value * (3 - 2 * value);
};

export function useScrollVideo({ containerRef, videoRef }: ScrollVideoOptions) {
  const [status, setStatus] = useState<VideoStatus>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    if (reducedMotion) {
      setStatus("ready");
      return;
    }
    const download = new AbortController();
    let mediaUrl: string | undefined;
    let frameId = 0;
    let tween: gsap.core.Tween | undefined;
    let disposed = false;
    let unlocked = false;
    let unlocking = false;
    const playhead = { progress: 0 };
    const copies = Array.from(container.querySelectorAll<HTMLElement>("[data-story-copy]")).map(
      (element) => ({
        element, start: Number(element.dataset.start), end: Number(element.dataset.end),
        opacity: gsap.quickSetter(element, "opacity"), y: gsap.quickSetter(element, "y", "px"),
      }),
    );
    const markers = container.querySelectorAll<HTMLElement>("[data-progress-item]");
    const renderCopy = (progress: number) => {
      copies.forEach(({ element, start, end, opacity, y }) => {
        const visibility = visibilityAt(progress, start, end);
        opacity(visibility);
        y((1 - visibility) * 14);
        element.style.visibility = visibility > 0 ? "visible" : "hidden";
        element.setAttribute("aria-hidden", String(visibility === 0));
      });
      const active = progress < 0.35 ? 0 : progress < 0.69 ? 1 : 2;
      container.dataset.chapter = String(active);
      markers.forEach((element, index) => { element.dataset.active = String(index === active); });
      container.style.setProperty("--story-progress", `${progress * 100}%`);
    };

    // Allow each seek to decode and paint. Coalesce inputs to the latest target,
    // never interrupt an in-flight seek, and never keep an idle rAF loop alive.
    const requestSeek = () => {
      if (disposed || frameId || reducedMotion || !unlocked || video.error) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        if (video.seeking || video.readyState < 2) return;
        const lastFrame = Math.max(0, video.duration - 1 / 30);
        const target = Math.min(lastFrame, playhead.progress * video.duration);
        if (Math.abs(video.currentTime - target) >= 1 / 60) video.currentTime = target;
      });
    };
    const handleSeeked = () => {
      if (reducedMotion || disposed) return;
      // Copy follows decoded video rather than running ahead of the picture.
      renderCopy(video.currentTime / video.duration);
      requestSeek();
    };
    const startScrub = () => {
      if (tween) return;
      renderCopy(0);
      tween = gsap.to(playhead, {
        progress: 1, ease: "none",
        onUpdate: () => {
          if (!unlocked) renderCopy(playhead.progress);
          requestSeek();
        },
        scrollTrigger: {
          trigger: container, start: "top top", end: "bottom bottom",
          scrub: 0.45, invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
      requestSeek();
    };
    const prepare = () => {
      if (video.readyState < 2 || !Number.isFinite(video.duration) || video.duration <= 0) return;
      if (!unlocked) {
        unlock();
        return;
      }
      clearTimeout(loadingTimeout);
      setStatus("ready");
      startScrub();
      requestSeek();
    };
    // Some browsers decode seeks but keep painting the poster until playback
    // has been initialized. Prime once, pause immediately, then use scroll only.
    // Retry on user input if the browser requires a gesture.
    const unlock = () => {
      if (disposed || reducedMotion || unlocked || unlocking || video.readyState < 2) return;
      unlocking = true;
      video.muted = true;
      void video.play().then(() => {
        video.pause();
        if (disposed) return;
        unlocked = true;
        unlocking = false;
        prepare();
      }).catch(() => { unlocking = false; });
    };
    const fail = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = undefined;
      cancelAnimationFrame(frameId);
      frameId = 0;
      copies.forEach(({ element }) => {
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
        element.removeAttribute("aria-hidden");
      });
      setStatus("error");
    };
    setStatus("loading");
    setLoadProgress(0);
    const loadingTimeout = window.setTimeout(() => {
      if (!unlocked) {
        download.abort();
        fail();
      }
    }, 120000);
    video.addEventListener("loadeddata", prepare);
    video.addEventListener("canplay", prepare);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", fail);
    const gestures = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    gestures.forEach((event) => window.addEventListener(event, unlock, { passive: true }));
    startScrub();
    // Scrubbing a partially downloaded remote MP4 can leave a browser seek
    // pending indefinitely. Download the small clip once, then seek local bytes.
    void (async () => {
      try {
        const response = await fetch(video.dataset.src!, { signal: download.signal });
        if (!response.ok) throw new Error("Video download failed");
        const total = Number(response.headers.get("content-length"));
        const reader = response.body?.getReader();
        let blob: Blob;
        if (reader) {
          const parts: Uint8Array<ArrayBuffer>[] = [];
          let received = 0;
          let lastPercent = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            parts.push(new Uint8Array(value));
            received += value.byteLength;
            const percent = total > 0 ? Math.min(99, Math.floor(received / total * 100)) : 0;
            if (!disposed && percent !== lastPercent) {
              lastPercent = percent;
              setLoadProgress(percent);
            }
          }
          blob = new Blob(parts, { type: "video/mp4" });
        } else {
          blob = await response.blob();
        }
        if (disposed || download.signal.aborted) return;
        mediaUrl = URL.createObjectURL(blob);
        video.src = mediaUrl;
        video.load();
      } catch {
        if (!disposed) fail();
      }
    })();
    return () => {
      disposed = true;
      clearTimeout(loadingTimeout);
      download.abort();
      cancelAnimationFrame(frameId);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      video.removeEventListener("loadeddata", prepare);
      video.removeEventListener("canplay", prepare);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", fail);
      gestures.forEach((event) => window.removeEventListener(event, unlock));
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      copies.forEach(({ element }) => {
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
        element.removeAttribute("aria-hidden");
      });
    };
  }, [containerRef, videoRef, reducedMotion]);
  return { status, reducedMotion, loadProgress };
}
