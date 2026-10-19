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
  marginBottom?: string;
}

export const StackCards: React.FC<StackCardsProps> = ({
  cards,
  className = "",
  dotRail,
  marginBottom = "38svh",
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

    // Card i scrubs down when card i+1 approaches
    for (let i = 0; i < cards.length - 1; i++) {
      const nextCard = cardRefs.current[i + 1];
      const currentInner = innerRefs.current[i];
      const currentOverlay = overlayRefs.current[i];

      if (nextCard && currentInner) {
        const tr = ScrollTrigger.create({
          trigger: nextCard,
          start: "top bottom",
          end: "top top",
          scrub: 1.4,
          onUpdate: (self) => {
            const p = self.progress;
            const scale = 1 - 0.05 * p;
            const y = -12 * p;
            currentInner.style.transform = `scale(${scale}) translateY(${y}px)`;
            if (currentOverlay) {
              currentOverlay.style.opacity = String(0.32 * p);
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
      <div className="w-full flex flex-col">
        {cards.map((card, i) => {
          const isLast = i === cards.length - 1;

          return (
            <div
              key={card.id || i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="sticky w-full"
              style={{
                top: `calc(var(--nav-offset, 80px) + 12px + ${i * 10}px)`,
                marginBottom: isLast ? "0svh" : undefined,
                zIndex: i + 1,
              }}
            >
              <div
                className="w-full"
                style={{
                  marginBottom: isLast ? "0" : marginBottom,
                }}
              >
                <div
                  ref={(el) => {
                    innerRefs.current[i] = el;
                  }}
                  className="relative w-full overflow-hidden will-change-transform"
                  style={{
                    transformOrigin: "center top",
                  }}
                >
                  {card.content}

                  {/* Dark overlay for stacking dim effect */}
                  {!isLast && (
                    <div
                      ref={(el) => {
                        overlayRefs.current[i] = el;
                      }}
                      className="absolute inset-0 bg-[#0A0A0A] pointer-events-none opacity-0"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
