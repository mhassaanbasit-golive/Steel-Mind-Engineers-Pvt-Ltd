import fs from "fs";
import path from "path";
import { A } from "../src/data/assets.ts";
import { NAV } from "../src/data/nav.ts";
import { SITE } from "../src/data/site.ts";
import { PROJECTS } from "../src/data/projects.ts";
import { ContentData } from "./build-content.ts";
import { SEO_META } from "../src/lib/seo-meta.ts";
import { buildSchema, getContentUrl, toSentenceCase } from "../src/lib/schema.ts";

const isPost = process.argv.includes("--post");
const warnOnly = process.env.SEO_VERIFY_WARN_ONLY === "1";

if (isPost) {
  console.log("Running post-build verification checks (P1-P5)...");
  let hasPostError = false;
  const postErrors: string[] = [];
  const postWarnings: string[] = [];

  // P1: Sitemap checks
  const sitemapPath = path.resolve("public/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    postErrors.push("P1: public/sitemap.xml does not exist");
  } else {
    const sitemapXml = fs.readFileSync(sitemapPath, "utf-8");
    const locMatches = [...sitemapXml.matchAll(/<loc>https:\/\/steelmindengineers\.com(.*?)<\/loc>/g)].map(m => m[1]);
    const expectedCount = Object.keys(SEO_META).length - 2;
    if (locMatches.length !== expectedCount) {
      postErrors.push(`P1: Sitemap URL count is ${locMatches.length}, expected ${expectedCount}`);
    }
    for (const loc of locMatches) {
      if (!(loc in SEO_META)) {
        postErrors.push(`P1: Sitemap URL not in SEO_META: ${loc}`);
      }
      if (loc.includes("/about-us/") || loc.includes("/overview/")) {
        postErrors.push(`P1: Sitemap contains retired path: ${loc}`);
      }
    }
  }

  // P2: "steelmind.pk" check in crawler files
  const crawlerFiles = [
    "public/sitemap.xml",
    "public/llms.txt",
    "public/llms-full.txt",
    "public/robots.txt"
  ];
  for (const relFile of crawlerFiles) {
    const fullPath = path.resolve(relFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.toLowerCase().includes("steelmind.pk")) {
        postErrors.push(`P2: ${relFile} contains "steelmind.pk"`);
      }
    }
  }

  // P3: ## About in llms.txt has list items
  const llmsPath = path.resolve("public/llms.txt");
  if (!fs.existsSync(llmsPath)) {
    postErrors.push("P3: public/llms.txt does not exist");
  } else {
    const llmsContent = fs.readFileSync(llmsPath, "utf-8");
    const aboutMatch = llmsContent.match(/## About([\s\S]*?)(?:##|$)/);
    if (!aboutMatch || !aboutMatch[1].includes("- ")) {
      postErrors.push("P3: public/llms.txt ## About section has no list items (- )");
    }
  }

  // P4: dist/index.html checks
  const distHtmlPath = path.resolve("dist/index.html");
  if (!fs.existsSync(distHtmlPath)) {
    postErrors.push("P4: dist/index.html does not exist");
  } else {
    const distHtml = fs.readFileSync(distHtmlPath, "utf-8");
    if (distHtml.includes('<link rel="canonical"')) {
      postErrors.push("P4: dist/index.html contains <link rel=\"canonical\"");
    }
    if (!distHtml.includes("G-HSKF5DLMLY")) {
      postErrors.push("P4: dist/index.html missing GA4 Measurement ID G-HSKF5DLMLY");
    }
  }

  // P5: robots.txt groups have Disallow: /api/ (Warning)
  const robotsPath = path.resolve("public/robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");
    const groups = robotsContent.split(/(?=User-agent:)/g).filter(g => g.trim().startsWith("User-agent:"));
    groups.forEach((g, idx) => {
      if (!g.includes("Disallow: /api/")) {
        postWarnings.push(`P5 Warning: robots.txt group ${idx + 1} is missing "Disallow: /api/"`);
      }
    });
  }

  console.log(`\nPost-build Verification Summary:`);
  console.log(`Post-build errors: ${postErrors.length}`);
  console.log(`Post-build warnings: ${postWarnings.length}`);

  if (postWarnings.length > 0) {
    postWarnings.forEach(w => console.log(" [WARN] " + w));
  }

  if (postErrors.length > 0) {
    postErrors.forEach(e => console.error(" [ERROR] " + e));
    hasPostError = true;
  }

  if (hasPostError) {
    console.error("\nPost-build verification FAILED with errors.");
    process.exit(1);
  } else {
    console.log("\nPost-build verification PASSED: all checks succeeded.");
    process.exit(0);
  }
}

// Pre-build / standard verification
const BANNED_WORDS = [
  "leverage", "seamless", "robust", "elevate", "cutting-edge",
  "world-class", "unlock", "optimize", "empower", "innovative",
  "excellence", "digital", "transformative", "journey", "ecosystem",
  "landscape", "holistic"
];

const contentDir = path.resolve("./src/content/generated");

if (!fs.existsSync(contentDir)) {
  console.error("ERROR: content directory does not exist:", contentDir);
  process.exit(1);
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".json") && f !== "blog-cards.json");
console.log(`Verifying ${files.length} content files...`);

let hasError = false;
const warnings: string[] = [];
const seenUrls = new Set<string>();
const allContent: ContentData[] = [];

// 1. Assets URL check
function checkAssetUrls(obj: any, prefix = "A") {
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      if (!val.startsWith("https://res.cloudinary.com/cyfb9slf/")) {
        console.error(`HARD FAIL: Asset ${prefix}.${key} URL does not start with https://res.cloudinary.com/cyfb9slf/: ${val}`);
        hasError = true;
      }
    } else if (Array.isArray(val)) {
      val.forEach((url, idx) => {
        if (typeof url === "string" && !url.startsWith("https://res.cloudinary.com/cyfb9slf/")) {
          console.error(`HARD FAIL: Asset ${prefix}.${key}[${idx}] URL does not start with https://res.cloudinary.com/cyfb9slf/: ${url}`);
          hasError = true;
        }
      });
    } else if (typeof val === "object" && val !== null) {
      checkAssetUrls(val, `${prefix}.${key}`);
    }
  }
}
checkAssetUrls(A);

// 2. Read all files & perform checks
for (const file of files) {
  const filePath = path.join(contentDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");

  // Check placeholders
  if (raw.includes("{PLACEHOLDER}") || raw.includes("{PROJECT_IMAGE_LINK}") || raw.includes("{LOGO_LINK_") || raw.includes("{COMPANY_PROFILE_PDF_URL}")) {
    console.error(`HARD FAIL: ${file} contains unresolved placeholder token!`);
    hasError = true;
  }

  const data: ContentData = JSON.parse(raw);
  allContent.push(data);

  // Hard check: h1 and quickAnswer
  if (!data.h1 || data.h1.trim().length === 0) {
    console.error(`HARD FAIL: ${file} is missing h1!`);
    hasError = true;
  }
  if (!data.quickAnswer || data.quickAnswer.trim().length === 0) {
    console.error(`HARD FAIL: ${file} is missing quickAnswer!`);
    hasError = true;
  }

  // Hard check: url unique and ends with /
  if (!data.url) {
    console.error(`HARD FAIL: ${file} has no url!`);
    hasError = true;
  } else {
    if (!data.url.endsWith("/")) {
      console.error(`HARD FAIL: ${file} url does not end with '/': ${data.url}`);
      hasError = true;
    }
    if (seenUrls.has(data.url)) {
      console.error(`HARD FAIL: duplicate url found in ${file}: ${data.url}`);
      hasError = true;
    }
    seenUrls.add(data.url);
  }

  // Soft warnings (title > 60 and description > 155 removed as JSON titles are not used for SEO):
  if (!data.alt || data.alt.trim().length === 0) {
    warnings.push(`Warning: ${file} has empty or missing alt attribute`);
  }
  if (!data.faq || data.faq.length === 0) {
    warnings.push(`Notice: ${file} has no FAQ`);
  }

  // Banned words check in text
  const lowerRaw = raw.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (new RegExp(`\\b${word}\\b`, "i").test(lowerRaw)) {
      warnings.push(`Warning: ${file} contains banned word: "${word}"`);
    }
  }
}

// 3. Hard check: every nav route has a content file
function collectNavUrls(items: any[]): string[] {
  const urls: string[] = [];
  for (const item of items) {
    if (!item.external && item.url) {
      urls.push(item.url);
    }
    if (item.children) {
      urls.push(...collectNavUrls(item.children));
    }
    if (item.divisions) {
      for (const div of item.divisions) {
        if (div.url) urls.push(div.url);
        if (div.children) urls.push(...collectNavUrls(div.children));
      }
    }
  }
  return urls;
}

const navUrls = collectNavUrls(NAV);
for (const nUrl of navUrls) {
  const cleanUrl = nUrl.split("#")[0];
  if (!seenUrls.has(cleanUrl) && !["/about-us/", "/about", "/about/", "/about/sme-policy", "/about/sme-policy/", "/about/factory", "/about/factory/"].includes(cleanUrl)) {
    console.error(`HARD FAIL: Nav route has no matching content file: ${nUrl}`);
    hasError = true;
  }
}

// 4. SEO Checks (E1-E7, W1-W5)
console.log("\nRunning SEO checks (E1-E7, W1-W5)...");
const seoErrors: string[] = [];
const seoWarnings: string[] = [];

// E1: Live URLs check
const excludedUrls = new Set([
  "/about-us/introduction/",
  "/about-us/vision/",
  "/about-us/mission/",
  "/about-us/core-values/",
  "/about-us/sme-policy/",
  "/about-us/committed-to/",
  "/about-us/factory-tour/",
  "/pre-engineered-buildings-pakistan/overview/",
  ...PROJECTS.filter(p => !p.published).map(p => `/projects/${p.slug}/`),
]);

const liveUrls = new Set([
  ...allContent.map(c => c.url).filter(u => !excludedUrls.has(u)),
  "/about/",
  "/about/sme-policy/",
  "/about/factory/",
  "/sitemap/",
]);

for (const u of liveUrls) {
  if (!(u in SEO_META)) {
    seoErrors.push(`E1: Live URL missing from SEO_META: ${u}`);
  }
}
for (const u of Object.keys(SEO_META)) {
  if (!liveUrls.has(u)) {
    seoErrors.push(`E1: Unknown URL in SEO_META: ${u}`);
  }
}

// E2: Title or description empty or duplicated across entries
const titleMap = new Map<string, string>();
const descMap = new Map<string, string>();
for (const [u, meta] of Object.entries(SEO_META)) {
  if (!meta.title || !meta.title.trim()) {
    seoErrors.push(`E2: Empty title for ${u}`);
  } else {
    if (titleMap.has(meta.title)) {
      seoErrors.push(`E2: Duplicate title for ${u} (matches ${titleMap.get(meta.title)})`);
    }
    titleMap.set(meta.title, u);
  }

  if (!meta.description || !meta.description.trim()) {
    seoErrors.push(`E2: Empty description for ${u}`);
  } else {
    if (descMap.has(meta.description)) {
      seoErrors.push(`E2: Duplicate description for ${u} (matches ${descMap.get(meta.description)})`);
    }
    descMap.set(meta.description, u);
  }
}

// E3: Title > 65 characters or description > 170 characters (except intentional sheet anomalies for / and /about/)
for (const [u, meta] of Object.entries(SEO_META)) {
  if (u !== "/" && meta.title.length > 65) {
    seoErrors.push(`E3: Title > 65 chars (${meta.title.length}) for ${u}: "${meta.title}"`);
  }
  if (u !== "/" && u !== "/about/" && meta.description.length > 170) {
    seoErrors.push(`E3: Description > 170 chars (${meta.description.length}) for ${u}`);
  }
}

// E4: Title or description contains "steelmind.pk" or "www."
for (const [u, meta] of Object.entries(SEO_META)) {
  const tLower = meta.title.toLowerCase();
  const dLower = meta.description.toLowerCase();
  if (tLower.includes("steelmind.pk") || dLower.includes("steelmind.pk")) {
    seoErrors.push(`E4: "steelmind.pk" found in ${u}`);
  }
  if (tLower.includes("www.") || dLower.includes("www.")) {
    seoErrors.push(`E4: "www." found in ${u}`);
  }
}

// E5: Title or description contains forbidden whole words (\b(price|pricing|cost|rate|pkr|rs|affordable|cheap|budget)\b)
const pricingRegex = /\b(price|pricing|cost|rate|pkr|rs|affordable|cheap|budget)\b/i;
for (const [u, meta] of Object.entries(SEO_META)) {
  if (pricingRegex.test(meta.title)) {
    seoErrors.push(`E5: Forbidden pricing word in title of ${u}: "${meta.title}"`);
  }
  if (pricingRegex.test(meta.description)) {
    seoErrors.push(`E5: Forbidden pricing word in description of ${u}: "${meta.description}"`);
  }
}

// E6 & E7: Schema checks
const pageMap = new Map<string, ContentData>();
for (const c of allContent) {
  if (c.url) pageMap.set(c.url, c);
}
const getPage = (url: string) => pageMap.get(url);

const FORBIDDEN_SCHEMA_PROPS = ["priceRange", "aggregateRating", "review", "award"];

for (const u of Object.keys(SEO_META)) {
  let schema: any;
  try {
    schema = buildSchema(u, getPage);
  } catch (err: any) {
    seoErrors.push(`E6: buildSchema threw error for ${u}: ${err?.message || err}`);
    continue;
  }

  if (!schema) {
    seoErrors.push(`E6: buildSchema returned null/undefined for ${u}`);
    continue;
  }

  let str = "";
  try {
    str = JSON.stringify(schema);
    JSON.parse(str);
  } catch (err: any) {
    seoErrors.push(`E6: Schema for ${u} failed JSON roundtrip: ${err?.message || err}`);
    continue;
  }

  for (const prop of FORBIDDEN_SCHEMA_PROPS) {
    if (str.includes(`"${prop}"`)) {
      seoErrors.push(`E6: Schema for ${u} contains forbidden property "${prop}"`);
    }
  }

  const nodes = schema["@graph"] || [];
  const definedIds = new Set(nodes.map((n: any) => n["@id"]).filter(Boolean));

  function validateNodeRefs(obj: any) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(validateNodeRefs);
      return;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (k === "@id" && typeof v === "string") {
        // defined @id
      } else if (v && typeof v === "object" && "@id" in v && Object.keys(v).length === 1) {
        const refId = (v as any)["@id"];
        if (!definedIds.has(refId)) {
          seoErrors.push(`E6: Schema for ${u} references missing @id: "${refId}"`);
        }
      } else {
        validateNodeRefs(v);
      }
    }
  }
  validateNodeRefs(nodes);

  // E7: FAQ questions/answers match page data
  const faqNode = nodes.find((n: any) => n["@type"] === "FAQPage");
  const contentUrl = getContentUrl(u);
  const page = getPage(contentUrl);

  if (faqNode) {
    const mainEntity = faqNode.mainEntity || [];
    if (!page || !page.faq || page.faq.length !== mainEntity.length) {
      seoErrors.push(`E7: FAQ count mismatch for ${u}`);
    } else {
      mainEntity.forEach((item: any, idx: number) => {
        const pageFaqItem = page.faq![idx];
        if (item.name !== toSentenceCase(pageFaqItem.q)) {
          seoErrors.push(`E7: FAQ question name mismatch for ${u} item ${idx}`);
        }
        if (item.acceptedAnswer?.text !== pageFaqItem.a) {
          seoErrors.push(`E7: FAQ answer text mismatch for ${u} item ${idx}`);
        }
      });
    }
  }
}

// Warnings W1 to W5
// W1: Title < 50 or > 60
for (const [u, meta] of Object.entries(SEO_META)) {
  if (meta.title.length < 50 || meta.title.length > 60) {
    seoWarnings.push(`W1: Title length ${meta.title.length} (< 50 or > 60) for ${u}: "${meta.title}"`);
  }
}

// W2: Description < 140 or > 160
for (const [u, meta] of Object.entries(SEO_META)) {
  if (meta.description.length < 140 || meta.description.length > 160) {
    seoWarnings.push(`W2: Description length ${meta.description.length} (< 140 or > 160) for ${u}`);
  }
}

// W3: Double quote in title or description
for (const [u, meta] of Object.entries(SEO_META)) {
  if (meta.title.includes('"')) {
    seoWarnings.push(`W3: Double quote in title for ${u}`);
  }
  if (meta.description.includes('"')) {
    seoWarnings.push(`W3: Double quote in description for ${u}`);
  }
}

// W4: Schema description < 40 or > 60 words
for (const u of Object.keys(SEO_META)) {
  const schema = buildSchema(u, getPage) as any;
  const nodes = schema?.["@graph"] || [];
  const webpage = nodes.find((n: any) => n["@type"]?.includes("Page") && n.description);
  if (webpage?.description) {
    const wc = webpage.description.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 40 || wc > 60) {
      seoWarnings.push(`W4: Schema description word count ${wc} (< 40 or > 60) for ${u}`);
    }
  }
}

// W5: First three words appear in 4 or more titles
const prefixCounts = new Map<string, number>();
for (const [, meta] of Object.entries(SEO_META)) {
  const prefix = meta.title.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase();
  prefixCounts.set(prefix, (prefixCounts.get(prefix) || 0) + 1);
}
for (const [prefix, count] of prefixCounts.entries()) {
  if (count >= 4) {
    seoWarnings.push(`W5: First 3 words "${prefix}" appear in ${count} titles`);
  }
}

// Summary
console.log(`\nVerification Summary:`);
console.log(`Total content files verified: ${files.length}`);
console.log(`General warnings count: ${warnings.length}`);
if (warnings.length > 0) {
  warnings.forEach(w => console.log(" - " + w));
}

console.log(`\nSEO Verification Summary:`);
console.log(`SEO errors count: ${seoErrors.length}`);
console.log(`SEO warnings count: ${seoWarnings.length}`);

if (seoWarnings.length > 0) {
  seoWarnings.forEach(w => console.log(" [WARN] " + w));
}

if (seoErrors.length > 0) {
  if (warnOnly) {
    console.log("\nSEO_VERIFY_WARN_ONLY=1: Downgrading errors to warnings.");
    seoErrors.forEach(e => console.log(" [DOWNGRADED ERROR] " + e));
  } else {
    seoErrors.forEach(e => console.error(" [ERROR] " + e));
    hasError = true;
  }
}

if (hasError) {
  console.error("\nVerification FAILED with hard errors.");
  process.exit(1);
} else {
  console.log("\nVerification PASSED: all checks succeeded.");
}
