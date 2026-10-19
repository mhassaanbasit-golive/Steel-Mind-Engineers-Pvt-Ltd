import React from "react";

export interface HubIntroProps {
  divisionTitle: string; // e.g. "PRE-ENGINEERED BUILDINGS"
  quickAnswer: string;
}

export const HubIntro: React.FC<HubIntroProps> = ({
  divisionTitle,
  quickAnswer,
}) => {
  return (
    <section className="w-full bg-[#FFFFFF] py-[64px] lg:py-[96px] px-[20px] lg:px-[40px]">
      <div className="max-w-[720px] mx-auto text-center flex flex-col items-center">
        {/* H2: Color #0A0A0A, Size 22px mobile / 48px desktop, Weight 700, Line-height 1.15, Letter-spacing -0.02em, Full opacity */}
        <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] text-center uppercase">
          {divisionTitle}
        </h2>

        {/* Body Paragraph: Color var(--blue), Size 14px mobile / 15px desktop, Weight 400, Line-height 1.7, Max-width 600px, Full opacity */}
        {quickAnswer && (
          <p className="mt-[20px] max-w-[600px] text-[14px] lg:text-[15px] font-normal text-[var(--blue)] leading-[1.7] text-center mx-auto">
            {quickAnswer}
          </p>
        )}
      </div>
    </section>
  );
};
