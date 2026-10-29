import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { SEO_META } from "./seo-meta.ts";
import { cl } from "./cloudinary.ts";
import { getBlogCover, blogImages } from "../data/blogImages.ts";
import { NAV } from "../data/nav.ts";
import { PROJECTS } from "../data/projects.ts";
import type { ContentData } from "../content/types.ts";

const DOMAIN = "https://steelmindengineers.com";
const DEPLOY_DATE = "2026-11-01";

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function getPlainAnswer(
  page: ContentData | undefined,
  fallbackDesc = ""
): string {
  if (!page) return fallbackDesc;
  let text = (page.quickAnswer || "").trim();
  let words = countWords(text);

  if (words >= 40 && words <= 60) {
    return text;
  }

  if (words < 40 && page.blocks) {
    for (const block of page.blocks) {
      if (block.type === "p" && block.text) {
        const sentences = block.text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [
          block.text,
        ];
        for (const rawSentence of sentences) {
          const s = rawSentence.trim();
          if (!s) continue;
          const candidate = text ? `${text} ${s}` : s;
          const candidateWords = countWords(candidate);
          if (candidateWords <= 60) {
            text = candidate;
            words = candidateWords;
            if (words >= 40) break;
          }
        }
        if (words >= 40) break;
      }
    }
  }

  return text || fallbackDesc;
}

export function toSentenceCase(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  let result = lower.charAt(0).toUpperCase() + lower.slice(1);
  result = result
    .replace(/\bpeb\b/gi, "PEB")
    .replace(/\bsme\b/gi, "SME")
    .replace(/\bpakistan\b/gi, "Pakistan")
    .replace(/\blahore\b/gi, "Lahore");
  return result;
}

const FAQ_HIDDEN_PATHS = new Set([
  "/about/",
  "/about/sme-policy/",
  "/about/factory/",
  "/contact-us/",
  "/company-profile/",
  "/sitemap/",
]);

export function isFaqVisible(path: string): boolean {
  if (FAQ_HIDDEN_PATHS.has(path)) return false;
  if (path.startsWith("/projects/") && path !== "/projects/") {
    return false;
  }
  return true;
}

const SERVICES_MAP: Record<string, string> = {
  "/services/": "Steel Construction Services",
  "/services/design/": "Steel Structure Design",
  "/services/detailing/": "Steel Detailing",
  "/services/fabrication/": "Steel Fabrication",
  "/services/cleaning/": "Steel Cleaning and Rust Removal",
  "/services/painting/": "Steel Painting and Coating",
  "/services/erection/": "Steel Erection",
  "/services/after-sale-services/": "After Sale Services for Steel Buildings",
};

export function hasServiceNode(path: string): boolean {
  if (path === "/services/" || path.startsWith("/services/")) return true;
  if (
    path === "/pre-engineered-buildings-pakistan/" ||
    path.startsWith("/industrial-sheds-pakistan/") ||
    path.startsWith("/steel-warehouses-pakistan/") ||
    path.startsWith("/structural-steel-fabrication-pakistan/") ||
    path.startsWith("/custom-steel-fabrication-pakistan/")
  ) {
    return true;
  }
  return false;
}

const navLabels: Record<string, string> = {};
for (const item of NAV) {
  const norm = item.url.endsWith("/") ? item.url : item.url + "/";
  navLabels[norm] = item.label;
  if (item.children) {
    for (const ch of item.children) {
      const chNorm = ch.url.endsWith("/") ? ch.url : ch.url + "/";
      navLabels[chNorm] = ch.label;
    }
  }
  if (item.divisions) {
    for (const div of item.divisions) {
      const divNorm = div.url.endsWith("/") ? div.url : div.url + "/";
      navLabels[divNorm] = div.label;
      if (div.children) {
        for (const ch of div.children) {
          const chNorm = ch.url.endsWith("/") ? ch.url : ch.url + "/";
          navLabels[chNorm] = ch.label;
        }
      }
    }
  }
}

navLabels["/company-profile/"] = "Company Profile";
navLabels["/sitemap/"] = "Sitemap";
navLabels["/blog/"] = "Blogs";
navLabels["/services/"] = "Services";
navLabels["/about/"] = "About Us";

const projectsMap: Record<string, string> = {};
for (const p of PROJECTS) {
  projectsMap[`/projects/${p.slug}/`] = `${p.title} (${p.client})`;
}

export function getContentUrl(path: string): string {
  if (path === "/about/") return "/about-us/introduction/";
  if (path === "/about/sme-policy/") return "/about-us/sme-policy/";
  if (path === "/about/factory/") return "/about-us/factory-tour/";
  return path;
}

export function buildSchema(
  path: string,
  getPage: (url: string) => ContentData | undefined
): object | null {
  if (!SEO_META[path]) {
    return null;
  }

  const meta = SEO_META[path];
  const pageContentUrl = getContentUrl(path);
  const page = getPage(pageContentUrl);
  const canonicalUrl = `${DOMAIN}${path}`;
  const pageTitle = meta.title.split(" | ")[0];
  const pageDescription = getPlainAnswer(page, meta.description);

  // Home page plain answer for Organization description
  const homePage = getPage("/");
  const homePlainAnswer = getPlainAnswer(homePage, SEO_META["/"].description);

  // 12 Offers for Organization OfferCatalog
  const offerUrls = [
    { name: "Pre-Engineered Buildings", url: "/pre-engineered-buildings-pakistan/" },
    { name: "Industrial Sheds", url: "/industrial-sheds-pakistan/" },
    { name: "Steel Warehouses", url: "/steel-warehouses-pakistan/" },
    { name: "Structural Steel Fabrication", url: "/structural-steel-fabrication-pakistan/" },
    { name: "Custom Steel Fabrication", url: "/custom-steel-fabrication-pakistan/" },
    { name: "Steel Structure Design", url: "/services/design/" },
    { name: "Steel Detailing", url: "/services/detailing/" },
    { name: "Steel Fabrication", url: "/services/fabrication/" },
    { name: "Steel Cleaning and Rust Removal", url: "/services/cleaning/" },
    { name: "Steel Painting and Coating", url: "/services/painting/" },
    { name: "Steel Erection", url: "/services/erection/" },
    { name: "After Sale Services for Steel Buildings", url: "/services/after-sale-services/" },
  ];

  const offerCatalogItems = offerUrls.map((off) => {
    const offPage = getPage(getContentUrl(off.url));
    const offDesc = getPlainAnswer(offPage, SEO_META[off.url]?.description || "");
    return {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: off.name,
        url: `${DOMAIN}${off.url}`,
        description: offDesc,
      },
    };
  });

  // Node 1: Organization
  const orgNode = {
    "@type": "Organization",
    "@id": `${DOMAIN}/#organization`,
    name: SITE.name,
    legalName: SITE.name,
    alternateName: SITE.short,
    url: DOMAIN,
    slogan: SITE.tagline,
    logo: {
      "@type": "ImageObject",
      url: A.logoTransparent,
    },
    image: cl(A.logoLandscape, 1200),
    description: homePlainAnswer,
    email: SITE.email,
    telephone: SITE.phones,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+92 300 4253966",
        contactType: "sales",
        areaServed: "PK",
        availableLanguage: ["en", "ur"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+92 307 7077549",
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["en", "ur"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "35-D Commercial, DHA EME Sector",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    location: [
      {
        "@type": "Place",
        name: "Head Office",
        address: {
          "@type": "PostalAddress",
          streetAddress: "35-D Commercial, DHA EME Sector",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        hasMap: SITE.mapHeadOffice,
      },
      {
        "@type": "Place",
        name: "Factory",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Karol Ghati",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          postalCode: "54000",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.6162676,
          longitude: 74.36727,
        },
        hasMap: SITE.mapFactory,
      },
    ],
    hasMap: [SITE.mapHeadOffice, SITE.mapFactory],
    sameAs: Object.values(SITE.social),
    areaServed: "Pakistan",
    knowsAbout: [
      "Pre-Engineered Buildings",
      "Industrial Sheds",
      "Steel Warehouses",
      "Structural Steel Fabrication",
      "Custom Steel Fabrication",
      "Design",
      "Detailing",
      "Fabrication",
      "Cleaning",
      "Painting",
      "Erection",
      "After Sale Services",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Steel Construction & Engineering Services",
      itemListElement: offerCatalogItems,
    },
  };

  // Node 2: WebSite
  const websiteNode = {
    "@type": "WebSite",
    "@id": `${DOMAIN}/#website`,
    url: DOMAIN,
    name: SITE.name,
    inLanguage: "en-PK",
    publisher: {
      "@id": `${DOMAIN}/#organization`,
    },
  };

  // Node conditions
  const isService = hasServiceNode(path);
  const isArticle = path.startsWith("/blog/") && path !== "/blog/";
  const isFaq = Boolean(
    page && page.faq && page.faq.length > 0 && isFaqVisible(path)
  );

  // Node 3: Page Node
  let pageType = "WebPage";
  if (path === "/about/") pageType = "AboutPage";
  else if (path === "/contact-us/") pageType = "ContactPage";
  else if (path === "/projects/" || path === "/clients/")
    pageType = "CollectionPage";

  const pageNode: any = {
    "@type": pageType,
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    inLanguage: "en-PK",
    isPartOf: {
      "@id": `${DOMAIN}/#website`,
    },
    about: {
      "@id": `${DOMAIN}/#organization`,
    },
    description: pageDescription,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".quick-answer", "h1"],
    },
  };

  if (path !== "/") {
    pageNode.breadcrumb = {
      "@id": `${canonicalUrl}#breadcrumb`,
    };
  }

  if (isService) {
    pageNode.mainEntity = {
      "@id": `${canonicalUrl}#service`,
    };
  } else if (isArticle) {
    pageNode.mainEntity = {
      "@id": `${canonicalUrl}#article`,
    };
  } else if (isFaq) {
    pageNode.mainEntity = {
      "@id": `${canonicalUrl}#faq`,
    };
  }

  if (path === "/") {
    pageNode.video = {
      "@id": `${DOMAIN}/#video`,
    };
  }

  const nodes: object[] = [orgNode, websiteNode, pageNode];

  // Node 4: BreadcrumbList (all paths except /)
  if (path !== "/") {
    const items = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${DOMAIN}/`,
      },
    ];

    const segments = path.split("/").filter(Boolean);
    if (segments.length === 1) {
      const label = navLabels[path] || pageTitle;
      items.push({
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `${DOMAIN}${path}`,
      });
    } else if (segments.length >= 2) {
      const parentPath = `/${segments[0]}/`;
      const parentLabel =
        navLabels[parentPath] ||
        (parentPath === "/about/"
          ? "About Us"
          : SEO_META[parentPath]?.title.split(" | ")[0] || segments[0]);
      items.push({
        "@type": "ListItem",
        position: 2,
        name: parentLabel,
        item: `${DOMAIN}${parentPath}`,
      });

      let currentLabel = navLabels[path];
      if (projectsMap[path]) {
        currentLabel = projectsMap[path];
      } else if (!currentLabel) {
        currentLabel = pageTitle;
      }

      items.push({
        "@type": "ListItem",
        position: 3,
        name: currentLabel,
        item: `${DOMAIN}${path}`,
      });
    }

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: items,
    };
    nodes.push(breadcrumbNode);
  }

  // Node 5: Service Node
  if (isService) {
    const serviceName = SERVICES_MAP[path] || pageTitle;
    const serviceNode = {
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: serviceName,
      description: pageDescription,
      provider: {
        "@id": `${DOMAIN}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
    };
    nodes.push(serviceNode);
  }

  // Node 6: Article Node
  if (isArticle) {
    const articleNode = {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      headline: page?.h1 || pageTitle,
      description: pageDescription,
      image: cl(getBlogCover(page?.h1 || "", canonicalUrl, blogImages.hero), 1200),
      datePublished: SITE.launchDate,
      dateModified: SITE.launchDate,
      author: {
        "@id": `${DOMAIN}/#organization`,
      },
      publisher: {
        "@id": `${DOMAIN}/#organization`,
      },
      mainEntityOfPage: {
        "@id": `${canonicalUrl}#webpage`,
      },
    };
    nodes.push(articleNode);
  }

  // Node 7: VideoObject (only for /)
  if (path === "/") {
    const videoNode = {
      "@type": "VideoObject",
      "@id": `${DOMAIN}/#video`,
      name: "Where Steel Meets Intelligence",
      description:
        "From design to installation, Steel Mind Engineers Pvt. Ltd. delivers turnkey steel for pre-engineered buildings, industrial sheds, steel warehouses, and custom fabrication across Pakistan.",
      contentUrl:
        "https://res.cloudinary.com/cyfb9slf/video/upload/f_mp4,vc_h264,w_1920,q_auto/v1791664367/Main-homepage-Video_01.mp4.mov",
      thumbnailUrl: [
        "https://res.cloudinary.com/cyfb9slf/video/upload/so_0,f_jpg,q_90,w_1920/v1791664367/Main-homepage-Video_01.mp4.mov",
      ],
      uploadDate: DEPLOY_DATE,
      publisher: {
        "@id": `${DOMAIN}/#organization`,
      },
    };
    nodes.push(videoNode);
  }

  // Node 8: FAQPage
  if (isFaq && page && page.faq) {
    const faqNode = {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: toSentenceCase(item.q),
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
    nodes.push(faqNode);
  }

  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
