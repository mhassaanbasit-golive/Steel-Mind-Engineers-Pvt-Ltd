import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.ts";

export let lenis: Lenis | null = null;

if (typeof window !== "undefined") {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    lenis = new Lenis({
      lerp: 0.085,            // soft, Framer-like
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,       // native touch scroll on mobile
      touchMultiplier: 1.2,
      autoRaf: false,
    });

    ScrollTrigger.config({ ignoreMobileResize: true });

    gsap.ticker.add((time: number) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(500, 33);
    lenis.on("scroll", ScrollTrigger.update);
  }
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
}

export function scrollToElement(el: HTMLElement | string, offset = -32) {
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else if (typeof window !== "undefined") {
    const target = typeof el === "string" ? document.querySelector(el) : el;
    target?.scrollIntoView({ behavior: "smooth" });
  }
}
