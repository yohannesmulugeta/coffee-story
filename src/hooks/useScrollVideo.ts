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
    let frameId = 0;
    let tween: gsap.core.Tween | undefined;
    let disposed = false;
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
      markers.forEach((element, index) => { element.dataset.active = String(index === active); });
      container.style.setProperty("--story-progress", `${progress * 100}%`);
    };

    // Allow each seek to decode and paint. Coalesce inputs to the latest target,
    // never interrupt an in-flight seek, and never keep an idle rAF loop alive.
    const requestSeek = () => {
      if (disposed || frameId || reducedMotion || video.error) return;
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
    const prepare = () => {
      if (video.readyState < 2 || !Number.isFinite(video.duration) || video.duration <= 0) return;
      clearTimeout(loadingTimeout);
      setStatus("ready");
      if (reducedMotion || tween) return;
      renderCopy(0);
      tween = gsap.to(playhead, {
        progress: 1, ease: "none", onUpdate: requestSeek,
        scrollTrigger: {
          trigger: container, start: "top top", end: "bottom bottom",
          scrub: 0.45, invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
      requestSeek();
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
    const loadingTimeout = window.setTimeout(() => {
      if (video.readyState < 2) fail();
    }, 15000);
    video.addEventListener("loadeddata", prepare);
    video.addEventListener("canplay", prepare);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", fail);
    if (video.error) fail();
    else prepare();
    return () => {
      disposed = true;
      clearTimeout(loadingTimeout);
      cancelAnimationFrame(frameId);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      video.removeEventListener("loadeddata", prepare);
      video.removeEventListener("canplay", prepare);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", fail);
      copies.forEach(({ element }) => {
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
        element.removeAttribute("aria-hidden");
      });
    };
  }, [containerRef, videoRef, reducedMotion]);
  return { status, reducedMotion };
}
