import { gsap, ScrollTrigger } from "./gsap.ts";
import { lenis } from "./lenis.ts";

// Easing presets
export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.76, 0, 0.24, 1)";
export const EASE_SOFT = "cubic-bezier(0.23, 1, 0.32, 1)";

// Synchronize Lenis and ScrollTrigger once
if (typeof window !== "undefined") {
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  if (document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}

export const Reveal = {
  Image(frame: HTMLElement | string, options?: { noScale?: boolean; trigger?: string }) {
    if (typeof window === "undefined") return;
    const el = typeof frame === "string" ? document.querySelector<HTMLElement>(frame) : frame;
    if (!el) return;

    const innerImg = el.querySelector("img, video") as HTMLElement | null;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: options?.trigger || "top 92%",
        once: true,
      },
    });

    tl.fromTo(
      el,
      { clipPath: "inset(0 0 100% 0)", opacity: 0.8 },
      {
        clipPath: "inset(0 0 0% 0)",
        opacity: 1,
        duration: 1.0,
        ease: EASE_IN_OUT,
      }
    );

    if (innerImg && !options?.noScale) {
      tl.fromTo(
        innerImg,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.2,
          ease: EASE_SOFT,
        },
        0
      );
    }
  },

  Fade(
    target: HTMLElement | HTMLElement[] | string,
    options?: { y?: number; d?: number; stagger?: number; trigger?: HTMLElement | string }
  ) {
    if (typeof window === "undefined") return;
    const items =
      typeof target === "string"
        ? Array.from(document.querySelectorAll<HTMLElement>(target))
        : Array.isArray(target)
        ? target
        : [target];

    if (items.length === 0) return;

    const y = options?.y ?? 20;
    const duration = options?.d ?? 0.7;
    const stagger = options?.stagger ?? 0.08;
    const trigger = options?.trigger || items[0];

    gsap.fromTo(
      items,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: trigger as HTMLElement,
          start: "top 92%",
          once: true,
        },
      }
    );
  },

  Line(line: HTMLElement | string) {
    if (typeof window === "undefined") return;
    const el = typeof line === "string" ? document.querySelector<HTMLElement>(line) : line;
    if (!el) return;

    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 0.8,
        ease: EASE_SOFT,
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
      }
    );
  },

  Split(el: HTMLElement | string) {
    if (typeof window === "undefined") return;
    const target = typeof el === "string" ? document.querySelector<HTMLElement>(el) : el;
    if (!target) return;

    // Smooth subtle fade-up
    gsap.fromTo(
      target,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: target,
          start: "top 92%",
          once: true,
        },
      }
    );
  },

  Count(el: HTMLElement, targetVal: number, suffix: string = "+", format: boolean = false) {
    if (typeof window === "undefined") return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetVal,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        const num = Math.round(obj.val);
        el.textContent = (format ? num.toLocaleString() : num.toString()) + suffix;
      },
    });
  },

  CountUp(el: HTMLElement, targetVal: number, suffix: string = "+", format: boolean = false) {
    Reveal.Count(el, targetVal, suffix, format);
  },

  Parallax(target: HTMLElement | string, options?: { range?: number }) {
    if (typeof window === "undefined") return;
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    const range = options?.range ?? 5;

    gsap.fromTo(
      el,
      { yPercent: -range },
      {
        yPercent: range,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  },

  Clip(el: HTMLElement | string, options?: { from?: "left" | "right" | "top" | "bottom" }) {
    if (typeof window === "undefined") return;
    const target = typeof el === "string" ? document.querySelector<HTMLElement>(el) : el;
    if (!target) return;

    const from = options?.from || "left";
    let initialClip = "inset(0 100% 0 0)";
    if (from === "right") initialClip = "inset(0 0 0 100%)";
    else if (from === "top") initialClip = "inset(100% 0 0 0)";
    else if (from === "bottom") initialClip = "inset(0 0 100% 0)";

    gsap.fromTo(
      target,
      { clipPath: initialClip },
      {
        clipPath: "inset(0 0 0 0)",
        duration: 1.0,
        ease: EASE_IN_OUT,
        scrollTrigger: {
          trigger: target,
          start: "top 92%",
          once: true,
        },
      }
    );
  },
};

export function initMotion(root: HTMLElement = document.body): () => void {
  if (typeof window === "undefined") return () => {};

  const ctx = gsap.context(() => {
    // 1. Split headings / titles
    const splitEls = root.querySelectorAll<HTMLElement>("[data-split]");
    splitEls.forEach((el) => {
      Reveal.Split(el);
    });

    // 2. Fade ups
    const fadeUps = root.querySelectorAll<HTMLElement>("[data-fade-up]");
    if (fadeUps.length > 0) {
      Reveal.Fade(Array.from(fadeUps));
    }

    // 3. Lines
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    lines.forEach((l) => Reveal.Line(l));

    // 4. Image reveals
    const imgReveals = root.querySelectorAll<HTMLElement>("[data-img-reveal]");
    imgReveals.forEach((img) => Reveal.Image(img));

    // 5. Reveal groups with stagger
    const revealGroups = root.querySelectorAll<HTMLElement>("[data-reveal-group]");
    revealGroups.forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (items.length > 0) {
        Reveal.Fade(items, { stagger: 0.08 });
      }
    });

    // 6. Standalone reveals
    const standaloneReveals = root.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-reveal-group] [data-reveal])"
    );
    standaloneReveals.forEach((el) => {
      Reveal.Fade(el);
    });

    // 7. Number counters
    const countEls = root.querySelectorAll<HTMLElement>("[data-count]");
    countEls.forEach((c) => {
      const val = parseInt(c.getAttribute("data-count") || "0", 10);
      const suffix = c.getAttribute("data-suffix") || "+";
      if (val > 0) {
        Reveal.Count(c, val, suffix);
      }
    });

    // 8. Parallax elements
    const parallaxes = root.querySelectorAll<HTMLElement>("[data-parallax]");
    parallaxes.forEach((p) => {
      Reveal.Parallax(p);
    });

    // 9. Intersection Observer fallback for guaranteed visibility
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.add("is-visible");
              observer.unobserve(el);
            }
          });
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0.1 }
      );

      root.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    }

    // Refresh ScrollTrigger calculations after paint
    ScrollTrigger.refresh();
  }, root);

  return () => ctx.revert();
}
