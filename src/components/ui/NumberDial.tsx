import React from "react";

export interface NumberDialProps {
  value: number;
  suffix?: string;
  format?: boolean;
  className?: string;
}

export const NumberDial: React.FC<NumberDialProps> = ({
  value,
  suffix = "",
  format = true,
  className = "",
}) => {
  return (
    <span
      className={className}
      data-count=""
      data-to={value}
      data-suffix={suffix}
      data-format={format ? "true" : "false"}
    >
      0{suffix}
    </span>
  );
};
