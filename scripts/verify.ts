import fs from "fs";
import path from "path";
import { A } from "../src/data/assets.ts";
import { NAV } from "../src/data/nav.ts";
import { ContentData } from "./build-content.ts";

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

  // Soft warnings:
  if (data.title && data.title.length > 60) {
    warnings.push(`Warning: ${file} title > 60 chars (${data.title.length}): "${data.title}"`);
  }
  if (data.description && data.description.length > 155) {
    warnings.push(`Warning: ${file} description > 155 chars (${data.description.length})`);
  }
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
  if (!seenUrls.has(nUrl) && nUrl !== "/about-us/") {
    console.error(`HARD FAIL: Nav route has no matching content file: ${nUrl}`);
    hasError = true;
  }
}

// Summary
console.log(`\nVerification Summary:`);
console.log(`Total content files verified: ${files.length}`);
console.log(`Warnings/Notices count: ${warnings.length}`);
if (warnings.length > 0) {
  warnings.forEach(w => console.log(" - " + w));
}

if (hasError) {
  console.error("\nVerification FAILED with hard errors.");
  process.exit(1);
} else {
  console.log("\nVerification PASSED: all hard checks succeeded.");
}
