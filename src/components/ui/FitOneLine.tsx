import React, { useRef, useState, useEffect } from "react";

export interface FitOneLineProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  initialClamp?: string;
  minFontSize?: number;
  ariaLabel?: string;
}

export const FitOneLine: React.FC<FitOneLineProps> = ({
  children,
  className = "",
  style = {},
  as: Component = "h2",
  initialClamp = "clamp(18px, 6vw, 30px)",
  minFontSize = 16,
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fit = () => {
      // Temporarily clear inline font-size to compute base clamped font-size
      el.style.fontSize = "";
      const computed = parseFloat(window.getComputedStyle(el).fontSize) || 24;
      let currentSize = computed;

      // Shrink by 0.5px until scrollWidth <= clientWidth or reached minFontSize
      while (el.scrollWidth > el.clientWidth && currentSize > minFontSize) {
        currentSize -= 0.5;
        el.style.fontSize = `${currentSize}px`;
      }
      setFontSize(currentSize);
    };

    fit();
    window.addEventListener("resize", fit);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", fit);
    };
  }, [minFontSize]);

  return (
    <Component
      ref={containerRef as any}
      aria-label={ariaLabel}
      className={className}
      style={{
        whiteSpace: "nowrap",
        fontSize: fontSize ? `${fontSize}px` : initialClamp,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
