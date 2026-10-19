import React, { useState } from "react";
import { Pic } from "../Pic.tsx";
import { TwoTone } from "./TwoTone.tsx";

export interface ImageAccordionItem {
  title: string;
  text: string;
  image: string;
  ratio?: number;
  alt?: string;
}

export interface ImageAccordionProps {
  items: ImageAccordionItem[];
  className?: string;
}

export const ImageAccordion: React.FC<ImageAccordionProps> = ({
  items,
  className = "",
}) => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className={`image-accordion w-full flex flex-col ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;

        return (
          <div
            key={idx}
            className="w-full flex flex-col border-b border-[rgba(15,23,42,0.12)] py-4"
          >
            {/* Full-bleed Pic */}
            <div className="w-full">
              <Pic
                src={item.image}
                alt={item.alt || item.title}
                ratio={item.ratio || 3 / 2}
                bleed={true}
                sizes="100vw"
                eager={idx === 0}
              />
            </div>

            {/* 64px row: Title left (20px TwoTone), Plus icon right (22px turns 45deg) */}
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="w-full min-h-[64px] flex items-center justify-between text-left cursor-pointer border-0 bg-transparent p-0 select-none"
              aria-expanded={isOpen}
            >
              <h3 className="text-[20px] font-[600] leading-[1.2] tracking-[-0.025em] pr-4">
                <TwoTone text={item.title} />
              </h3>

              <span className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0 text-[var(--ink)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>

            {/* Expandable text panel using grid-template-rows: 0fr -> 1fr */}
            <div
              className="grid transition-all"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
                transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-[15px] text-[var(--blue)] leading-[1.65]">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
