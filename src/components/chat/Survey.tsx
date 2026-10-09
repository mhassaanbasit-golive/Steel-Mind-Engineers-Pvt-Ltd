import React, { useState } from "react";

export interface SurveyProps {
  lead: { name: string; email: string; phone: string } | null;
  onFinish: () => void;
}

export const Survey: React.FC<SurveyProps> = ({ lead, onFinish }) => {
  const [firstTime, setFirstTime] = useState<"yes" | "no" | "">("");
  const [resolved, setResolved] = useState<"yes" | "no" | "">("");
  const [rating, setRating] = useState<"up" | "down" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: firstTime,
          resolved,
          rating,
          name: lead?.name || "",
          email: lead?.email || "",
        }),
      });
    } catch {}

    // Wait 1.2s then fade overlay out
    setTimeout(() => {
      onFinish();
    }, 1200);
  };

  return (
    <div className="w-full max-w-[380px] mx-auto animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <h2 className="text-[22px] font-semibold text-[var(--ink)] text-center mb-8">
        You have closed the chat.
      </h2>

      {submitted ? (
        <div className="text-center py-8">
          <p className="text-[14px] text-[var(--grey)]">
            Thank you for your feedback.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Q1 */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium text-[var(--ink)]">
              Is this the first time you have chatted with us about this case?
            </p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-[14px] cursor-pointer">
                <input
                  type="radio"
                  name="firstTime"
                  value="yes"
                  checked={firstTime === "yes"}
                  onChange={() => setFirstTime("yes")}
                  className="accent-[var(--ink)] w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2 text-[14px] cursor-pointer">
                <input
                  type="radio"
                  name="firstTime"
                  value="no"
                  checked={firstTime === "no"}
                  onChange={() => setFirstTime("no")}
                  className="accent-[var(--ink)] w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium text-[var(--ink)]">
              Was the case resolved during the chat?
            </p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-[14px] cursor-pointer">
                <input
                  type="radio"
                  name="resolved"
                  value="yes"
                  checked={resolved === "yes"}
                  onChange={() => setResolved("yes")}
                  className="accent-[var(--ink)] w-4 h-4"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2 text-[14px] cursor-pointer">
                <input
                  type="radio"
                  name="resolved"
                  value="no"
                  checked={resolved === "no"}
                  onChange={() => setResolved("no")}
                  className="accent-[var(--ink)] w-4 h-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Q3 Rating Buttons */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium text-[var(--ink)]">
              How would you rate this chat?
            </p>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setRating("up")}
                aria-pressed={rating === "up"}
                className={`w-11 h-11 border border-[var(--line)] flex items-center justify-center transition-colors cursor-pointer ${
                  rating === "up" ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill={rating === "up" ? "currentColor" : "none"} strokeWidth="1.5">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setRating("down")}
                aria-pressed={rating === "down"}
                className={`w-11 h-11 border border-[var(--line)] flex items-center justify-center transition-colors cursor-pointer ${
                  rating === "down" ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill={rating === "down" ? "currentColor" : "none"} strokeWidth="1.5">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
              className="w-full py-3.5 px-6 rounded-full text-white font-medium text-[13px] uppercase tracking-[0.05em] hover:brightness-110 active:brightness-90 transition-all cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
