import React from "react";

export interface SplitHeadingProps {
  as?: "h1" | "h2" | "h3";
  children: string;
  className?: string;
  id?: string;
}

export const SplitHeading: React.FC<SplitHeadingProps> = ({
  as: Component = "h2",
  children,
  className = "",
  id,
}) => {
  return (
    <Component id={id} className={className} data-split="">
      {children}
    </Component>
  );
};
