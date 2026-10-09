import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";
import { UI } from "../../data/ui.ts";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true); // Graceful in demo
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      style={{
        background: "var(--blue-glossy)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
      className="text-white pt-20 lg:pt-[120px] pb-8 lg:pb-10 border-t border-white/12"
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-12 lg:gap-16">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img
                src={A.logoTransparent}
                alt="Steel Mind Engineers"
                className="w-[140px] h-auto object-contain brightness-0 invert"
              />
            </Link>

            <div className="flex flex-col text-left">
              <span className="font-semibold text-[17px] text-white">
                {SITE.header.title}
              </span>
              <span className="text-[10px] uppercase font-semibold text-white/70 tracking-[0.18em] mt-0.5">
                {SITE.header.sub}
              </span>
            </div>

            <p className="text-[15px] leading-[1.65] text-white/72 max-w-[380px]">
              Steel Mind designs, fabricates and erects steel structures for industry, agriculture and commerce.
            </p>

            <div className="text-[13px] uppercase tracking-[0.12em] text-white font-medium">
              {SITE.tagline}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2 text-white">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="0" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <span className="block text-[12px] uppercase font-semibold text-white/70 tracking-[0.08em]">
              Quick Links
            </span>
            <div className="flex flex-col space-y-3 text-[16px]">
              <Link to="/about-us/introduction/" className="hover:underline text-white/90 hover:text-white">
                About Us
              </Link>
              <Link to="/pre-engineered-buildings-pakistan/" className="hover:underline text-white/90 hover:text-white">
                Pre-Engineered Buildings
              </Link>
              <Link to="/industrial-sheds-pakistan/" className="hover:underline text-white/90 hover:text-white">
                Industrial Sheds
              </Link>
              <Link to="/services/" className="hover:underline text-white/90 hover:text-white">
                Services
              </Link>
              <Link to="/projects/" className="hover:underline text-white/90 hover:text-white">
                Our Projects
              </Link>
              <Link to="/clients/" className="hover:underline text-white/90 hover:text-white">
                Our Clients
              </Link>
              <Link to="/contact-us/" className="hover:underline text-white/90 hover:text-white">
                Contact Us
              </Link>
              <a
                href={SITE.profilePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="pt-2 text-[14px] text-white underline hover:text-white/80"
              >
                {SITE.profileLink}
              </a>
            </div>
          </div>

          {/* Column 3: Newsletter & Contact */}
          <div className="space-y-6">
            <span className="block text-[12px] uppercase font-semibold text-white/70 tracking-[0.08em]">
              Newsletter
            </span>

            {subscribed ? (
              <p className="text-[14px] text-white/90 py-2">{UI.formThanks}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  {UI.newsletterPlaceholder}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={UI.newsletterPlaceholder}
                    className="flex-1 bg-transparent border border-white/50 text-white placeholder:text-white/50 px-4 py-3 text-[16px] focus:outline-none focus:border-white rounded-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-white text-[var(--blue)] font-semibold text-[14px] px-5 py-3 hover:bg-white/90 transition-colors rounded-none cursor-pointer whitespace-nowrap"
                  >
                    Subscribe →
                  </button>
                </div>
              </form>
            )}

            {/* Direct Contact Block */}
            <div className="pt-4 border-t border-white/20 space-y-2 text-[14px] text-white/85">
              <div>
                <a href={`tel:${SITE.tel[0]}`} className="hover:underline block">
                  {SITE.phones[0]}
                </a>
                <a href={`tel:${SITE.tel[1]}`} className="hover:underline block">
                  {SITE.phones[1]}
                </a>
              </div>
              <div>
                <a href={`mailto:${SITE.email}`} className="hover:underline">
                  {SITE.email}
                </a>
              </div>
              <div className="pt-2 space-y-1 text-[13px] text-white/70">
                <p>
                  Head office:{" "}
                  <a
                    href={SITE.mapHeadOffice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white/90"
                  >
                    {SITE.headOffice}
                  </a>
                </p>
                <p>
                  Factory:{" "}
                  <a
                    href={SITE.mapFactory}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white/90"
                  >
                    {SITE.factory}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 lg:mt-16 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-white/70">
          <div>© {SITE.name}</div>
          <div className="flex items-center space-x-6">
            <Link to="/sitemap/" className="hover:underline hover:text-white">
              {UI.sitemap}
            </Link>
            <a
              href="https://getgolive.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-white"
            >
              {UI.demoCredit}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
