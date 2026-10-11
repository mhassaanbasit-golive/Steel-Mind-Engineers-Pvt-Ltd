import { gsap, ScrollTrigger } from "./gsap.ts";
import { lenis } from "./lenis.ts";

// Ensure Lenis and ScrollTrigger are connected
if (typeof window !== "undefined") {
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Refresh ScrollTrigger after fonts and images load
  if (document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}

const EASE_PREMIUM = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_CLIP = "cubic-bezier(0.76, 0, 0.24, 1)";

export const Reveal = {
  Lines(target: HTMLElement | string, options?: { stagger?: number; duration?: number }) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    if (prefersReduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    const text = el.textContent || "";
    el.innerHTML = "";
    const wrap = document.createElement("span");
    wrap.className = "inline-block overflow-hidden align-top";
    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.textContent = text;
    wrap.appendChild(inner);
    el.appendChild(wrap);

    gsap.fromTo(
      inner,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: options?.duration ?? 0.8,
        ease: EASE_PREMIUM,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  },

  Fade(target: HTMLElement | HTMLElement[] | string, options?: { stagger?: number; duration?: number }) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = typeof target === "string" ? Array.from(document.querySelectorAll<HTMLElement>(target)) : Array.isArray(target) ? target : [target];
    if (items.length === 0) return;

    if (prefersReduced) {
      gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.7,
        stagger: options?.stagger ?? 0.08,
        ease: EASE_PREMIUM,
        scrollTrigger: {
          trigger: items[0],
          start: "top 88%",
          once: true,
        },
      }
    );
  },

  Image(frame: HTMLElement | string, options?: { noScale?: boolean }) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = typeof frame === "string" ? document.querySelector<HTMLElement>(frame) : frame;
    if (!el) return;

    if (prefersReduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    const innerImg = el.querySelector("img, video") as HTMLElement | null;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    tl.fromTo(
      el,
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.1,
        ease: EASE_CLIP,
      }
    );

    if (innerImg && !options?.noScale) {
      tl.fromTo(
        innerImg,
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.4,
          ease: EASE_PREMIUM,
        },
        0
      );
    }
  },

  Line(line: HTMLElement | string) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = typeof line === "string" ? document.querySelector<HTMLElement>(line) : line;
    if (!el) return;

    if (prefersReduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 0.9,
        ease: EASE_PREMIUM,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  },

  CountUp(el: HTMLElement, targetVal: number, suffix: string = "+", format: boolean = false) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = (format ? targetVal.toLocaleString() : targetVal.toString()) + suffix;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetVal,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
      onUpdate: () => {
        const num = Math.round(obj.val);
        el.textContent = (format ? num.toLocaleString() : num.toString()) + suffix;
      },
    });
  },

  Parallax(target: HTMLElement | string) {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    // Run on desktop & mobile with image inside overflow: hidden box
    gsap.fromTo(
      el,
      { yPercent: -6 },
      {
        yPercent: 6,
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
};

export function initMotion(root: HTMLElement = document.body): () => void {
  if (typeof window === "undefined") return () => {};

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    // 1. data-split
    const splitEls = root.querySelectorAll<HTMLElement>("[data-split]");
    splitEls.forEach((el) => {
      Reveal.Lines(el);
    });

    // 2. data-fade-up
    const fadeUps = root.querySelectorAll<HTMLElement>("[data-fade-up]");
    if (fadeUps.length > 0) {
      Reveal.Fade(Array.from(fadeUps));
    }

    // 3. data-line
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    lines.forEach((l) => Reveal.Line(l));

    // 4. data-img-reveal
    const imgReveals = root.querySelectorAll<HTMLElement>("[data-img-reveal]");
    imgReveals.forEach((img) => Reveal.Image(img));

    // 5. data-reveal-group
    const revealGroups = root.querySelectorAll<HTMLElement>("[data-reveal-group]");
    revealGroups.forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (items.length > 0) {
        Reveal.Fade(items, { stagger: 0.08 });
      }
    });

    // 6. standalone data-reveal (not inside data-reveal-group)
    const standaloneReveals = root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-group] [data-reveal])");
    standaloneReveals.forEach((el) => {
      Reveal.Fade(el);
    });

    // 7. data-stagger-children
    const staggerParents = root.querySelectorAll<HTMLElement>("[data-stagger-children]");
    staggerParents.forEach((parent) => {
      const children = Array.from(parent.children) as HTMLElement[];
      if (children.length > 0) {
        Reveal.Fade(children, { stagger: 0.08 });
      }
    });

    // 8. data-count
    const countEls = root.querySelectorAll<HTMLElement>("[data-count]");
    countEls.forEach((c) => {
      const val = parseInt(c.getAttribute("data-count") || "0", 10);
      const suffix = c.getAttribute("data-suffix") || "+";
      if (val > 0) {
        Reveal.CountUp(c, val, suffix);
      }
    });

    // 9. data-parallax
    const parallaxes = root.querySelectorAll<HTMLElement>("[data-parallax]");
    parallaxes.forEach((p) => {
      Reveal.Parallax(p);
    });
  }, root);

  return () => ctx.revert();
}
