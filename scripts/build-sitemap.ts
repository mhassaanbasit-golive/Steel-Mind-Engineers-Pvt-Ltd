import fs from "fs";
import path from "path";
import { SITE } from "../src/data/site.ts";
import { PROJECTS } from "../src/data/projects.ts";
import { SEO_META } from "../src/lib/seo-meta.ts";

const DEFAULT_LASTMOD = "2026-11-01";
const LASTMOD_OVERRIDES: Record<string, string> = {}; // to change one page later, add: "/path/": "YYYY-MM-DD"

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const EXCLUDED_PATHS = new Set(["/sitemap/", "/company-profile/"]);

const urls = Object.keys(SEO_META).filter((p) => !EXCLUDED_PATHS.has(p));

if (urls.length !== 69) {
  throw new Error(`Expected exactly 69 URLs in sitemap, got ${urls.length}`);
}

const seen = new Set<string>();
const urlEntries: string[] = [];

for (const urlPath of urls) {
  if (!urlPath || urlPath.trim() === "") {
    throw new Error("Empty URL path encountered in sitemap generation");
  }
  if (!urlPath.startsWith("/") || !urlPath.endsWith("/")) {
    throw new Error(`URL path must start and end with '/': ${urlPath}`);
  }
  if (seen.has(urlPath)) {
    throw new Error(`Duplicate URL path encountered: ${urlPath}`);
  }
  seen.add(urlPath);

  const loc = `${SITE.domain}${urlPath}`;
  const lastmod = LASTMOD_OVERRIDES[urlPath] || DEFAULT_LASTMOD;
  let imagesXml = "";

  const matchedProject = PROJECTS.find((p) => p.published && `/projects/${p.slug}/` === urlPath);
  if (matchedProject && matchedProject.images && matchedProject.images.length > 0) {
    imagesXml = matchedProject.images
      .map(
        (img) => `
    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
    </image:image>`
      )
      .join("");
  }

  urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>${imagesXml}
  </url>`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join("\n")}
</urlset>\n`;

const distDir = path.resolve("./dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
fs.writeFileSync(path.resolve("./public/sitemap.xml"), sitemapXml, "utf-8");

console.log(`sitemap.xml written successfully with ${urlEntries.length} URLs.`);
