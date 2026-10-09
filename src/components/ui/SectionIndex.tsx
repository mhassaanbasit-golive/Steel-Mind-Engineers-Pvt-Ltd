import React, { useEffect, useState, useRef } from "react";
import { lenis } from "../../lib/lenis.ts";

export interface SectionIndexProps {
  sections: Array<{ id: string; title: string }>;
  className?: string;
}

export const SectionIndex: React.FC<SectionIndexProps> = ({
  sections,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections.length < 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 3) return null;

  const handleChipClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (!targetEl) return;

    const headerHeight = window.innerWidth >= 1024 ? 88 : 64;
    const totalOffset = -(headerHeight + 48);

    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: totalOffset, duration: 1.2 });
    } else {
      const top = targetEl.getBoundingClientRect().top + window.scrollY + totalOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={chipsContainerRef}
      className={`sticky top-[var(--header-h)] z-40 bg-white border-b border-[var(--line)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] flex space-x-2">
        {sections.map(({ id, title }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleChipClick(e, id)}
              className={`relative flex-shrink-0 h-[48px] flex items-center px-4 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? "text-[var(--ink)] font-semibold" : "text-[var(--grey)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{title}</span>
              {isActive && (
                <span
                  style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
                  className="absolute bottom-0 inset-x-2 h-[2px]"
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};
