export const TEMPLATE_BY_PAGE: Record<number, string> = {
  1: "T0",
  9: "T1",
  21: "T1",
  27: "T1",
  33: "T1",
  39: "T1",
  45: "T1",
  53: "T1",
  8: "T2s",
  13: "T2s",
  15: "T3",
  18: "T3",
  56: "T5",
  59: "T5",
  61: "T5",
  62: "T5",
  63: "T5",
  64: "T5",
  65: "T6",
  66: "T9",
  67: "T7",
  68: "T8",
  // every other published page 2-52 is "T2"
};

export function getTemplateForPage(pageNumber: number): string {
  return TEMPLATE_BY_PAGE[pageNumber] || "T2";
}
