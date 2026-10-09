import fs from "fs";
import path from "path";
import { SITE } from "../src/data/site.ts";
import { NAV } from "../src/data/nav.ts";
import { PROJECTS } from "../src/data/projects.ts";

const contentDir = path.resolve("./src/content/generated");
const distDir = path.resolve("./dist");
const publicDir = path.resolve("./public");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "blog-cards.json");
const allData: Record<string, any> = {};

for (const f of files) {
  const raw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const data = JSON.parse(raw);
  if (data.url) {
    allData[data.url] = data;
  }
}

// 1. Build llms.txt
let llmsText = `# ${SITE.name}

> Steel Mind Engineers designs, fabricates and erects pre-engineered buildings, industrial sheds, steel warehouses and custom steel structures across Pakistan. Factory and head office are in Lahore.

Phone: ${SITE.phones.join(", ")}. Email: ${SITE.email}.
Head Office: ${SITE.headOffice}. Factory: ${SITE.factory}.

## Main Divisions
`;

const mainDivs = NAV.find((n) => n.label === "Main Divisions");
if (mainDivs?.divisions) {
  mainDivs.divisions.forEach((div) => {
    const hub = allData[div.url];
    if (hub) {
      llmsText += `- [${div.label}](${SITE.domain}${div.url}): ${hub.quickAnswer}\n`;
    }
  });
}

llmsText += `\n## Services\n`;
const servicesNav = NAV.find((n) => n.label === "Services");
if (servicesNav?.children) {
  servicesNav.children.forEach((c) => {
    const sPage = allData[c.url];
    if (sPage) {
      llmsText += `- [${c.label}](${SITE.domain}${c.url}): ${sPage.quickAnswer}\n`;
    }
  });
}

llmsText += `\n## Projects\n`;
PROJECTS.filter((p) => p.published).forEach((p) => {
  const url = `/projects/${p.slug}/`;
  const pData = allData[url];
  if (pData) {
    llmsText += `- [${p.title} (${p.client})](${SITE.domain}${url}): ${pData.quickAnswer}\n`;
  }
});

llmsText += `\n## About\n`;
const aboutNav = NAV.find((n) => n.label === "About Us");
if (aboutNav?.children) {
  aboutNav.children.forEach((c) => {
    const aData = allData[c.url];
    if (aData) {
      llmsText += `- [${c.label}](${SITE.domain}${c.url}): ${aData.quickAnswer}\n`;
    }
  });
}

llmsText += `\n## Blog\n`;
Object.values(allData)
  .filter((d: any) => d.article)
  .forEach((art: any) => {
    llmsText += `- [${art.h1}](${SITE.domain}${art.url}): ${art.quickAnswer}\n`;
  });

// 2. Build llms-full.txt
let llmsFullText = `# ${SITE.name} — Full Technical Knowledge Document\n\n`;

Object.values(allData).forEach((item: any) => {
  llmsFullText += `H1: ${item.h1}\n`;
  llmsFullText += `URL: ${SITE.domain}${item.url}\n`;
  llmsFullText += `Quick answer: ${item.quickAnswer}\n`;

  if (item.faq && item.faq.length > 0) {
    llmsFullText += `FAQ:\n`;
    item.faq.forEach((f: { q: string; a: string }) => {
      llmsFullText += `Q: ${f.q}\nA: ${f.a}\n`;
    });
  }

  llmsFullText += `\n---\n\n`;
});

// Save both
fs.writeFileSync(path.join(distDir, "llms.txt"), llmsText, "utf-8");
fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsText, "utf-8");

fs.writeFileSync(path.join(distDir, "llms-full.txt"), llmsFullText, "utf-8");
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFullText, "utf-8");

console.log("llms.txt and llms-full.txt successfully written.");
