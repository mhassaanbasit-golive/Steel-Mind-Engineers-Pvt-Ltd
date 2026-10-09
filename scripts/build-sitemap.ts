import fs from "fs";
import path from "path";
import { SITE } from "../src/data/site.ts";
import { PROJECTS } from "../src/data/projects.ts";

const contentDir = path.resolve("./src/content/generated");
const distDir = path.resolve("./dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "blog-cards.json");

// Unpublished project pages to exclude per Section 4.9 & 17.6:
const EXCLUDED_PAGES = new Set([
  "/projects/haier-peb-store-shed-raiwind/",
  "/projects/latifia-dairy-peb-dairy-shed-kasur/",
  "/projects/haier-mezzanine-floor-raiwind/",
  "/projects/dravton-dairy-feed-storage-shed-chunian/",
  "/projects/haier-peb-crane-shed-raiwind/",
  "/company-profile/",
]);

let urlEntries: string[] = [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(contentDir, f), "utf-8");
  const data = JSON.parse(raw);

  if (!data.url || EXCLUDED_PAGES.has(data.url) || data.url === "/sitemap/") continue;

  const loc = `${SITE.domain}${data.url}`;
  let imagesXml = "";

  // Check if this is a published project
  const matchedProject = PROJECTS.find((p) => p.published && `/projects/${p.slug}/` === data.url);
  if (matchedProject && matchedProject.images.length > 0) {
    imagesXml = matchedProject.images
      .map(
        (img) => `
    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`
      )
      .join("");
  }

  urlEntries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${SITE.launchDate}</lastmod>${imagesXml}
  </url>`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join("\n")}
</urlset>`;

fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
// Also save to public/sitemap.xml so it's always available
fs.writeFileSync(path.resolve("./public/sitemap.xml"), sitemapXml, "utf-8");

console.log(`sitemap.xml written successfully with ${urlEntries.length} URLs.`);
