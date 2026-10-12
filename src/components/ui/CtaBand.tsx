import React from "react";
import { QuoteBand, QuoteBandProps } from "./QuoteBand.tsx";

export interface CtaBandProps extends QuoteBandProps {
  className?: string;
}

export const CtaBand: React.FC<CtaBandProps> = ({
  title,
  description,
  className = "",
}) => {
  return (
    <QuoteBand
      title={title}
      description={description}
      className={className}
    />
  );
};
