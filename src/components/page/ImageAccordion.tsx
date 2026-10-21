import React, { useState } from "react";
import { Pic } from "../Pic.tsx";

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

// Single Accordion Card for use inside StackCards or standalone
export const ImageAccordionCard: React.FC<{
  item: ImageAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  isFirst?: boolean;
}> = ({ item, isOpen, onToggle, isFirst = false }) => {
  return (
    <div className="w-full bg-white select-none rounded-none border-0 overflow-hidden">
      {/* Full-bleed Pic (3:2) edge to edge with straight corners */}
      <div className="w-full overflow-hidden bg-slate-900 rounded-none aspect-[3/2]">
        <Pic
          src={item.image}
          alt={item.alt || item.title}
          ratio={item.ratio || 3 / 2}
          bleed={false}
          eager={isFirst}
          className="w-full h-full block rounded-none"
        />
      </div>

      {/* 64px row: Title left (bold ink sentence case), Plus icon right (rotates 45deg) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full h-[64px] min-h-[64px] px-5 sm:px-6 flex items-center justify-between text-left cursor-pointer border-0 bg-white rounded-none select-none transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-[17px] font-bold text-[#0A0A0A] uppercase leading-snug pr-3">
          {item.title}
        </h3>

        <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

      {/* Expandable text panel using grid-template-rows: 0fr -> 1fr, 600ms */}
      <div
        className="grid overflow-hidden bg-white"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden px-5 sm:px-6">
          <p className="text-[15px] leading-[1.6] text-[#0A0A0A] font-normal pb-6">
            {item.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ImageAccordion: React.FC<ImageAccordionProps> = ({
  items,
  className = "",
}) => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className={`image-accordion w-full flex flex-col ${className}`}>
      {items.map((item, idx) => (
        <div key={idx} className="w-full rounded-none border-0">
          <ImageAccordionCard
            item={item}
            isOpen={openIdx === idx}
            onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            isFirst={idx === 0}
          />
        </div>
      ))}
    </div>
  );
};
