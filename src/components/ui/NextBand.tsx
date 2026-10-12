import React from "react";
import { Link } from "react-router-dom";

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
        <Link className="next-band-link" to={nextUrl}>
          {nextTitle}
          <span className="next-band-arrow">→</span>
        </Link>
      </div>
    </section>
  );
};
