import fs from "fs";
import path from "path";
import { SITE } from "../src/data/site.ts";
import { NAV } from "../src/data/nav.ts";
import { PROJECTS } from "../src/data/projects.ts";
import { SEO_META } from "../src/lib/seo-meta.ts";

const contentDir = path.resolve("./src/content/generated");
const distDir = path.resolve("./dist");
const publicDir = path.resolve("./public");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "blog-cards.json");
const allData: Record<string, any> = {};
const rawByUrl: Record<string, any> = {};

// Map non-canonical content URLs to canonical paths in SEO_META
const CONTENT_TO_CANONICAL: Record<string, string> = {
  "/about-us/introduction/": "/about/",
  "/about-us/sme-policy/": "/about/sme-policy/",
  "/about-us/factory-tour/": "/about/factory/",
};

for (const f of files) {
  const raw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const data = JSON.parse(raw);
  if (data.url) {
    rawByUrl[data.url] = data;
    const canonicalUrl = CONTENT_TO_CANONICAL[data.url] || data.url;
    allData[canonicalUrl] = {
      ...data,
      url: canonicalUrl,
    };
  }
}

// 1. Build llms.txt
let llmsText = `# ${SITE.name}

> Steel Mind Engineers designs, fabricates and erects pre-engineered buildings, industrial sheds, steel warehouses and custom steel structures across Pakistan. Factory and head office are in Lahore.

Website: ${SITE.domain}
Social links: [Facebook](${SITE.social.facebook}), [Instagram](${SITE.social.instagram}), [TikTok](${SITE.social.tiktok}), [LinkedIn](${SITE.social.linkedin})
30+ projects completed, 8+ years of experience, 10+ cities served, 1,000+ tons of steel fabricated
Clients include: ${SITE.clients.join(", ")}
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
    const url = c.url.endsWith("/") ? c.url : `${c.url}/`;
    const aData = allData[url];
    if (aData) {
      llmsText += `- [${c.label}](${SITE.domain}${url}): ${aData.quickAnswer}\n`;
    }
  });
}

const compProfileData = allData["/company-profile/"];
if (compProfileData) {
  llmsText += `- [Company Profile (PDF)](${SITE.profilePdf}): ${compProfileData.quickAnswer}\n`;
}

const visionData = rawByUrl["/about-us/vision/"];
if (visionData) {
  llmsText += `Vision: ${visionData.quickAnswer}\n`;
}

const missionData = rawByUrl["/about-us/mission/"];
if (missionData) {
  llmsText += `Mission: ${missionData.quickAnswer}\n`;
}

const coreValuesData = rawByUrl["/about-us/core-values/"];
if (coreValuesData) {
  llmsText += `Core values: ${coreValuesData.quickAnswer}\n`;
}

const committedData = rawByUrl["/about-us/committed-to/"];
if (committedData) {
  llmsText += `Commitments: ${committedData.quickAnswer}\n`;
}

llmsText += `\n## Blog\n`;
const blogUrls = Object.keys(SEO_META).filter((k) => k.startsWith("/blog/") && k !== "/blog/");
blogUrls.forEach((bUrl) => {
  const art = allData[bUrl];
  if (art) {
    llmsText += `- [${art.h1}](${SITE.domain}${art.url}): ${art.quickAnswer}\n`;
  }
});

llmsText += `\n## Contact\n`;
const contactData = allData["/contact-us/"];
if (contactData) {
  llmsText += `- [Contact Us](${SITE.domain}/contact-us/): ${contactData.quickAnswer}\n`;
}

llmsText += `\n## Optional\n`;
llmsText += `- [Full Technical Knowledge Document](${SITE.domain}/llms-full.txt)\n`;
llmsText += `- [XML Sitemap](${SITE.domain}/sitemap.xml)\n`;

// 2. Build llms-full.txt
let llmsFullText = `# ${SITE.name} — Full Technical Knowledge Document\n\n`;

for (const p of Object.keys(SEO_META)) {
  const item = allData[p];
  if (!item) continue;

  llmsFullText += `H1: ${item.h1}\n`;
  llmsFullText += `URL: ${SITE.domain}${p}\n`;
  llmsFullText += `Quick answer: ${item.quickAnswer}\n`;

  if (item.faq && item.faq.length > 0) {
    llmsFullText += `FAQ:\n`;
    item.faq.forEach((f: { q: string; a: string }) => {
      llmsFullText += `Q: ${f.q}\nA: ${f.a}\n`;
    });
  }

  llmsFullText += `\n---\n\n`;

  // Immediately append Vision, Mission, Core values after /about/
  if (p === "/about/") {
    const v = rawByUrl["/about-us/vision/"];
    if (v) {
      llmsFullText += `H1: Vision\n`;
      llmsFullText += `URL: ${SITE.domain}/about/\n`;
      llmsFullText += `Quick answer: ${v.quickAnswer}\n\n---\n\n`;
    }
    const m = rawByUrl["/about-us/mission/"];
    if (m) {
      llmsFullText += `H1: Mission\n`;
      llmsFullText += `URL: ${SITE.domain}/about/\n`;
      llmsFullText += `Quick answer: ${m.quickAnswer}\n\n---\n\n`;
    }
    const cv = rawByUrl["/about-us/core-values/"];
    if (cv) {
      llmsFullText += `H1: Core values\n`;
      llmsFullText += `URL: ${SITE.domain}/about/\n`;
      llmsFullText += `Quick answer: ${cv.quickAnswer}\n\n---\n\n`;
    }
  }

  // Immediately append Committed To after /about/sme-policy/
  if (p === "/about/sme-policy/") {
    const comm = rawByUrl["/about-us/committed-to/"];
    if (comm) {
      llmsFullText += `H1: Committed To\n`;
      llmsFullText += `URL: ${SITE.domain}/about/sme-policy/\n`;
      llmsFullText += `Quick answer: ${comm.quickAnswer}\n\n---\n\n`;
    }
  }
}

// Save both
fs.writeFileSync(path.join(distDir, "llms.txt"), llmsText, "utf-8");
fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsText, "utf-8");

fs.writeFileSync(path.join(distDir, "llms-full.txt"), llmsFullText, "utf-8");
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFullText, "utf-8");

console.log("llms.txt and llms-full.txt successfully written.");
