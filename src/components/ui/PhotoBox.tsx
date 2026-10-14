import React, { useState } from "react";
import { cl } from "../../data/images.ts";

export interface PhotoBoxProps {
  src?: string;
  alt: string;
  aspectRatio?: "3 / 2" | "16 / 9" | string;
  width?: number;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "auto";
  style?: React.CSSProperties;
}

export const PhotoBox: React.FC<PhotoBoxProps> = ({
  src,
  alt,
  aspectRatio = "3 / 2",
  width = 1400,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  style = {},
}) => {
  const [hasError, setHasError] = useState(false);

  const finalSrc = src ? cl(src, width) : "";
  const showImage = Boolean(finalSrc && !hasError);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0F172A] ${className}`}
      style={{
        aspectRatio,
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={finalSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center block"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
      )}
    </div>
  );
};
