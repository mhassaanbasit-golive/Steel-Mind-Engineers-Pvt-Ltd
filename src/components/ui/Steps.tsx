import React, { useState, useRef, useEffect } from "react";

export interface StepItem {
  num?: string;
  name: string;
  text: string;
}

export interface StepsProps {
  items: StepItem[];
  className?: string;
  title?: string;
}

export const Steps: React.FC<StepsProps> = ({ items, className = "", title }) => {
  if (!items || items.length === 0) return null;

  const N = items.length;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    Array(N).fill(prefersReduced)
  );

  const activeStepsRef = useRef<boolean[]>(Array(N).fill(prefersReduced));
  const segValsRef = useRef<number[]>(Array(N).fill(prefersReduced ? 1 : 0));
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const checkAndAnimate = () => {
      const markY = window.innerHeight * 0.65;
      let needsMoreFrames = false;
      let activeChanged = false;
      const currentActive = [...activeStepsRef.current];

      liRefs.current.forEach((li, i) => {
        if (!li) return;
        const rect = li.getBoundingClientRect();
        const numEl = numRefs.current[i];
        const dotY = numEl ? numEl.offsetHeight / 2 : 28;
        const targetTop = rect.top + dotY;

        const isAct = prefersReduced || markY >= targetTop;
        if (isAct !== currentActive[i]) {
          currentActive[i] = isAct;
          activeChanged = true;
        }

        if (prefersReduced) {
          li.style.setProperty("--seg", "1");
          return;
        }

        const t = Math.max(0, Math.min(1, (markY - targetTop) / rect.height));
        const currentS = segValsRef.current[i] || 0;
        const diff = t - currentS;

        if (Math.abs(diff) > 0.001) {
          needsMoreFrames = true;
          const nextS = currentS + diff * 0.15;
          segValsRef.current[i] = nextS;
          li.style.setProperty("--seg", String(nextS));
        } else if (currentS !== t) {
          segValsRef.current[i] = t;
          li.style.setProperty("--seg", String(t));
        }
      });

      if (activeChanged) {
        activeStepsRef.current = currentActive;
        setActiveSteps(currentActive);
      }

      return needsMoreFrames;
    };

    const loop = () => {
      const needsMore = checkAndAnimate();
      if (needsMore) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        isRunningRef.current = false;
        animFrameRef.current = null;
      }
    };

    const triggerLoop = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    triggerLoop();

    window.addEventListener("scroll", triggerLoop, { passive: true });
    window.addEventListener("resize", triggerLoop, { passive: true });

    return () => {
      window.removeEventListener("scroll", triggerLoop);
      window.removeEventListener("resize", triggerLoop);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [prefersReduced, N]);

  return (
    <div className={`w-full max-w-[760px] mx-auto text-left py-8 ${className}`}>
      {title && (
        <h2 className="font-bold text-[var(--ink)] text-[22px] lg:text-[32px] tracking-[-0.02em] mb-12">
          {title}
        </h2>
      )}

      <ol className="onestep-rail-list list-none m-0 p-0 relative">
        {items.map((step, idx) => {
          const isActive = activeSteps[idx] || prefersReduced;
          const stepNumber = step.num || String(idx + 1).padStart(2, "0");

          return (
            <li
              key={idx}
              ref={(el) => {
                liRefs.current[idx] = el;
              }}
              className="onestep-rail-item relative"
            >
              {/* Dot */}
              <div
                className="absolute rounded-full box-border z-[2]"
                style={{
                  left: "var(--rail)",
                  top: "calc(var(--num) / 2)",
                  width: "14px",
                  height: "14px",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: isActive ? "#1E3A8A" : "#FFFFFF",
                  border: `2px solid ${isActive ? "#1E3A8A" : "#E5E5E5"}`,
                  transition: prefersReduced
                    ? "none"
                    : "background-color 600ms cubic-bezier(0.22, 1, 0.36, 1), border-color 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />

              {/* Big Number */}
              <span
                ref={(el) => {
                  numRefs.current[idx] = el;
                }}
                className="block font-bold leading-none select-none"
                style={{
                  fontSize: "var(--num)",
                  color: isActive ? "#1E3A8A" : "rgba(10, 10, 10, 0.18)",
                  transition: prefersReduced
                    ? "none"
                    : "color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {stepNumber}
              </span>

              {/* Title & Description */}
              <div
                className="mt-3"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform:
                    isActive || prefersReduced
                      ? "translateY(0)"
                      : "translateY(16px)",
                  transition: prefersReduced
                    ? "none"
                    : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <h3 className="font-bold text-[#0A0A0A] text-[18px] lg:text-[22px] leading-[1.25] tracking-[-0.01em] mb-2">
                  {step.name}
                </h3>
                {step.text && (
                  <p className="text-[14px] lg:text-[16px] text-[#6B7280] leading-[1.65] max-w-[580px]">
                    {step.text}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <style>{`
        .onestep-rail-list {
          --rail: 24px;
          --col: 64px;
          --num: clamp(44px, 12vw, 56px);
        }
        @media (min-width: 1024px) {
          .onestep-rail-list {
            --num: clamp(54px, 4.5vw, 68px);
          }
        }
        .onestep-rail-item {
          padding-left: var(--col);
          padding-bottom: 52px;
        }
        @media (min-width: 1024px) {
          .onestep-rail-item {
            padding-bottom: 68px;
          }
        }
        .onestep-rail-item:last-child {
          padding-bottom: 0;
        }
        .onestep-rail-item:not(:last-child)::before {
          content: "";
          position: absolute;
          left: var(--rail);
          top: calc(var(--num) / 2);
          width: 2px;
          height: 100%;
          transform: translateX(-50%);
          background-color: #E5E5E5;
          z-index: 1;
        }
        .onestep-rail-item:not(:last-child)::after {
          content: "";
          position: absolute;
          left: var(--rail);
          top: calc(var(--num) / 2);
          width: 2px;
          height: 100%;
          transform: translateX(-50%) scaleY(var(--seg, 0));
          transform-origin: 50% 0;
          background-color: #1E3A8A;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};
