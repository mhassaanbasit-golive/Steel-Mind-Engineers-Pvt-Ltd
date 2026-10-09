import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { ContentData, FAQItem } from "../content/types.ts";

export function generateSchema(page: ContentData): object[] {
  const schemas: object[] = [];

  // 1. Organization Schema (All pages)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.steelmind.pk/#organization",
    name: SITE.name,
    alternateName: SITE.short,
    url: SITE.domain,
    logo: {
      "@type": "ImageObject",
      url: A.logoTransparent,
    },
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phones,
    sameAs: Object.values(SITE.social),
    areaServed: "Pakistan",
  };
  schemas.push(organizationSchema);

  // 2. WebSite Schema (Home)
  if (page.url === "/") {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://www.steelmind.pk/#website",
      url: SITE.domain,
      name: SITE.name,
      inLanguage: "en-PK",
      publisher: {
        "@id": "https://www.steelmind.pk/#organization",
      },
    };
    schemas.push(websiteSchema);
  }

  // 3. LocalBusiness Schema (Home & Contact)
  if (page.url === "/" || page.url === "/contact-us/") {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "GeneralContractor"],
      "@id": "https://www.steelmind.pk/#localbusiness",
      name: SITE.name,
      url: `${SITE.domain}${page.url}`,
      telephone: SITE.phones,
      email: SITE.email,
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
          address: SITE.headOffice,
        },
        {
          "@type": "Place",
          name: "Factory",
          address: SITE.factory,
        },
      ],
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
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
    };
    schemas.push(localBusinessSchema);
  }

  // 4. WebPage Schema (Every page)
  let pageType = "WebPage";
  if (page.url.startsWith("/blog/")) pageType = "Article";
  else if (page.url === "/contact-us/") pageType = "ContactPage";
  else if (page.url === "/about-us/introduction/") pageType = "AboutPage";
  else if (page.url === "/projects/" || page.url === "/clients/") pageType = "CollectionPage";

  const webpageSchema: any = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: page.h1,
    description: page.description,
    url: `${SITE.domain}${page.url}`,
    inLanguage: "en-PK",
    isPartOf: {
      "@id": "https://www.steelmind.pk/#website",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".quick-answer", "h1"],
    },
  };

  if (page.article) {
    webpageSchema.headline = page.h1;
    webpageSchema.datePublished = SITE.launchDate;
    webpageSchema.dateModified = SITE.launchDate;
    webpageSchema.author = {
      "@id": "https://www.steelmind.pk/#organization",
    };
    webpageSchema.publisher = {
      "@id": "https://www.steelmind.pk/#organization",
    };
  }
  schemas.push(webpageSchema);

  // 5. FAQPage Schema (Where FAQ exists)
  if (page.faq && page.faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item: FAQItem) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
    schemas.push(faqSchema);
  }

  return schemas;
}
