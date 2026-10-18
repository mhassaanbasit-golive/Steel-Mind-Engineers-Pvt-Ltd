import React, { useRef, useEffect } from "react";
import { Reveal } from "../../lib/motion.ts";
import { cld } from "../../lib/cld.ts";

export interface PhotoBoxProps {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  noScale?: boolean;
}

export const PhotoBox: React.FC<PhotoBoxProps> = ({
  src,
  alt,
  ratio = "16/9",
  className = "",
  priority = false,
  noScale = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      Reveal.Image(containerRef.current, { noScale });
    }
  }, [noScale]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[rgba(15,23,42,0.06)] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={cld(src, 1920)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="w-full h-full object-cover"
        style={{ objectPosition: "center" }}
      />
    </div>
  );
};
