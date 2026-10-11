import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.ts";

export let lenis: Lenis | null = null;

if (typeof window !== "undefined") {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 0.7,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
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
    lenis.scrollTo(0, { immediate: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
}
