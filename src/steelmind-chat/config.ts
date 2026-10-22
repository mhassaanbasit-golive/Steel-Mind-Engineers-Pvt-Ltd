const rawSiteUrl = (import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")).trim();
const siteBaseUrl = rawSiteUrl.replace(/\/+$/, "");

export const smConfig = Object.freeze({
  siteBaseUrl,
  companyName: "Steel Mind Engineers",
  companyLegalName: "Steel Mind Engineers Pvt. Ltd.",
  phone: "+92 300 4253966",
  phoneTel: "tel:+923004253966",
  phone2: "+92 307 7077549",
  whatsappUrl: "https://wa.me/923004253966",
  email: "info@steelmind.pk",
  emailUrl: "mailto:info@steelmind.pk",
  quoteUrl: `${siteBaseUrl}/contact-us/`,
});

export default smConfig;
