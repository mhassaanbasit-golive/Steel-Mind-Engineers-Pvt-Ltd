import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface NextBandProps {
  heading?: string;
  nextUrl: string;
  nextTitle: string;
  className?: string;
}

export const NextBand: React.FC<NextBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
  className = "",
}) => {
  const descriptiveHeading = heading || `Explore ${nextTitle}`;

  return (
    <section className={`next-band ${className}`.trim()}>
      <div className="next-band-inner">
        <div className="next-band-label">NEXT</div>
        <h2 className="next-band-heading">{descriptiveHeading}</h2>
        <TransitionLink className="next-band-link" to={nextUrl}>
          {nextTitle}
          <span className="next-band-arrow">→</span>
        </TransitionLink>
      </div>
    </section>
  );
};
