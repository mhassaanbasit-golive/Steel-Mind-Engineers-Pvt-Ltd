import React from "react";

export interface DefItem {
  name: string;
  text: string;
}

export interface DefListProps {
  items: DefItem[];
  className?: string;
}

export const DefList: React.FC<DefListProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`border-t border-[var(--line)] divide-y divide-[var(--line)] border-b my-8 ${className}`}
      data-reveal-group=""
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="py-5 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-8 items-baseline"
          data-reveal=""
        >
          <dt className="lg:col-span-4 text-[17px] font-semibold text-[var(--ink)]">
            {item.name}
          </dt>
          <dd className="lg:col-span-8 text-[16px] leading-[1.65] text-[var(--grey)]">
            {item.text}
          </dd>
        </div>
      ))}
    </div>
  );
};
