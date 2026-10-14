export type PageTemplate = "T1" | "T2" | "T2s" | "T3";

// T1: Main Division / Service Hubs (P9, P21, P27, P33, P39, P45)
const T1_PAGES = new Set([9, 21, 27, 33, 39, 45]);

// T3: Diagram Gallery pages (P15: Primary Framing, P18: Crane System)
const T3_PAGES = new Set([15, 18]);

// T2s: Step-by-step process pages (P8, P13, P48, P51)
const T2S_PAGES = new Set([8, 13, 48, 51]);

export function getTemplateForPage(pageNumber: number): PageTemplate {
  if (T1_PAGES.has(pageNumber)) {
    return "T1";
  }
  if (T3_PAGES.has(pageNumber)) {
    return "T3";
  }
  if (T2S_PAGES.has(pageNumber)) {
    return "T2s";
  }
  return "T2";
}
