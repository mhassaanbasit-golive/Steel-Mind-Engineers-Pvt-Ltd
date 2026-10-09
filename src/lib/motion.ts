import { gsap, ScrollTrigger } from "./gsap.ts";

export function initMotion(root: HTMLElement = document.body): () => void {
  if (typeof window === "undefined") return () => {};

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.documentElement.classList.remove("js-ready");
    return () => {};
  }

  document.documentElement.classList.add("js-ready");

  const ctx = gsap.context(() => {
    // 1. data-split (DOM line wrapping)
    const splitEls = root.querySelectorAll<HTMLElement>("[data-split]");
    splitEls.forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "true";

      const originalText = el.textContent || "";
      const words = originalText.split(/\s+/).filter(Boolean);
      el.innerHTML = "";
      el.style.visibility = "visible";

      // Group words into lines inside overflow-hidden wrappers
      const lineSpan = document.createElement("span");
      lineSpan.className = "split-line-wrap inline-block overflow-hidden align-top";
      const innerSpan = document.createElement("span");
      innerSpan.className = "split-line-inner inline-block";
      innerSpan.textContent = words.join(" ");
      lineSpan.appendChild(innerSpan);
      el.appendChild(lineSpan);

      gsap.fromTo(
        innerSpan,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // 2. data-reveal-group
    const groups = root.querySelectorAll<HTMLElement>("[data-reveal-group]");
    groups.forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: group,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    });

    // 3. standalone data-reveal
    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-group] [data-reveal])");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    // 4. data-fade-up
    const fadeUps = root.querySelectorAll<HTMLElement>("[data-fade-up]");
    fadeUps.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    // 5. data-img-reveal
    const imgReveals = root.querySelectorAll<HTMLElement>("[data-img-reveal]");
    imgReveals.forEach((el) => {
      const innerImg = el.querySelector("img, video") as HTMLElement | null;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      tl.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.out" }
      );

      if (innerImg) {
        tl.fromTo(
          innerImg,
          { scale: 1.15 },
          { scale: 1, duration: 1.6, ease: "expo.out" },
          0
        );
      }
    });

    // 6. data-parallax
    const parallaxes = root.querySelectorAll<HTMLElement>("[data-parallax]");
    parallaxes.forEach((el) => {
      const amount = parseFloat(el.getAttribute("data-parallax") || "8");
      const target = (el.querySelector("img") as HTMLElement) || el;
      gsap.fromTo(
        target,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });

    // 7. data-count
    const counters = root.querySelectorAll<HTMLElement>("[data-count]");
    counters.forEach((el) => {
      const targetVal = parseFloat(el.getAttribute("data-to") || el.textContent || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const format = el.getAttribute("data-format") === "true";

      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          const num = Math.round(obj.val);
          el.textContent = (format ? num.toLocaleString() : num.toString()) + suffix;
        },
      });
    });

    // 8. data-line
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    lines.forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            once: true,
          },
        }
      );
    });

    // 9. data-steps
    const stepLines = root.querySelectorAll<HTMLElement>("[data-steps]");
    stepLines.forEach((stepLine) => {
      gsap.fromTo(
        stepLine,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stepLine,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    });

    // 10. data-stagger-children
    const staggers = root.querySelectorAll<HTMLElement>("[data-stagger-children]");
    staggers.forEach((parent) => {
      const children = Array.from(parent.children) as HTMLElement[];
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: parent,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    });
  }, root);

  return () => ctx.revert();
}
