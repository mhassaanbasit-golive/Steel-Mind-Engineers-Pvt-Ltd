import React from "react";
import { UI } from "../data/ui.ts";
import { Button } from "../components/ui/Button.tsx";

export const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-[calc(var(--header-h)+48px)] pb-24 bg-white">
      <span className="text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
        404
      </span>
      <h1 className="text-[22px] lg:text-[38px] font-semibold text-[var(--ink)] leading-[1.15] mb-4">
        {UI.notFoundTitle}
      </h1>
      <p className="text-[13px] lg:text-[15px] leading-[1.6] text-[var(--grey)] max-w-[480px] mb-8">
        {UI.notFoundBody}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          size="sm"
          variant="primary"
          href="/"
          className="w-auto min-w-[130px]"
        >
          Homepage
        </Button>
        <Button
          size="sm"
          variant="secondary"
          href="/services/"
          className="w-auto min-w-[130px]"
        >
          Services
        </Button>
        <Button
          size="sm"
          variant="secondary"
          href="/projects/"
          className="w-auto min-w-[130px]"
        >
          Our Projects
        </Button>
      </div>
    </div>
  );
};
