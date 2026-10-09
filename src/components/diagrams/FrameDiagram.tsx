import React from "react";

export interface FrameDiagramProps {
  type: string;
  className?: string;
}

export const FrameDiagram: React.FC<FrameDiagramProps> = ({ type, className = "" }) => {
  const norm = type.toLowerCase();

  const renderFrameGeometry = () => {
    // 1. Clear Span (CS)
    if (norm.includes("clear span") && !norm.includes("multi-gable")) {
      return (
        <>
          <line x1="160" y1="76" x2="160" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 2. Lean-To (LT)
    if (norm.includes("lean-to")) {
      return (
        <>
          {/* Main wall column */}
          <line x1="176" y1="200" x2="176" y2="90" stroke="var(--grey)" strokeWidth="3" strokeLinecap="square" />
          {/* Lean-to column and rafter */}
          <line x1="48" y1="200" x2="48" y2="140" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="48" y1="140" x2="176" y2="110" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
        </>
      );
    }

    // 3. Mono Slope (MS)
    if (norm.includes("mono slope") && !norm.includes("multi-span")) {
      return (
        <>
          <line x1="48" y1="200" x2="48" y2="96" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="272" y1="200" x2="272" y2="140" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="48" y1="96" x2="272" y2="140" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
        </>
      );
    }

    // 4. Mono Slope Multi-Span 1
    if (norm.includes("mono slope") && norm.includes("multi-span")) {
      return (
        <>
          <line x1="40" y1="200" x2="40" y2="92" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="176" y1="200" x2="176" y2="116" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="280" y1="200" x2="280" y2="140" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="40" y1="92" x2="280" y2="140" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
        </>
      );
    }

    // 5. Multi-Gable (Clear Span and Multi-Span 1)
    if (norm.includes("clear span and multi-span 1") || (norm.includes("multi-gable") && norm.includes("clear span"))) {
      return (
        <>
          <line x1="108" y1="80" x2="108" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="202" y1="100" x2="202" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="254" y1="100" x2="254" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Columns */}
          <line x1="40" y1="200" x2="40" y2="128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="176" y1="200" x2="176" y2="128" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="228" y1="200" x2="228" y2="128" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="280" y1="200" x2="280" y2="128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          {/* Rafters */}
          <path d="M 40 128 L 108 80 L 176 128 L 202 100 L 228 128 L 254 100 L 280 128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 6. Multi-Gable (MG)
    if (norm.includes("multi-gable")) {
      return (
        <>
          <line x1="40" y1="200" x2="40" y2="130" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="120" y1="200" x2="120" y2="130" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="200" y1="200" x2="200" y2="130" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="280" y1="200" x2="280" y2="130" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <path d="M 40 130 L 80 96 L 120 130 L 160 96 L 200 130 L 240 96 L 280 130" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 7. Multi-Span 1 (MS-1)
    if (norm.includes("multi-span 1") || norm.includes("ms-1")) {
      return (
        <>
          <line x1="100" y1="84" x2="100" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="220" y1="84" x2="220" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="200" x2="40" y2="124" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="160" y1="200" x2="160" y2="124" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="280" y1="200" x2="280" y2="124" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <path d="M 40 124 L 100 84 L 160 124 L 220 84 L 280 124" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 8. Multi-Span 2 (MS-2)
    if (norm.includes("multi-span 2") || norm.includes("ms-2")) {
      return (
        <>
          <line x1="32" y1="200" x2="32" y2="128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="128" y1="200" x2="128" y2="128" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="224" y1="200" x2="224" y2="128" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="304" y1="200" x2="304" y2="128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <path d="M 32 128 L 80 94 L 128 128 L 176 94 L 224 128 L 264 94 L 304 128" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 9. Multi-Span 3 (MS-3)
    if (norm.includes("multi-span 3") || norm.includes("ms-3")) {
      return (
        <>
          <line x1="24" y1="200" x2="24" y2="132" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <line x1="98" y1="200" x2="98" y2="132" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="172" y1="200" x2="172" y2="132" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="246" y1="200" x2="246" y2="132" stroke="var(--blue)" strokeWidth="2" strokeLinecap="square" />
          <line x1="296" y1="200" x2="296" y2="132" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" />
          <path d="M 24 132 L 61 104 L 98 132 L 135 104 L 172 132 L 209 104 L 246 132 L 271 104 L 296 132" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // 10. Roof System (RS)
    if (norm.includes("roof system") || norm.includes("rs")) {
      return (
        <>
          <line x1="160" y1="80" x2="160" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Two hollow walls */}
          <rect x="24" y="120" width="32" height="80" stroke="var(--grey)" strokeWidth="1" fill="rgba(107,114,128,0.12)" />
          <rect x="264" y="120" width="32" height="80" stroke="var(--grey)" strokeWidth="1" fill="rgba(107,114,128,0.12)" />
          {/* Steel rafters */}
          <path d="M 56 120 L 160 80 L 264 120" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
        </>
      );
    }

    // Default fallback: Clear Span
    return (
      <>
        <line x1="160" y1="76" x2="160" y2="200" stroke="var(--grey)" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200" stroke="var(--blue)" strokeWidth="3" strokeLinecap="square" fill="none" />
      </>
    );
  };

  return (
    <svg
      role="img"
      aria-label={type}
      viewBox="0 0 320 240"
      className={`w-full aspect-[4/3] bg-[var(--offwhite)] ${className}`}
    >
      {/* Ground Line at y=200 */}
      <line x1="16" y1="200" x2="304" y2="200" stroke="var(--grey)" strokeWidth="1" />

      {/* Frame Geometry */}
      {renderFrameGeometry()}

      {/* Dimension Line at y=222 */}
      <line x1="24" y1="222" x2="296" y2="222" stroke="var(--ink)" strokeWidth="1" />
      <line x1="24" y1="219" x2="24" y2="225" stroke="var(--ink)" strokeWidth="1" />
      <line x1="296" y1="219" x2="296" y2="225" stroke="var(--ink)" strokeWidth="1" />
    </svg>
  );
};
