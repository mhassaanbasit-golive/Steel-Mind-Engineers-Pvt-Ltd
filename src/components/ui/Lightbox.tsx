import React, { useEffect, useCallback } from "react";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

export interface LightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => {
      startScroll();
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      className="fixed inset-0 z-[400] bg-[var(--blue)]/96 backdrop-blur-md flex flex-col items-center justify-between p-6 select-none"
      data-lenis-prevent=""
    >
      {/* Top Header with Close */}
      <div className="w-full flex items-center justify-between text-white/80">
        <span className="text-[12px] lg:text-[13px] font-medium">Steel Mind Engineers</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-11 h-11 flex items-center justify-center text-white hover:text-white/70 transition-colors cursor-pointer"
        >
          {/* Thin 22px cross */}
          <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-4">
        {/* Left Arrow (Desktop) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="hidden lg:flex absolute left-4 z-10 w-12 h-12 items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain transition-opacity duration-300"
        />

        {/* Right Arrow (Desktop) */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="hidden lg:flex absolute right-4 z-10 w-12 h-12 items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="text-[12px] text-white/70 tracking-widest uppercase">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};
