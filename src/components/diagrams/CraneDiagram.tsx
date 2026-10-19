import React, { useRef, useEffect, useState } from "react";

export interface CraneDiagramProps {
  type: string;
  className?: string;
  animate?: boolean;
}

export const CraneDiagram: React.FC<CraneDiagramProps> = ({
  type,
  className = "",
  animate = true,
}) => {
  const norm = type.toLowerCase();
  const svgRef = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setInView(true);
      return;
    }

    const el = svgRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  const pathStyle: React.CSSProperties = {
    strokeDasharray: 800,
    strokeDashoffset: inView ? 0 : 800,
    transition: "stroke-dashoffset 1400ms cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const rectStyle: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transition: "opacity 500ms ease 700ms",
  };

  const renderCraneGeometry = () => {
    // 1. Jib and monorail
    if (norm.includes("jib") || norm.includes("monorail")) {
      return (
        <>
          {/* Base Frame */}
          <path
            d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200"
            stroke="var(--blue)"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            style={pathStyle}
          />
          {/* Horizontal Jib 60px from column with hook */}
          <line
            x1="48"
            y1="130"
            x2="108"
            y2="130"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          <line
            x1="108"
            y1="130"
            x2="108"
            y2="145"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
          {/* Monorail: line y=112 from 140 to 260 with 10x8 rect */}
          <line
            x1="140"
            y1="112"
            x2="260"
            y2="112"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          <rect
            x="195"
            y="112"
            width="10"
            height="8"
            fill="var(--ink)"
            style={rectStyle}
          />
          <line
            x1="200"
            y1="120"
            x2="200"
            y2="132"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
        </>
      );
    }

    // 2. Semi-gantry
    if (norm.includes("semi-gantry") || norm.includes("semi gantry")) {
      return (
        <>
          {/* Base Frame */}
          <path
            d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200"
            stroke="var(--blue)"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            style={pathStyle}
          />
          {/* Crane beam y=132 from 48 to 224, Leg (224,132) -> (224,200) */}
          <line
            x1="48"
            y1="132"
            x2="224"
            y2="132"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          <line
            x1="224"
            y1="132"
            x2="224"
            y2="200"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          {/* Trolley 14x8 on beam and hook */}
          <rect
            x="130"
            y="126"
            width="14"
            height="8"
            fill="var(--ink)"
            style={rectStyle}
          />
          <line
            x1="137"
            y1="134"
            x2="137"
            y2="148"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
        </>
      );
    }

    // 4. Top-running, two bays
    if (
      norm.includes("two bay") ||
      norm.includes("two-bay") ||
      (norm.includes("top-running") && norm.includes("multi-span"))
    ) {
      return (
        <>
          {/* Two-bay frame */}
          <line
            x1="40"
            y1="200"
            x2="40"
            y2="124"
            stroke="var(--blue)"
            strokeWidth="3"
            style={pathStyle}
          />
          <line
            x1="160"
            y1="200"
            x2="160"
            y2="124"
            stroke="var(--blue)"
            strokeWidth="2"
            style={pathStyle}
          />
          <line
            x1="280"
            y1="200"
            x2="280"
            y2="124"
            stroke="var(--blue)"
            strokeWidth="3"
            style={pathStyle}
          />
          <path
            d="M 40 124 L 100 84 L 160 124 L 220 84 L 280 124"
            stroke="var(--blue)"
            strokeWidth="3"
            fill="none"
            style={pathStyle}
          />
          {/* Two bridge beams y=130 */}
          <line
            x1="40"
            y1="130"
            x2="160"
            y2="130"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          <line
            x1="160"
            y1="130"
            x2="280"
            y2="130"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          {/* Trolley in each bay */}
          <rect
            x="94"
            y="124"
            width="12"
            height="7"
            fill="var(--ink)"
            style={rectStyle}
          />
          <line
            x1="100"
            y1="131"
            x2="100"
            y2="144"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
          <rect
            x="214"
            y="124"
            width="12"
            height="7"
            fill="var(--ink)"
            style={rectStyle}
          />
          <line
            x1="220"
            y1="131"
            x2="220"
            y2="144"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
        </>
      );
    }

    // 5. Underhung
    if (norm.includes("underhung")) {
      return (
        <>
          {/* Base Frame */}
          <path
            d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200"
            stroke="var(--blue)"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            style={pathStyle}
          />
          {/* Short verticals hung from rafters */}
          <line
            x1="100"
            y1="98"
            x2="100"
            y2="104"
            stroke="var(--ink)"
            strokeWidth="2"
            style={pathStyle}
          />
          <line
            x1="220"
            y1="98"
            x2="220"
            y2="104"
            stroke="var(--ink)"
            strokeWidth="2"
            style={pathStyle}
          />
          {/* Bridge beam y=104 */}
          <line
            x1="88"
            y1="104"
            x2="232"
            y2="104"
            stroke="var(--ink)"
            strokeWidth="3"
            style={pathStyle}
          />
          {/* Trolley and hook */}
          <rect
            x="153"
            y="104"
            width="14"
            height="8"
            fill="var(--ink)"
            style={rectStyle}
          />
          <line
            x1="160"
            y1="112"
            x2="160"
            y2="128"
            stroke="var(--ink)"
            strokeWidth="1.5"
            style={pathStyle}
          />
        </>
      );
    }

    // 3. Top-running, one bay (Default)
    return (
      <>
        {/* Base Frame */}
        <path
          d="M 48 200 L 48 120 L 160 76 L 272 120 L 272 200"
          stroke="var(--blue)"
          strokeWidth="3"
          strokeLinecap="square"
          fill="none"
          style={pathStyle}
        />
        {/* Crane brackets on both columns at y=136 (10px horizontals) */}
        <line
          x1="48"
          y1="136"
          x2="58"
          y2="136"
          stroke="var(--ink)"
          strokeWidth="2.5"
          style={pathStyle}
        />
        <line
          x1="262"
          y1="136"
          x2="272"
          y2="136"
          stroke="var(--ink)"
          strokeWidth="2.5"
          style={pathStyle}
        />
        {/* Bridge beam y=130 across full width */}
        <line
          x1="56"
          y1="130"
          x2="264"
          y2="130"
          stroke="var(--ink)"
          strokeWidth="3"
          style={pathStyle}
        />
        {/* Trolley + hook centered */}
        <rect
          x="153"
          y="124"
          width="14"
          height="8"
          fill="var(--ink)"
          style={rectStyle}
        />
        <line
          x1="160"
          y1="132"
          x2="160"
          y2="146"
          stroke="var(--ink)"
          strokeWidth="1.5"
          style={pathStyle}
        />
      </>
    );
  };

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={type}
      viewBox="0 0 320 240"
      className={`w-full h-auto block static bg-white ${className}`}
    >
      {/* Ground Line */}
      <line
        x1="16"
        y1="200"
        x2="304"
        y2="200"
        stroke="var(--blue)"
        strokeWidth="1"
        style={pathStyle}
      />
      {/* Crane Geometry */}
      {renderCraneGeometry()}
      {/* Dimension Line */}
      <line
        x1="24"
        y1="222"
        x2="296"
        y2="222"
        stroke="var(--ink)"
        strokeWidth="1"
        style={pathStyle}
      />
      <line
        x1="24"
        y1="219"
        x2="24"
        y2="225"
        stroke="var(--ink)"
        strokeWidth="1"
        style={pathStyle}
      />
      <line
        x1="296"
        y1="219"
        x2="296"
        y2="225"
        stroke="var(--ink)"
        strokeWidth="1"
        style={pathStyle}
      />
    </svg>
  );
};

