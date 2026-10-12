import { gsap, ScrollTrigger } from "./gsap.ts";

export const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_SMOOTH = "cubic-bezier(0.23, 1, 0.32, 1)";
export const EASE_IN_OUT_SOFT = "cubic-bezier(0.65, 0, 0.35, 1)";

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Splits text inside an element into lines or characters without third-party libraries.
 * For lines, groups words by measuring their visual line breaks, wrapped in an overflow-hidden mask.
 */
export function splitLines(element: HTMLElement): { lines: HTMLElement[]; revert: () => void } {
  const originalHTML = element.innerHTML;
  const originalText = element.textContent || "";
  
  // Split words first to measure natural lines
  const words = originalText.trim().split(/\s+/);
  element.innerHTML = "";
  
  const wordSpans: HTMLElement[] = words.map((w, idx) => {
    const s = document.createElement("span");
    s.style.display = "inline-block";
    s.textContent = w + (idx < words.length - 1 ? " " : "");
    element.appendChild(s);
    return s;
  });
  
  // Group spans by top offset
  const linesMap: HTMLElement[][] = [];
  let currentTop = -999999;
  let currentLine: HTMLElement[] = [];
  
  wordSpans.forEach((span) => {
    const top = Math.round(span.offsetTop);
    if (Math.abs(top - currentTop) > 6) {
      if (currentLine.length > 0) {
        linesMap.push(currentLine);
      }
      currentLine = [span];
      currentTop = top;
    } else {
      currentLine.push(span);
    }
  });
  if (currentLine.length > 0) {
    linesMap.push(currentLine);
  }
  
  element.innerHTML = "";
  const createdLines: HTMLElement[] = [];
  
  linesMap.forEach((lineSpans) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    mask.style.display = "block";
    mask.style.overflow = "hidden";
    mask.style.lineHeight = "inherit";
    
    const inner = document.createElement("span");
    inner.className = "line-inner";
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = lineSpans.map((s) => s.textContent).join("");
    
    mask.appendChild(inner);
    element.appendChild(mask);
    createdLines.push(inner);
  });
  
  return {
    lines: createdLines,
    revert: () => {
      element.innerHTML = originalHTML;
    },
  };
}
