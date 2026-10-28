import { ContentData } from "../content/types.ts";
import { A } from "../data/assets.ts";
import { cl } from "./cloudinary.ts";

export function updatePageMeta(data: ContentData) {
  if (typeof document === "undefined") return;

  // Title
  document.title = data.title;

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", data.description);
  }

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", `https://steelmindengineers.com${data.url}`);

  // OG Title & Desc
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", data.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", data.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", `https://steelmindengineers.com${data.url}`);

  // OG Image
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) {
    const imgUrl = data.url === "/" ? cl(A.logoLandscape, 1200) : cl(A.team, 1200);
    ogImg.setAttribute("content", imgUrl);
  }
}
