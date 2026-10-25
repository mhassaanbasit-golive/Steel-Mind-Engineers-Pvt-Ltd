import fs from "fs";
import path from "path";
import { SITE } from "../src/data/site.ts";
import { PROJECTS } from "../src/data/projects.ts";

const contentDir = path.resolve("./src/content/generated");
const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "blog-cards.json");

const pagesKnowledge: Array<{ title: string; url: string; answer: string }> = [];
const allFaqs: Array<{ q: string; a: string }> = [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const data = JSON.parse(raw);

  if (data.h1 && data.url) {
    pagesKnowledge.push({
      title: data.h1,
      url: data.url,
      answer: data.quickAnswer || "",
    });
  }

  if (data.faq && Array.isArray(data.faq)) {
    data.faq.forEach((item: { q: string; a: string }) => {
      allFaqs.push({ q: item.q, a: item.a });
    });
  }
}

const publishedProjects = PROJECTS.filter((p) => p.published).map((p) => ({
  title: p.title,
  client: p.client,
  location: p.location,
  type: p.type,
  height: p.height,
  width: p.width,
  length: p.length,
  area: `${p.area.toLocaleString()} sq ft`,
}));

const knowledge = {
  company: {
    name: SITE.name,
    tagline: SITE.tagline,
    domain: SITE.domain,
    stats: SITE.stats,
    phones: SITE.phones,
    whatsapp: "+92 300 4253966",
    whatsappUrl: SITE.whatsappMessage,
    email: SITE.email,
    headOffice: SITE.headOffice,
    factory: SITE.factory,
    mapHeadOffice: SITE.mapHeadOffice,
    mapFactory: SITE.mapFactory,
    companyProfilePdf: SITE.profilePdf,
    socialMedia: {
      instagram: SITE.social.instagram,
      facebook: SITE.social.facebook,
      linkedin: SITE.social.linkedin,
      tiktok: SITE.social.tiktok,
    },
  },
  clients: SITE.clients,
  projects: publishedProjects,
  pages: pagesKnowledge,
  faq: allFaqs,
};

const jsonStr = JSON.stringify(knowledge);
const byteSize = Buffer.byteLength(jsonStr, "utf8");
const kbSize = (byteSize / 1024).toFixed(1);

const apiDir = path.resolve("./api");
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(path.join(apiDir, "_knowledge.json"), jsonStr, "utf-8");
console.log(`Knowledge file written to api/_knowledge.json (${kbSize} KB).`);
