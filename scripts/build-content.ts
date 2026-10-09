import fs from "fs";
import path from "path";
import { pages1to20 } from "./data-pages-1-20.ts";
import { pages21to44 } from "./data-pages-21-44.ts";
import { pages45to68 } from "./data-pages-45-68.ts";
import { articles1to12, blogCardsData } from "./data-articles.ts";
import { ContentBlock, FAQItem, ContentData } from "../src/content/types.ts";

export type { ContentBlock, FAQItem, ContentData };

const outDir = path.resolve("./src/content/generated");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const allPages: ContentData[] = [...pages1to20, ...pages21to44, ...pages45to68];

console.log("Writing pages in batches of 8...");
for (let i = 0; i < allPages.length; i += 8) {
  const batch = allPages.slice(i, i + 8);
  let missingH1 = 0;
  let missingQA = 0;
  let missingFAQ = 0;

  for (const page of batch) {
    if (!page.h1) missingH1++;
    if (!page.quickAnswer) missingQA++;
    if (!page.faq || page.faq.length === 0) missingFAQ++;

    const numStr = String(page.page).padStart(2, "0");
    const filePath = path.join(outDir, `page-${numStr}.json`);
    fs.writeFileSync(filePath, JSON.stringify(page, null, 2), "utf-8");
  }

  const start = i + 1;
  const end = Math.min(i + 8, allPages.length);
  console.log(`pages ${start}-${end} done | missing H1: ${missingH1} | missing Quick answer: ${missingQA} | missing FAQ: ${missingFAQ}`);
}

console.log("Writing articles in batches of 6...");
for (let i = 0; i < articles1to12.length; i += 6) {
  const batch = articles1to12.slice(i, i + 6);
  let missingH1 = 0;
  let missingQA = 0;
  let missingFAQ = 0;

  for (const article of batch) {
    if (!article.h1) missingH1++;
    if (!article.quickAnswer) missingQA++;
    if (!article.faq || article.faq.length === 0) missingFAQ++;

    const numStr = String(article.article).padStart(2, "0");
    const filePath = path.join(outDir, `article-${numStr}.json`);
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");
  }

  const start = i + 1;
  const end = Math.min(i + 6, articles1to12.length);
  console.log(`articles ${start}-${end} done | missing H1: ${missingH1} | missing Quick answer: ${missingQA} | missing FAQ: ${missingFAQ}`);
}

// Write blog-cards.json
const blogCardsPath = path.join(outDir, "blog-cards.json");
fs.writeFileSync(blogCardsPath, JSON.stringify(blogCardsData, null, 2), "utf-8");
console.log(`blog-cards.json written with ${blogCardsData.length} cards.`);
console.log("All content files successfully generated.");
