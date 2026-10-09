import { A } from "./assets.ts";

export const POOLS: Record<string, string[]> = {
  aboutUs: [
    A.team,
    A.about,
    A.project.haierCraneMezzanine[0],
    A.project.dravtonDairyShed[0],
    A.service.fabrication,
    A.division.structural,
    A.division.custom,
  ],
  peb: [
    A.division.peb,
    A.project.haierCraneMezzanine[1],
    A.project.haierCraneMezzanine[2],
    A.service.design,
    A.service.detailing,
    A.service.erection,
    A.project.haierCraneMezzanine[0],
  ],
  sheds: [
    A.division.sheds,
    A.project.dravtonDairyShed[0],
    A.project.dravtonDairyShed[1],
    A.project.milkingParlour[0],
    A.project.haierCraneMezzanine[0],
  ],
  warehouses: [
    A.division.warehouses,
    A.project.haierCraneMezzanine[1],
    A.division.sheds,
  ],
  structural: [
    A.division.structural,
    A.service.fabrication,
    A.service.erection,
    A.project.bridge[0],
    A.project.mariaB[0],
  ],
  custom: [
    A.division.custom,
    A.service.fabrication,
    A.project.rapidExit[0],
    A.project.rapidExit[1],
    A.service.painting,
  ],
};

export function poolImage(urlPath: string, index = 0): string {
  const norm = urlPath.toLowerCase();

  if (norm.startsWith("/about-us/")) {
    const list = POOLS.aboutUs;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/pre-engineered-buildings-pakistan/")) {
    const list = POOLS.peb;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/industrial-sheds-pakistan/")) {
    const list = POOLS.sheds;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/steel-warehouses-pakistan/")) {
    const list = POOLS.warehouses;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/structural-steel-fabrication-pakistan/")) {
    const list = POOLS.structural;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/custom-steel-fabrication-pakistan/")) {
    const list = POOLS.custom;
    return list[Math.abs(index) % list.length];
  }
  if (norm.startsWith("/services/")) {
    if (norm.includes("design")) return A.service.design;
    if (norm.includes("detailing")) return A.service.detailing;
    if (norm.includes("fabrication")) return A.service.fabrication;
    if (norm.includes("cleaning")) return A.service.cleaning;
    if (norm.includes("painting")) return A.service.painting;
    if (norm.includes("erection")) return A.service.erection;
    if (norm.includes("after-sale")) return A.service.aftersale;
    return A.service.design;
  }
  if (norm.startsWith("/clients/") || norm.startsWith("/contact-us/")) {
    return A.team;
  }
  if (norm.startsWith("/blog/")) {
    if (norm.includes("what-is-a-pre-engineered-building")) return A.blog.whatIsPeb;
    if (norm.includes("peb-vs-concrete")) return A.blog.pebVsConcrete;
    if (norm.includes("factory-shed-checklist")) return A.blog.factoryShed;
    if (norm.includes("dairy") || norm.includes("poultry") || norm.includes("crane-shed")) return A.division.sheds;
    if (norm.includes("warehouse") || norm.includes("racking") || norm.includes("dock") || norm.includes("cold-storage") || norm.includes("wheat")) return A.division.warehouses;
    if (norm.includes("column") || norm.includes("truss") || norm.includes("mezzanine") || norm.includes("fabricat")) return A.division.structural;
    if (norm.includes("coating") || norm.includes("rust") || norm.includes("weld") || norm.includes("lifting") || norm.includes("extend")) return A.service.painting;
    if (norm.includes("quote") || norm.includes("compare") || norm.includes("contractor")) return A.service.design;
    return A.division.peb;
  }

  return A.team;
}
