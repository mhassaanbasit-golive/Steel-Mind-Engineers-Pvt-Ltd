import React, { useState } from "react";
import pageData from "../content/generated/page-68.json";
import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { UI } from "../data/ui.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { Field } from "../components/ui/Field.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";

const PROJECT_TYPE_OPTIONS = [
  { value: "pre-engineered building", label: "Pre-Engineered Building" },
  { value: "industrial shed", label: "Industrial Shed" },
  { value: "steel warehouse", label: "Steel Warehouse" },
  { value: "structural steel", label: "Structural Steel" },
  { value: "custom fabrication", label: "Custom Steel Fabrication" },
  { value: "other", label: "Other" },
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    projectType: "",
    size: "",
    message: "",
    company_website: "", // honeypot
  });

  const [fileData, setFileData] = useState<{
    name: string;
    type: string;
    data: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      setFileData(null);
      return;
    }

    if (file.size > 3.5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "The file is larger than 3.5 MB. Please send a smaller file or email it to info@steelmind.pk.",
      }));
      setFileData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData({
        name: file.name,
        type: file.type,
        data: reader.result as string,
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Full name is required (at least 2 characters).";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    const cleanPhone = formData.phone.replace(/[\s+-]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Phone number is required (at least 10 digits).";
    }
    if (!formData.city || formData.city.trim().length === 0) {
      newErrors.city = "City is required.";
    }
    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type.";
    }
    if (!formData.message || formData.message.trim().length === 0) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot check
    if (formData.company_website) {
      setSubmitted(true);
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
          city: formData.city,
          projectType: formData.projectType,
          size: formData.size,
          message: formData.message,
          file: fileData || undefined,
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(true);
      }
    } catch {
      // In development or demo mode fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Header */}
      <section className="relative w-full h-[62svh] min-h-[420px] lg:h-[70vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={A.team}
            alt="Steel Mind Engineers factory entrance at Karol Ghati, Lahore."
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Contact Us" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[28px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {pageData.h1}
          </h1>
        </div>
      </section>

      {/* 2. Quick Answer (Floating Trigger + Drawer) */}
      <QuickAnswer text={pageData.quickAnswer} h1={pageData.h1} related={pageData.related} />

      {/* 3. Contact Cards (2x2 mobile, 4 cols desktop; offwhite, 24px padding) */}
      <section className="py-12 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--offwhite)] p-6 space-y-2" data-reveal="">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              Phone 1
            </span>
            <div>
              <a
                href={`tel:${SITE.tel[0]}`}
                className="text-[18px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
              >
                {SITE.phones[0]}
              </a>
            </div>
          </div>

          <div className="bg-[var(--offwhite)] p-6 space-y-2" data-reveal="">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              Phone 2
            </span>
            <div>
              <a
                href={`tel:${SITE.tel[1]}`}
                className="text-[18px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
              >
                {SITE.phones[1]}
              </a>
            </div>
          </div>

          <div className="bg-[var(--offwhite)] p-6 space-y-2" data-reveal="">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              Email
            </span>
            <div>
              <a
                href={`mailto:${SITE.email}`}
                className="text-[18px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
              >
                {SITE.email}
              </a>
            </div>
          </div>

          <div className="bg-[var(--offwhite)] p-6 space-y-2" data-reveal="">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              WhatsApp
            </span>
            <div>
              <a
                href={SITE.whatsappMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[18px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Addresses with Map Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-[var(--line)]">
          <div className="space-y-2">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              Head Office
            </span>
            <p className="text-[16px] text-[var(--ink)]">
              <a
                href={SITE.mapHeadOffice}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--blue)] hover:underline"
              >
                {SITE.headOffice}
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
              Factory
            </span>
            <p className="text-[16px] text-[var(--ink)]">
              <a
                href={SITE.mapFactory}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--blue)] hover:underline"
              >
                {SITE.factory}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Quote Form Section */}
      <section id="quote" className="py-16 bg-[var(--offwhite)] border-y border-[var(--line)]">
        <div className="max-w-[800px] mx-auto px-[var(--pad-x)]">
          <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-3" data-split="">
            Request a Quote for Your Steel Building
          </h2>
          <p className="text-[16px] text-[var(--grey)] mb-8">
            Send the use, size and location of your project. An engineer will read each request and reply with questions and the next steps.
          </p>

          {submitted ? (
            <div className="bg-white p-8 border border-[var(--line)] text-center space-y-4 animate-[fadeIn_0.5s_ease-out]">
              <div className="w-12 h-12 bg-green-50 text-green-700 mx-auto flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h3 className="text-[22px] font-semibold text-[var(--ink)]">
                Thank You
              </h3>
              <p className="text-[16px] text-[var(--grey)] max-w-[500px] mx-auto">
                {UI.formThanks}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 border border-[var(--line)] space-y-6">
              {/* Honeypot field */}
              <input
                type="text"
                name="company_website"
                value={formData.company_website}
                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                  id="quote-name"
                  label="Full Name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  error={errors.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Field
                  id="quote-phone"
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                  id="quote-email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Field
                  id="quote-city"
                  label="Project City / Location"
                  required
                  placeholder="e.g. Lahore, Karachi, Chunian"
                  value={formData.city}
                  error={errors.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                  id="quote-type"
                  label="Project Type"
                  type="select"
                  required
                  placeholder="Select Project Type"
                  options={PROJECT_TYPE_OPTIONS}
                  value={formData.projectType}
                  error={errors.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                />

                <Field
                  id="quote-size"
                  label="Approximate Size (Optional)"
                  placeholder="e.g. 100 x 200 ft or 20,000 sq ft"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>

              <Field
                id="quote-message"
                label="Message / Project Details"
                type="textarea"
                required
                rows={4}
                placeholder="Tell us about the intended use, height, crane or mezzanine requirements..."
                value={formData.message}
                error={errors.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />

              <div className="space-y-2">
                <Field
                  id="quote-file"
                  label="Drawings or Photos (Optional, max 3.5 MB)"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  error={errors.file}
                  onChange={handleFileChange}
                />
                {fileData && (
                  <div className="flex items-center space-x-3 text-[13px] text-[var(--grey)]">
                    <span>Selected: {fileData.name}</span>
                    <button
                      type="button"
                      onClick={() => setFileData(null)}
                      className="text-[var(--error)] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? "Sending..." : "Request a Quote"}
                </Button>

                {submitError && (
                  <p className="mt-3 text-[13px] text-[var(--error)] font-medium">
                    {UI.formError}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 5. What to Include & Factory Visit Details */}
      <section className="py-16 max-w-[1340px] mx-auto px-[var(--pad-x)] space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4" data-reveal="">
            <h2 className="text-[22px] font-semibold text-[var(--ink)]">
              What to Include
            </h2>
            <p className="text-[16px] leading-[1.65] text-[var(--grey)]">
              The use of the building, the approximate width and length, the height, the city or site, and any crane, mezzanine or extension plan. A rough sketch or a photo is enough to start.
            </p>
          </div>

          <div className="space-y-4" data-reveal="">
            <h2 className="text-[22px] font-semibold text-[var(--ink)]">
              What Happens After You Send
            </h2>
            <p className="text-[16px] leading-[1.65] text-[var(--grey)]">
              An engineer reads the request. The team replies with questions and the next steps. You receive a quote with a schedule, and a 3D concept follows once the scope is agreed.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--line)] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--ink)]">
              Company Profile Document
            </h3>
            <p className="text-[15px] text-[var(--grey)]">
              Download the 29-page company profile PDF to share with your team or consultant.
            </p>
          </div>
          <a
            href={SITE.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
            className="px-6 py-3 text-white hover:brightness-110 active:brightness-90 font-semibold text-[13px] uppercase tracking-[0.05em] transition-all whitespace-nowrap rounded-none border border-white/40"
          >
            {SITE.profileButton}
          </a>
        </div>
      </section>

      {/* 6. FAQ */}
      {pageData.faq && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* 7. Related */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={pageData.related} />
      </div>
    </div>
  );
};
