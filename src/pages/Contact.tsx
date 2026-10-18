// PART 12. CONTACT PAGE — Mobile-first, Clean & Fast
import React, { useState, useRef } from "react";
import pageData from "../content/generated/page-68.json";
import { SITE } from "../data/site.ts";
import { IMG } from "../data/subpageImages.ts";
import { PhoneIcon, PhoneIconHandle } from "../components/icons/phone.tsx";
import { MessageSquareMoreIcon, MessageSquareMoreIconHandle } from "../components/icons/message-square-more.tsx";
import { FacebookIcon, FacebookIconHandle } from "../components/icons/facebook.tsx";
import { InstagramIcon, InstagramIconHandle } from "../components/icons/instagram.tsx";
import { TiktokIcon, TiktokIconHandle } from "../components/icons/tiktok.tsx";
import { LinkedinIcon, LinkedinIconHandle } from "../components/icons/linkedin.tsx";
import { MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

const PROJECT_TYPES = [
  "Pre-Engineered Buildings",
  "Industrial Sheds",
  "Steel Warehouses",
  "Structural Steel Fabrication",
  "Custom Steel Fabrication",
  "Services",
  "Other",
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "Pre-Engineered Buildings",
    message: "",
    company_website: "", // honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  // Icon refs for hover micro-animations
  const phone1Ref = useRef<PhoneIconHandle>(null);
  const phone2Ref = useRef<PhoneIconHandle>(null);
  const emailRef = useRef<MessageSquareMoreIconHandle>(null);
  const fbRef = useRef<FacebookIconHandle>(null);
  const igRef = useRef<InstagramIconHandle>(null);
  const ttRef = useRef<TiktokIconHandle>(null);
  const liRef = useRef<LinkedinIconHandle>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = "Full name is required (at least 2 characters).";
    }
    const cleanPhone = formData.phone.replace(/[\s+-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = "Phone or WhatsApp number is required.";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message || formData.message.trim().length === 0) {
      errs.message = "Message is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company_website) return; // Silent discard for bot spam

    if (!validate()) {
      const firstErrKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrKey}`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="w-full bg-white pt-[var(--header-h,60px)] lg:pt-[var(--header-h,80px)]">
      {/* 1. Page Title Block: White bg, H1 ink colour, subtitle lead */}
      <section className="container py-10 lg:py-16 text-left">
        <h1
          className="font-bold text-[var(--ink)] tracking-[-0.02em] mb-4 text-balance"
          style={{ fontSize: "var(--fs-h2)" }}
        >
          {pageData.h1}
        </h1>
        <p
          className="text-[var(--grey-strong)] max-w-[800px] leading-[1.6]"
          style={{ fontSize: "var(--fs-lead)" }}
        >
          Send your drawings, outline or building questions. An engineer reads every submission and replies with facts, not a sales pitch.
        </p>
      </section>

      {/* 2. Two Columns Layout: Desktop 5fr / 7fr, Mobile Form first then Info */}
      <section className="container pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Info Section (Desktop left 5fr, Mobile second) */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-10 text-left">
            {/* Contact Rows with 1px top rules */}
            <div className="divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
              {/* Phone 1 */}
              <div
                className="py-5 flex items-center justify-between group"
                onMouseEnter={() => phone1Ref.current?.startAnimation()}
                onMouseLeave={() => phone1Ref.current?.stopAnimation()}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(30,58,138,0.06)] text-[var(--blue)] flex items-center justify-center">
                    <PhoneIcon ref={phone1Ref} size={20} />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                      Direct Engineer Line
                    </div>
                    <a
                      href={`tel:${SITE.tel[0]}`}
                      className="text-[16px] lg:text-[17px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
                    >
                      {SITE.phones[0]}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone 2 */}
              <div
                className="py-5 flex items-center justify-between group"
                onMouseEnter={() => phone2Ref.current?.startAnimation()}
                onMouseLeave={() => phone2Ref.current?.stopAnimation()}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(30,58,138,0.06)] text-[var(--blue)] flex items-center justify-center">
                    <PhoneIcon ref={phone2Ref} size={20} />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                      Lahore Office Line
                    </div>
                    <a
                      href={`tel:${SITE.tel[1]}`}
                      className="text-[16px] lg:text-[17px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
                    >
                      {SITE.phones[1]}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className="py-5 flex items-center justify-between group"
                onMouseEnter={() => emailRef.current?.startAnimation()}
                onMouseLeave={() => emailRef.current?.stopAnimation()}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(30,58,138,0.06)] text-[var(--blue)] flex items-center justify-center">
                    <MessageSquareMoreIcon ref={emailRef} size={20} />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                      Project Inquiries & Drawings
                    </div>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-[16px] lg:text-[17px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="py-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(30,58,138,0.06)] text-[var(--blue)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                    Factory & Head Office
                  </div>
                  <a
                    href="https://maps.google.com/?q=827+Karol+Village+Rd+Lahore+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] lg:text-[16px] font-medium text-[var(--ink)] hover:text-[var(--blue)] transition-colors block mt-0.5 leading-[1.5]"
                  >
                    827 Karol Village Rd, Lahore, Pakistan
                  </a>
                </div>
              </div>
            </div>

            {/* Social Icons (44px round buttons) */}
            <div className="pt-2">
              <div className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-4">
                Connect on Social Channels
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  onMouseEnter={() => fbRef.current?.startAnimation()}
                  onMouseLeave={() => fbRef.current?.stopAnimation()}
                  className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all duration-350 cursor-pointer"
                >
                  <FacebookIcon ref={fbRef} size={18} />
                </a>

                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  onMouseEnter={() => igRef.current?.startAnimation()}
                  onMouseLeave={() => igRef.current?.stopAnimation()}
                  className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all duration-350 cursor-pointer"
                >
                  <InstagramIcon ref={igRef} size={18} />
                </a>

                <a
                  href={SITE.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  onMouseEnter={() => ttRef.current?.startAnimation()}
                  onMouseLeave={() => ttRef.current?.stopAnimation()}
                  className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all duration-350 cursor-pointer"
                >
                  <TiktokIcon ref={ttRef} size={18} />
                </a>

                <a
                  href={SITE.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  onMouseEnter={() => liRef.current?.startAnimation()}
                  onMouseLeave={() => liRef.current?.stopAnimation()}
                  className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)] transition-all duration-350 cursor-pointer"
                >
                  <LinkedinIcon ref={liRef} size={18} />
                </a>
              </div>
            </div>

            {/* QR Block */}
            <div className="pt-4 flex items-center gap-6">
              <div className="w-[128px] h-[128px] lg:w-[160px] lg:h-[160px] p-3 border border-[var(--rule)] bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <img
                  src={IMG.contact.qr}
                  alt="QR code for Steel Mind Engineers"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[12px] uppercase font-semibold text-[var(--blue)] tracking-[0.08em] block">
                  Scan to connect
                </span>
                <p className="text-[13px] text-[var(--grey)] leading-[1.5] max-w-[220px]">
                  Instant WhatsApp conversation and digital company profile.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section (Desktop right 7fr, Mobile first) */}
          <div className="order-1 lg:order-2 lg:col-span-7 w-full">
            <div className="bg-white border border-[var(--rule)] p-6 sm:p-10 shadow-sm text-left">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <CheckCircle2 size={48} className="text-[var(--blue)] animate-bounce" />
                  <h3 className="text-[22px] font-bold text-[var(--ink)]">Thank You</h3>
                  <p className="text-[15px] text-[var(--grey-strong)] max-w-[420px] leading-[1.6]">
                    Your message has been received. A senior engineer will review your inquiry and reply promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        projectType: "Pre-Engineered Buildings",
                        message: "",
                        company_website: "",
                      });
                    }}
                    className="btn btn-outline btn-sm mt-4"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="field-name"
                      className="block text-[13px] font-semibold text-[var(--ink)] uppercase tracking-[0.06em] mb-2"
                    >
                      Full Name <span className="text-[var(--blue)]">*</span>
                    </label>
                    <input
                      id="field-name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full h-[52px] px-4 text-[16px] text-[var(--ink)] bg-white border border-[var(--rule)] focus:border-[var(--blue)] focus:outline-none focus:ring-3 focus:ring-[rgba(30,58,138,0.15)] transition-all"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--ink)] font-medium">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone or WhatsApp */}
                  <div>
                    <label
                      htmlFor="field-phone"
                      className="block text-[13px] font-semibold text-[var(--ink)] uppercase tracking-[0.06em] mb-2"
                    >
                      Phone or WhatsApp <span className="text-[var(--blue)]">*</span>
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      enterKeyHint="next"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0300 1234567"
                      className="w-full h-[52px] px-4 text-[16px] text-[var(--ink)] bg-white border border-[var(--rule)] focus:border-[var(--blue)] focus:outline-none focus:ring-3 focus:ring-[rgba(30,58,138,0.15)] transition-all"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--ink)] font-medium">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="field-email"
                      className="block text-[13px] font-semibold text-[var(--ink)] uppercase tracking-[0.06em] mb-2"
                    >
                      Email Address <span className="text-[var(--blue)]">*</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      required
                      autoComplete="email"
                      enterKeyHint="next"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. engineer@company.com"
                      className="w-full h-[52px] px-4 text-[16px] text-[var(--ink)] bg-white border border-[var(--rule)] focus:border-[var(--blue)] focus:outline-none focus:ring-3 focus:ring-[rgba(30,58,138,0.15)] transition-all"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--ink)] font-medium">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label
                      htmlFor="field-projectType"
                      className="block text-[13px] font-semibold text-[var(--ink)] uppercase tracking-[0.06em] mb-2"
                    >
                      Project Type
                    </label>
                    <select
                      id="field-projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full h-[52px] px-4 text-[16px] text-[var(--ink)] bg-white border border-[var(--rule)] focus:border-[var(--blue)] focus:outline-none focus:ring-3 focus:ring-[rgba(30,58,138,0.15)] transition-all"
                    >
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="field-message"
                      className="block text-[13px] font-semibold text-[var(--ink)] uppercase tracking-[0.06em] mb-2"
                    >
                      Message / Project Details <span className="text-[var(--blue)]">*</span>
                    </label>
                    <textarea
                      id="field-message"
                      required
                      rows={5}
                      enterKeyHint="send"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify estimated dimensions, building purpose, city, and required features (crane, mezzanine, etc.)."
                      className="w-full p-4 text-[16px] text-[var(--ink)] bg-white border border-[var(--rule)] focus:border-[var(--blue)] focus:outline-none focus:ring-3 focus:ring-[rgba(30,58,138,0.15)] transition-all resize-y"
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--ink)] font-medium">
                        <AlertCircle size={14} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      <span>{submitting ? "Sending..." : "Send Message"}</span>
                      <span className="btn-arrow">→</span>
                    </button>

                    {submitError && (
                      <p className="mt-3 text-[13px] text-[var(--ink)] font-medium">
                        The message could not send. Please call +92 300 4253966 or reach us on WhatsApp.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Responsive Map Embed (Fixed heights: 360px mobile, 480px tablet, 520px desktop) */}
      <section className="w-full bg-[#FAFAFA] border-t border-[var(--rule)] relative">
        <div
          data-lenis-prevent={mapActive ? "" : undefined}
          className="relative w-full h-[360px] md:h-[480px] lg:h-[520px] overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6420165762197!2d74.36726999999999!3d31.616267599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191a512bbd1dc5%3A0x19b8ff5e02cf5f6e!2s827%20Karol%20Village%20Rd%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1792208634678!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Steel Mind Engineers location on Google Maps"
            className="w-full h-full block"
          />

          {/* Mobile Scroll-Trap Guard */}
          {!mapActive && (
            <div
              onClick={() => setMapActive(true)}
              className="md:hidden absolute inset-0 z-10 bg-black/10 flex items-center justify-center cursor-pointer"
            >
              <span className="bg-white text-[var(--ink)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] shadow-md">
                Tap to use the map
              </span>
            </div>
          )}
        </div>
      </section>
    </article>
  );
};
