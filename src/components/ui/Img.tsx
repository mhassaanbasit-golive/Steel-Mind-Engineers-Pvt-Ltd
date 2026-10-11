import React, { useState } from "react";
import { cl, srcSet } from "../../lib/cloudinary.ts";

export interface ImgProps {
  src: string;
  alt: string;
  ratio?: "4/5" | "16/9" | "4/3" | "9/16" | "1/1" | "21/9" | "5/6" | string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  parallax?: boolean | number;
  width?: number | string;
  height?: number | string;
  objectFit?: "cover" | "contain";
}

const ratioStyles: Record<string, string> = {
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "9/16": "aspect-[9/16]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "5/6": "aspect-[5/6]",
};

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  ratio = "4/3",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1080px",
  priority = false,
  className = "",
  parallax = false,
  width = 1200,
  height = 900,
  objectFit = "cover",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass = ratioStyles[ratio] || "";
  const responsiveSrcSet = src && !src.startsWith("/") ? srcSet(src) : undefined;
  const defaultSrc = src && !src.startsWith("/") ? cl(src, 1080) : src;
  const parallaxAttr = typeof parallax === "number" ? parallax : parallax ? 8 : undefined;

  // Extract clean filename for fallback
  const fileName = src ? src.split("/").pop()?.split("?")[0] || src : "image-missing";

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#E5E7EB] ${aspectClass} ${className}`}
      style={aspectClass ? undefined : { aspectRatio: ratio }}
      data-img-reveal=""
      data-parallax={parallaxAttr}
    >
      {/* Soft gray skeleton block before image loads */}
      {!loaded && !error && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#E5E7EB] animate-pulse z-0"
        />
      )}

      {!error && src ? (
        <img
          src={defaultSrc}
          srcSet={responsiveSrcSet || undefined}
          sizes={sizes}
          alt={alt || "Steel Mind Engineers"}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } transition-opacity duration-500 relative z-10 ${
            parallax ? "h-[116%] -top-[8%] absolute inset-x-0" : "h-full"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        /* Rule 5: If an image file is missing, show a gray box with the file name. Do not use other images. */
        <div className="w-full h-full min-h-[140px] bg-[#E5E7EB] text-[#4B5563] text-[11px] font-mono flex items-center justify-center p-4 text-center select-none border border-dashed border-[#D1D5DB]">
          <span>[{fileName}]</span>
        </div>
      )}
    </div>
  );
};
