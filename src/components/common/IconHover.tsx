import React, { useRef, useImperativeHandle, forwardRef } from "react";

export interface IconHoverHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface IconHoverProps {
  children: React.ReactNode;
  className?: string;
  onHover?: () => void;
  onLeave?: () => void;
}

export const IconHover = forwardRef<IconHoverHandle, IconHoverProps>(
  ({ children, className = "", onHover, onLeave }, ref) => {
    const isAnimatingRef = useRef(false);
    const wrapperRef = useRef<HTMLSpanElement>(null);

    const startAnimation = () => {
      isAnimatingRef.current = true;
      if (wrapperRef.current) {
        wrapperRef.current.classList.add("icon-animating");
      }
      onHover?.();
    };

    const stopAnimation = () => {
      isAnimatingRef.current = false;
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove("icon-animating");
      }
      onLeave?.();
    };

    useImperativeHandle(ref, () => ({
      startAnimation,
      stopAnimation,
    }));

    return (
      <span
        ref={wrapperRef}
        className={`icon-hover inline-flex items-center justify-center transition-transform duration-300 ${className}`}
        onPointerEnter={startAnimation}
        onPointerLeave={stopAnimation}
        onFocus={startAnimation}
        onBlur={stopAnimation}
        onPointerDown={startAnimation}
      >
        {children}
      </span>
    );
  }
);

IconHover.displayName = "IconHover";
