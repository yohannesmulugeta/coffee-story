import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SibuMotion() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const ease = "power3.out";

      gsap.utils.toArray<HTMLElement>("[data-sibu-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease,
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-sibu-heading]").forEach((heading) => {
        const children = Array.from(heading.children);
        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.11,
            ease,
            scrollTrigger: {
              trigger: heading,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-sibu-image-reveal]").forEach((frame) => {
        const image = frame.querySelector("img");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: frame,
            start: "top 84%",
            once: true,
          },
        });

        timeline.fromTo(
          frame,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.15, ease: "power4.inOut" },
        );

        if (image) {
          timeline.fromTo(
            image,
            { scale: 1.08 },
            { scale: 1, duration: 1.35, ease: "power3.out" },
            0,
          );
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-sibu-coffee-item]").forEach((item, index) => {
        const copy = item.querySelector(".sibu-coffee__copy");
        if (!copy) return;

        gsap.fromTo(
          copy,
          { autoAlpha: 0, x: index % 2 === 0 ? 38 : -38 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease,
            scrollTrigger: {
              trigger: item,
              start: "top 76%",
              once: true,
            },
          },
        );
      });

      const originPanels = gsap.utils.toArray<HTMLElement>("[data-sibu-origin-panel]");
      if (originPanels.length) {
        gsap.fromTo(
          originPanels,
          { autoAlpha: 0, y: 44, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.12,
            ease,
            scrollTrigger: {
              trigger: ".sibu-origin__grid",
              start: "top 78%",
              once: true,
            },
          },
        );
      }

      gsap.utils.toArray<HTMLImageElement>("[data-sibu-parallax]").forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: image.parentElement ?? image,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      const journeyLine = document.querySelector<HTMLElement>(".sibu-journey__motion-line");
      const journeyTrack = document.querySelector<HTMLElement>(".sibu-journey__track");
      if (journeyLine && journeyTrack) {
        gsap.fromTo(
          journeyLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.35,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: journeyTrack,
              start: "top 78%",
              once: true,
            },
          },
        );
      }

      const journeySteps = gsap.utils.toArray<HTMLElement>(".sibu-journey__step");
      if (journeySteps.length) {
        gsap.fromTo(
          journeySteps,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.09,
            ease,
            scrollTrigger: {
              trigger: ".sibu-journey__track",
              start: "top 76%",
              once: true,
            },
          },
        );
      }

      const exportSection = document.querySelector<HTMLElement>(".sibu-export");
      const exportImage = exportSection?.querySelector<HTMLImageElement>(":scope > img");
      const exportContent = exportSection?.querySelector<HTMLElement>(".sibu-export__content");

      if (exportSection && exportImage) {
        gsap.fromTo(
          exportImage,
          { scale: 1.1, yPercent: -3 },
          {
            scale: 1.02,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: exportSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          },
        );
      }

      if (exportSection && exportContent) {
        gsap.fromTo(
          Array.from(exportContent.children),
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease,
            scrollTrigger: {
              trigger: exportSection,
              start: "top 64%",
              once: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
