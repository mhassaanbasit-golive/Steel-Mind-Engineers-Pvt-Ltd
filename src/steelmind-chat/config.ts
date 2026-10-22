const rawWorkerUrl = (import.meta.env.VITE_WORKER_URL || "https://steelmindengineers-chatbot.mhassaanbasit.workers.dev").trim();
const rawSiteUrl = (import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")).trim();

const workerUrl = rawWorkerUrl.replace(/\/+$/, "");
console.log("CONFIG WORKER URL:", workerUrl);
const siteBaseUrl = rawSiteUrl.replace(/\/+$/, "");

const isPlaceholderWorker =
  !workerUrl ||
  workerUrl.includes("YOUR_WORKER_URL") ||
  workerUrl.includes("placeholder");

if (isPlaceholderWorker && typeof console !== "undefined") {
  console.warn(
    "[SteelMindChat] VITE_WORKER_URL is not configured or is a placeholder. The assistant will display a standard service unavailable notice."
  );
}

export const smConfig = Object.freeze({
  workerUrl,
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
  isPlaceholderWorker,
});

export default smConfig;
