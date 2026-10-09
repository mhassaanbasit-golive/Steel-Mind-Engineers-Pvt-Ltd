import React from "react";
import { Link } from "react-router-dom";
import { UI } from "../data/ui.ts";

export const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <span className="text-[14px] uppercase font-semibold text-[var(--grey)] tracking-[0.12em] mb-3">
        404
      </span>
      <h1 className="text-[32px] lg:text-[44px] font-bold text-[var(--ink)] mb-4">
        {UI.notFoundTitle}
      </h1>
      <p className="text-[16px] text-[var(--grey)] max-w-[480px] mb-8">
        {UI.notFoundBody}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-glossy text-white text-[13px] uppercase font-semibold tracking-[0.05em] hover:brightness-110 transition-all"
        >
          Homepage
        </Link>
        <Link
          to="/services/"
          className="px-6 py-3 border border-[var(--blue)] text-[var(--blue)] text-[13px] uppercase font-semibold tracking-[0.05em] hover:bg-blue-glossy hover:text-white transition-all"
        >
          Services
        </Link>
        <Link
          to="/projects/"
          className="px-6 py-3 border border-[var(--blue)] text-[var(--blue)] text-[13px] uppercase font-semibold tracking-[0.05em] hover:bg-blue-glossy hover:text-white transition-all"
        >
          Our Projects
        </Link>
      </div>
    </div>
  );
};
