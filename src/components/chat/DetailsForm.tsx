import React, { useState } from "react";
import { playDing } from "../../lib/sound.ts";
import { safeStorage } from "../../steelmind-chat/storage.ts";

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
      if (companyWebsite.trim()) {
        safeStorage.set("sm_honeypot", companyWebsite.trim());
      }
      safeStorage.set(
        "sm_visitor",
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company_website: companyWebsite.trim(),
        })
      );

      playDing(muted);
      onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    } catch {
      playDing(muted);
      onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-[360px] mx-auto overflow-y-auto px-[20px] py-[24px] flex flex-col justify-center animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      style={{
        height: "calc(100vh - 64px - 48px)",
        maxHeight: "calc(100dvh - 64px - 48px)",
      }}
    >
      <h2
        className="text-[20px] md:text-[24px] font-semibold text-[var(--ink)] text-center mb-[18px] md:mb-6 leading-tight tracking-tight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Please enter your details
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
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
        <div className="mb-[14px] md:mb-[16px]">
          <label className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 md:px-5 h-[46px] md:h-[52px] text-[14px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none text-[var(--ink)]"
          />
          {errors.name && (
            <p className="text-[11px] text-[var(--error)] px-3 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-[14px] md:mb-[16px]">
          <label className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 md:px-5 h-[46px] md:h-[52px] text-[14px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none text-[var(--ink)]"
          />
          {errors.email && (
            <p className="text-[11px] text-[var(--error)] px-3 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-[14px] md:mb-[16px]">
          <label className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] px-2 mb-1">
            Phone (Optional)
          </label>
          <input
            type="tel"
            placeholder="+92 300 0000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 md:px-5 h-[46px] md:h-[52px] text-[14px] bg-white border border-[var(--line)] rounded-full focus:outline-none focus:border-[var(--blue)] transition-colors shadow-none text-[var(--ink)]"
          />
          {errors.phone && (
            <p className="text-[11px] text-[var(--error)] px-3 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Submit Button (Solid Blue #1A3A8A) */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={submitting}
            className="form-solid-btn w-full h-[46px] md:h-[48px] rounded-full text-white font-[500] text-[13px] uppercase tracking-[0.05em] flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {submitting ? "SUBMITTING..." : "SUBMIT DETAILS"}
          </button>

          {apiError && (
            <p className="mt-2 text-[12px] text-[var(--error)] text-center">
              The message did not send. Please check your details and try again, or call +92 300 4253966.
            </p>
          )}
        </div>
      </form>

      <style>{`
        .form-solid-btn {
          background-color: #1A3A8A;
          transition: background-color 0.25s ease-out, transform 0.25s ease-out;
        }

        .form-solid-btn:hover {
          background-color: #1E4A9C;
        }

        .form-solid-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};
