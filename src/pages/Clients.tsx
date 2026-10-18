// PART 11. CLIENTS PAGE — Banner + 10 Logos Centered
import React from "react";
import pageData from "../content/generated/page-65.json";
import { A } from "../data/assets.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";

const CLIENTS = [
  { name: "Haier", logo: A.clientLogo["Haier"] },
  { name: "Imperial Denim", logo: A.clientLogo["Imperial Denim"] },
  { name: "Moiz Steel", logo: A.clientLogo["Moiz Steel"] },
  { name: "Saif Engineers", logo: A.clientLogo["Saif Engineers"] },
  { name: "Dravton Dairy", logo: A.clientLogo["Dravton Dairy"] },
  { name: "Latifia Dairy", logo: A.clientLogo["Latifia Dairy"] },
  { name: "Maria B", logo: A.clientLogo["Maria B"] },
  { name: "Elite Stitching", logo: A.clientLogo["Elite Stitching"] },
  { name: "MAB", logo: A.clientLogo["MAB"] },
  { name: "Agha Waqar", logo: A.clientLogo["Agha Waqar"] },
];

export const Clients: React.FC = () => {
  return (
    <article className="w-full bg-white">
      {/* 1. Banner: Immersive Hero using existing team photo */}
      <HeroBand
        variant="immersive"
        imageSrc={A.team}
        imageAlt="Steel buildings built by Steel Mind Engineers for clients across Pakistan."
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* 2. Logos Section: Plain white bg, max-width 1100px, 2 cols mobile / 3 cols desktop, centered last row */}
      <section className="w-full bg-white py-[var(--sec-y-lg)]">
        <div className="w-full max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {CLIENTS.map((client, idx) => (
              <div
                key={client.name}
                data-reveal=""
                style={{ animationDelay: `${idx * 70}ms` }}
                className="w-[calc(50%-12px)] md:w-[calc(33.333%-32px)] aspect-[3/2] flex items-center justify-center p-4 transition-transform duration-350 ease-out hover:scale-105"
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={240}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="max-w-[62%] max-h-[56%] object-contain"
                  />
                ) : (
                  <span className="font-semibold text-[15px] text-[var(--ink)] tracking-tight">
                    {client.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
