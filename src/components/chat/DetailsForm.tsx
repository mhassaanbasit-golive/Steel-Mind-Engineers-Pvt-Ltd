import React, { useState } from "react";
import { playDing } from "../../lib/sound.ts";

export interface DetailsFormProps {
  onSubmit: (lead: { name: string; email: string; phone: string }) => void;
  muted: boolean;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ onSubmit, muted }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s+-]/g, "");
      if (cleanPhone.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setApiError(false);

    try {
      const leadData = {
        stage: "start",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        conversation: [],
        page: window.location.pathname,
        company_website: companyWebsite,
      };

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      playDing(muted);
      onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    } catch {
      // In preview/local mock or fallback: proceed smoothly
      playDing(muted);
      onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] text-center mb-8">
        Please enter your details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field */}
        <input
          type="text"
          name="company_website"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2">
            Name
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3 text-[12px] lg:text-[13px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none"
          />
          {errors.name && (
            <p className="text-[12px] text-[var(--error)] px-3">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 text-[12px] lg:text-[13px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none"
          />
          {errors.email && (
            <p className="text-[12px] text-[var(--error)] px-3">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2">
            Phone (Optional)
          </label>
          <input
            type="tel"
            placeholder="+92 300 0000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-5 py-3 text-[12px] lg:text-[13px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none"
          />
          {errors.phone && (
            <p className="text-[12px] text-[var(--error)] px-3">{errors.phone}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-full bg-[var(--blue)] text-white font-semibold text-[10px] uppercase tracking-[0.06em] hover:bg-[var(--blue-dark)] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT DETAILS"}
          </button>

          {apiError && (
            <p className="mt-3 text-[12px] text-[var(--error)] text-center">
              The message did not send. Please check your details and try again, or call +92 300 4253966.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
