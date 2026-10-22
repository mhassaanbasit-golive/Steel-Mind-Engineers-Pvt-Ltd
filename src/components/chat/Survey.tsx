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
    <div
      className="w-full max-w-[380px] mx-auto overflow-y-auto px-[20px] py-[24px] flex flex-col justify-center animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      style={{
        height: "calc(100vh - 64px - 48px)",
        maxHeight: "calc(100dvh - 64px - 48px)",
      }}
    >
      <h2
        className="text-[20px] md:text-[26px] font-semibold text-[var(--ink)] text-center mb-5 md:mb-7 leading-tight tracking-tight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        You have closed the chat.
      </h2>

      {submitted ? (
        <div className="text-center py-8">
          <p
            className="text-[13px] md:text-[15px] text-[var(--grey)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Thank you for your feedback.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          {/* Q1 */}
          <div className="mb-[20px]">
            <p
              className="text-[13px] md:text-[15px] font-medium text-[var(--ink)] mb-2.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Is this the first time you have chatted with us about this case?
            </p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-[13px] text-[var(--ink)] cursor-pointer">
                <input
                  type="radio"
                  name="firstTime"
                  value="yes"
                  checked={firstTime === "yes"}
                  onChange={() => setFirstTime("yes")}
                  className="accent-[#1A3A8A] w-[18px] h-[18px] md:w-[20px] md:h-[20px] cursor-pointer"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2 text-[13px] text-[var(--ink)] cursor-pointer">
                <input
                  type="radio"
                  name="firstTime"
                  value="no"
                  checked={firstTime === "no"}
                  onChange={() => setFirstTime("no")}
                  className="accent-[#1A3A8A] w-[18px] h-[18px] md:w-[20px] md:h-[20px] cursor-pointer"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Q2 */}
          <div className="mb-[20px]">
            <p
              className="text-[13px] md:text-[15px] font-medium text-[var(--ink)] mb-2.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Was the case resolved during the chat?
            </p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-[13px] text-[var(--ink)] cursor-pointer">
                <input
                  type="radio"
                  name="resolved"
                  value="yes"
                  checked={resolved === "yes"}
                  onChange={() => setResolved("yes")}
                  className="accent-[#1A3A8A] w-[18px] h-[18px] md:w-[20px] md:h-[20px] cursor-pointer"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2 text-[13px] text-[var(--ink)] cursor-pointer">
                <input
                  type="radio"
                  name="resolved"
                  value="no"
                  checked={resolved === "no"}
                  onChange={() => setResolved("no")}
                  className="accent-[#1A3A8A] w-[18px] h-[18px] md:w-[20px] md:h-[20px] cursor-pointer"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Q3 Rating Buttons */}
          <div className="mb-[20px]">
            <p
              className="text-[13px] md:text-[15px] font-medium text-[var(--ink)] mb-2.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              How would you rate this chat?
            </p>
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                type="button"
                onClick={() => setRating("up")}
                aria-pressed={rating === "up"}
                className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] border border-[var(--line)] rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  rating === "up"
                    ? "bg-[#1A3A8A] text-white border-transparent"
                    : "bg-white text-[var(--ink)] hover:border-[#1A3A8A]"
                }`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 stroke-current"
                  viewBox="0 0 24 24"
                  fill={rating === "up" ? "currentColor" : "none"}
                  strokeWidth="1.5"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setRating("down")}
                aria-pressed={rating === "down"}
                className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] border border-[var(--line)] rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  rating === "down"
                    ? "bg-[#1A3A8A] text-white border-transparent"
                    : "bg-white text-[var(--ink)] hover:border-[#1A3A8A]"
                }`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 stroke-current"
                  viewBox="0 0 24 24"
                  fill={rating === "down" ? "currentColor" : "none"}
                  strokeWidth="1.5"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Submit Button (Solid Blue #1A3A8A) */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="survey-solid-btn w-full h-[46px] md:h-[48px] rounded-full text-white font-[500] text-[13px] uppercase tracking-[0.05em] flex items-center justify-center cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              SUBMIT
            </button>
          </div>
        </form>
      )}

      <style>{`
        .survey-solid-btn {
          background-color: #1A3A8A;
          transition: background-color 0.25s ease-out, transform 0.25s ease-out;
        }

        .survey-solid-btn:hover {
          background-color: #1E4A9C;
        }

        .survey-solid-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};
