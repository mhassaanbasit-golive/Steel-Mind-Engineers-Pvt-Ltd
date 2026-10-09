import React from "react";

export interface MaskRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`overflow-hidden relative ${className}`} data-img-reveal="">
      {children}
    </div>
  );
};
