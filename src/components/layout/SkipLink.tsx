import React from "react";
import { UI } from "../../data/ui.ts";

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[500] focus:px-4 focus:py-2 focus:bg-[var(--blue)] focus:text-white focus:font-semibold focus:outline-none"
    >
      {UI.skipToContent}
    </a>
  );
};
