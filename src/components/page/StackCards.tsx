import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

export interface StackCardItem {
  id: string | number;
  content: React.ReactNode;
}

export interface StackCardsProps {
  cards: StackCardItem[];
  className?: string;
  dotRail?: React.ReactNode;
}

export const StackCards: React.FC<StackCardsProps> = ({
  cards,
  className = "",
  dotRail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // Compute nav offset dynamically
    const getNavOffset = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-offset");
      const parsed = parseInt(raw || "60", 10);
      return isNaN(parsed) ? 60 : parsed;
    };

    // Scrub (1.4) inner wrapper of card i to scale(.95) and overlay to opacity .32 as nextCard rises
    for (let i = 0; i < cards.length - 1; i++) {
      const nextCard = cardRefs.current[i + 1];
      const currentInner = innerRefs.current[i];
      const currentOverlay = overlayRefs.current[i];

      if (nextCard && currentInner) {
        const nextStickyTop = getNavOffset() + 12 + (i + 1) * 10;

        const tr = ScrollTrigger.create({
          trigger: nextCard,
          start: "top 85%",
          end: `top ${nextStickyTop}px`,
          scrub: 1.4,
          onUpdate: (self) => {
            const p = self.progress;
            const scale = 1 - 0.05 * p; // scale down to 0.95
            const y = -12 * p;
            currentInner.style.transform = `scale(${scale}) translateY(${y}px)`;
            if (currentOverlay) {
              currentOverlay.style.opacity = String(0.32 * p); // dark overlay to opacity .32
            }
          },
        });
        triggers.push(tr);
      }
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [cards.length, reducedMotion]);

  return (
    <div ref={containerRef} className={`stack-cards relative w-full ${className}`}>
      {dotRail && (
        <div className="hidden lg:block sticky top-[45vh] right-0 float-right z-30 ml-4">
          {dotRail}
        </div>
      )}
      <div className="w-full flex flex-col items-center">
        {cards.map((card, i) => {
          const isLast = i === cards.length - 1;

          return (
            <div
              key={card.id || i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="sticky w-full rounded-none"
              style={{
                top: `calc(var(--nav-offset, 60px) + 12px + ${i * 10}px)`,
                marginBottom: isLast ? "0svh" : "14svh",
                zIndex: i + 1,
              }}
            >
              <div
                ref={(el) => {
                  innerRefs.current[i] = el;
                }}
                className="relative w-full overflow-hidden transition-transform will-change-transform bg-white rounded-none border-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                style={{
                  transformOrigin: "center top",
                }}
              >
                {card.content}

                {/* Dark overlay for slow scrub stacking dim effect (max 0.32) */}
                {!isLast && (
                  <div
                    ref={(el) => {
                      overlayRefs.current[i] = el;
                    }}
                    className="absolute inset-0 bg-[#0A0A0A] pointer-events-none opacity-0 transition-opacity rounded-none"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
