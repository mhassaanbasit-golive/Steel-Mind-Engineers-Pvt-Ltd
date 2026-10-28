import { SEO_META } from "./seo-meta.ts";
import { SITE } from "../data/site.ts";

export function resolveSeo(pathname: string): {
  path: string | null;
  title: string;
  description: string;
  ogType: "website" | "article";
} {
  let clean = pathname.split("?")[0].split("#")[0];
  clean = clean.replace(/\/+/g, "/");
  if (!clean.startsWith("/")) clean = "/" + clean;
  if (!clean.endsWith("/")) clean = clean + "/";

  // Alias
  if (clean === "/contact/") clean = "/contact-us/";

  if (clean in SEO_META) {
    const entry = SEO_META[clean];
    const ogType: "website" | "article" =
      clean.startsWith("/blog/") && clean !== "/blog/" ? "article" : "website";
    return {
      path: clean,
      title: entry.title,
      description: entry.description,
      ogType,
    };
  }

  return {
    path: null,
    title: "Page Not Found | Steel Mind Engineers",
    description: SEO_META["/"].description,
    ogType: "website",
  };
}

export function applySeo(pathname: string): void {
  if (typeof document === "undefined") return;

  const { path, title, description, ogType } = resolveSeo(pathname);

  // Document Title
  document.title = title;

  // Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", description);

  // Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = path !== null ? `${SITE.domain}${path}` : null;
  if (canonicalUrl !== null) {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  } else if (canonical) {
    canonical.remove();
  }

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  } else {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:title");
    m.setAttribute("content", title);
    document.head.appendChild(m);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute("content", description);
  } else {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:description");
    m.setAttribute("content", description);
    document.head.appendChild(m);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (canonicalUrl !== null) {
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalUrl);
    } else {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:url");
      m.setAttribute("content", canonicalUrl);
      document.head.appendChild(m);
    }
  } else if (ogUrl) {
    ogUrl.remove();
  }

  const ogTypeMeta = document.querySelector('meta[property="og:type"]');
  if (ogTypeMeta) {
    ogTypeMeta.setAttribute("content", ogType);
  } else {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:type");
    m.setAttribute("content", ogType);
    document.head.appendChild(m);
  }

  // Twitter
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) {
    twTitle.setAttribute("content", title);
  } else {
    const m = document.createElement("meta");
    m.setAttribute("name", "twitter:title");
    m.setAttribute("content", title);
    document.head.appendChild(m);
  }

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    twDesc.setAttribute("content", description);
  } else {
    const m = document.createElement("meta");
    m.setAttribute("name", "twitter:description");
    m.setAttribute("content", description);
    document.head.appendChild(m);
  }

  // sm:route event
  window.dispatchEvent(
    new CustomEvent("sm:route", {
      detail: {
        path: pathname,
        canonical: canonicalUrl,
        title,
      },
    })
  );
}
