import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "../components/ui/TransitionLink.tsx";
import { SITE } from "../data/site.ts";
import { Button } from "../components/ui/Button.tsx";
import { lenis } from "../lib/lenis.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";

// Content Files for Pages 2 through 5
import page2 from "../content/generated/page-02.json";
import page3 from "../content/generated/page-03.json";
import page4 from "../content/generated/page-04.json";
import page5 from "../content/generated/page-05.json";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "core-values", label: "Core Values" },
];

const DESKTOP_IMAGES = [
  {
    src: aboutImages.aboutUs.introSticky,
    alt: page2.alt || "About Steel Mind Engineers",
  },
  {
    src: aboutImages.aboutUs.visionSticky,
    alt: page3.alt || "Steel Mind Engineers Vision",
  },
  {
    src: aboutImages.aboutUs.missionSticky,
    alt: page4.alt || "Steel Mind Engineers Mission",
  },
  {
    src: "https://res.cloudinary.com/cyfb9slf/image/upload/v1791946941/corevalues-about.jpg",
    alt: page5.alt || "Steel Mind Engineers Core Values",
  },
];

export const AboutUs: React.FC = () => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  // Desktop active section: index 0 (Introduction) by default
  const [activeSection, setActiveSection] = useState<number>(0);
  const desktopSectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll to anchor on load / hash change
  useEffect(() => {
    const rawHash = window.location.hash.replace("#", "");
    const validIds = SECTIONS.map((s) => s.id);

    if (rawHash && validIds.includes(rawHash)) {
      const timer = setTimeout(() => {
        const isDesktop = window.innerWidth >= 1024;
        const targetId = isDesktop
          ? rawHash
          : document.getElementById(rawHash)
          ? rawHash
          : `${rawHash}-mobile`;
        const el =
          document.getElementById(targetId) ||
          document.getElementById(rawHash) ||
          document.getElementById(`${rawHash}-mobile`);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { offset: -32, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Desktop IntersectionObserver logic on the four text sections
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDesktop = () => window.innerWidth >= 1024;
    if (!checkDesktop()) return;

    const elements = desktopSectionRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    // Primary IntersectionObserver: middle line of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elements.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Passive scroll check for continuous syncing during scroll and fast scroll
    const handleScroll = () => {
      if (!checkDesktop()) return;
      const viewportCenter = window.innerHeight / 2;

      let matchedIdx = -1;
      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          matchedIdx = i;
          break;
        }
      }

      if (matchedIdx !== -1) {
        setActiveSection(matchedIdx);
      } else {
        const firstRect = elements[0].getBoundingClientRect();
        if (firstRect.top > viewportCenter) {
          setActiveSection(0);
        } else {
          const lastRect = elements[elements.length - 1].getBoundingClientRect();
          if (lastRect.bottom < viewportCenter) {
            setActiveSection(elements.length - 1);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  // Text motion styling helper
  const textMotion = (delayMs = 0): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: 1,
      transform: "translateY(0)",
      transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
    };
  };

  // Content extraction
  const p2WhoIsBlocks = page2.blocks.filter((b) => b.type === "p");
  const p2Paragraph1 = p2WhoIsBlocks[0]?.text || "";
  const p2Paragraph2 = p2WhoIsBlocks[1]?.text || "";

  const p3Pillars = [
    page3.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page3.blocks[idx - 1]?.type === "h2" &&
        (page3.blocks[idx - 1] as any)?.title === "What the Vision Means"
    )?.text || "",
    page3.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page3.blocks[idx - 1]?.type === "h2" &&
        (page3.blocks[idx - 1] as any)?.title ===
          "Why Long-Term Partnerships Matter"
    )?.text || "",
    page3.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page3.blocks[idx - 1]?.type === "h2" &&
        (page3.blocks[idx - 1] as any)?.title ===
          "How the Vision Shows in Daily Work"
    )?.text || "",
  ];

  const p4Defs = (page4.blocks.find((b) => b.type === "defs") as any)?.items || [
    {
      name: "Quality",
      text: "Material is checked on arrival, dimensions are checked after cutting and welds are inspected before painting.",
    },
    {
      name: "Safety",
      text: "Workers use certified protective equipment and follow written site rules that are explained before work starts.",
    },
    {
      name: "Efficiency",
      text: "Cutting plans reduce scrap, and parts are packed in erection order so that site crews do not lose time searching for steel.",
    },
  ];

  const p5Cards = [
    {
      num: "01",
      title: "Quality Fabrication",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Quality Fabrication"
        )?.text || "",
    },
    {
      num: "02",
      title: "Continuous Improvement",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Continuous Improvement"
        )?.text || "",
    },
    {
      num: "03",
      title: "Safety and Reliability",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Safety and Reliability"
        )?.text || "",
    },
    {
      num: "04",
      title: "How These Values Affect Your Project",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title ===
              "How These Values Affect Your Project"
        )?.text || "",
    },
  ];

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* Existing Hero Banner */}
      <SubpageHero
        title={page2.h1}
        image={aboutImages.aboutUs.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* DESKTOP VIEW (>= 1024px): 2-Column with Sticky Stacked Images */}
      {/* ========================================================= */}
      <div className="hidden lg:block w-full bg-white pt-[40px] pb-[100px]">
        <div className="max-w-[1050px] mx-auto">
          <div className="grid grid-cols-2 gap-[58px] items-stretch relative">
            {/* Left Column: Four Text Sections */}
            <div className="flex flex-col">
              {/* SECTION 0: ABOUT / INTRODUCTION */}
              <section
                id="introduction"
                ref={(el) => {
                  desktopSectionRefs.current[0] = el;
                }}
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full flex flex-col justify-center"
              >
                <h2
                  style={textMotion(0)}
                  className="text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]"
                >
                  {page2.h1}
                </h2>

                <div className="mt-[22px] space-y-[16px]">
                  <p
                    style={textMotion(90)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {page2.quickAnswer}
                  </p>
                  <p
                    style={textMotion(180)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {p2Paragraph1}
                  </p>
                  <p
                    style={textMotion(270)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {p2Paragraph2}
                  </p>
                </div>

                <div
                  style={textMotion(360)}
                  className="mt-[32px] flex items-center gap-4"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    href={SITE.profilePdf}
                    target="_blank"
                  >
                    Download Company Profile
                  </Button>

                  <Link
                    to="/contact-us/"
                    className="text-[13px] font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Get in touch</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                {/* Separator between About & Vision */}
                <div className="pt-[100px] pb-[100px]">
                  <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)]" />
                </div>
              </section>

              {/* SECTION 1: VISION */}
              <section
                id="vision"
                ref={(el) => {
                  desktopSectionRefs.current[1] = el;
                }}
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full flex flex-col justify-center"
              >
                <h2
                  style={textMotion(0)}
                  className="text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]"
                >
                  {page3.h1}
                </h2>

                <div className="mt-[22px] space-y-[16px]">
                  <p
                    style={textMotion(90)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {page3.quickAnswer}
                  </p>
                  <p
                    style={textMotion(180)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {p3Pillars[0]}
                  </p>
                  <p
                    style={textMotion(270)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {p3Pillars[1]}
                  </p>
                  <p
                    style={textMotion(360)}
                    className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                  >
                    {p3Pillars[2]}
                  </p>
                </div>

                {/* Separator between Vision & Mission */}
                <div className="pt-[100px] pb-[100px]">
                  <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)]" />
                </div>
              </section>

              {/* SECTION 2: MISSION */}
              <section
                id="mission"
                ref={(el) => {
                  desktopSectionRefs.current[2] = el;
                }}
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full flex flex-col justify-center"
              >
                <h2
                  style={textMotion(0)}
                  className="text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]"
                >
                  {page4.h1}
                </h2>

                <p
                  style={textMotion(90)}
                  className="text-[13px] leading-[1.65] text-[#0A0A0A] mt-[22px]"
                >
                  {page4.quickAnswer}
                </p>

                {/* 3 Points Stacked: Quality, Safety, Efficiency */}
                <div className="mt-[24px] space-y-[24px]">
                  {p4Defs.map((def: any, idx: number) => {
                    const numStr = `0${idx + 1}`;
                    return (
                      <div
                        key={def.name}
                        style={textMotion(180 + idx * 90)}
                        className="flex flex-col"
                      >
                        <span className="text-[17px] font-bold leading-[1.25] text-[var(--blue)]">
                          {numStr}
                        </span>
                        <h3 className="text-[17px] font-bold leading-[1.25] text-[#0A0A0A] mt-1">
                          {def.name}
                        </h3>
                        <p className="text-[13px] leading-[1.65] text-[#0A0A0A] mt-1.5">
                          {def.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Separator between Mission & Core Values */}
                <div className="pt-[100px] pb-[100px]">
                  <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)]" />
                </div>
              </section>

              {/* SECTION 3: CORE VALUES */}
              <section
                id="core-values"
                ref={(el) => {
                  desktopSectionRefs.current[3] = el;
                }}
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full flex flex-col justify-center"
              >
                <h2
                  style={textMotion(0)}
                  className="text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]"
                >
                  {page5.h1}
                </h2>

                <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)] my-6" />

                <p
                  style={textMotion(90)}
                  className="text-[13px] leading-[1.65] text-[#0A0A0A]"
                >
                  {page5.quickAnswer}
                </p>

                <div className="mt-[32px] space-y-[32px]">
                  {p5Cards.map((card, idx) => (
                    <div
                      key={card.title}
                      style={textMotion(160 + idx * 90)}
                      className="flex flex-col justify-start"
                    >
                      <div className="w-[25px] h-[1px] bg-[var(--blue)] mb-1.5" />
                      <span className="text-[17px] font-bold leading-[1.25] text-[var(--blue)]">
                        {card.num}
                      </span>
                      <div className="w-full h-[1px] bg-[rgba(30,58,138,0.12)] my-2.5" />
                      <h3 className="text-[17px] font-bold leading-[1.25] text-[#0A0A0A]">
                        {card.title}
                      </h3>
                      <p className="text-[13px] leading-[1.65] text-[#0A0A0A] mt-1.5">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Sticky container with four crossfading images */}
            <div className="relative w-full h-full">
              <div className="sticky top-[calc(var(--nav-h,88px)+24px)] w-full flex items-center justify-center">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "687 / 1024",
                    maxHeight: "calc(100vh - var(--nav-h, 88px) - 48px)",
                    overflow: "hidden",
                  }}
                >
                  {DESKTOP_IMAGES.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.src}
                      alt={img.alt}
                      loading={idx === 0 ? "eager" : "lazy"}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: activeSection === idx ? 1 : 0,
                        transition: "opacity 0.6s ease",
                        pointerEvents: activeSection === idx ? "auto" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE VIEW (< 1024px): Stacked Single-Column Layout      */}
      {/* ========================================================= */}
      <div className="block lg:hidden w-full bg-white pt-[40px] px-[22px]">
        {/* ROW 1: ABOUT */}
        <section
          id="introduction-mobile"
          style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
          className="w-full"
        >
          {/* Photo First */}
          <div
            style={{ aspectRatio: "687 / 1024" }}
            className="w-full overflow-hidden"
          >
            <img
              src={aboutImages.aboutUs.introSticky}
              alt={page2.alt || "About Steel Mind Engineers"}
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="mt-[40px]">
            <h2 className="text-[17px] sm:text-[19px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]">
              {page2.h1}
            </h2>

            <div className="mt-[22px] space-y-[16px]">
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {page2.quickAnswer}
              </p>
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {p2Paragraph1}
              </p>
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {p2Paragraph2}
              </p>
            </div>

            <div className="mt-[24px] flex flex-col items-stretch gap-3">
              <Button
                variant="secondary"
                size="sm"
                href={SITE.profilePdf}
                target="_blank"
              >
                Download Company Profile
              </Button>

              <Link
                to="/contact-us/"
                className="text-[13px] font-semibold text-[#1E3A8A] hover:underline inline-flex items-center justify-center gap-1.5 py-2"
              >
                <span>Get in touch</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Separator between About & Vision */}
        <div className="mt-[100px] mb-[60px]">
          <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)]" />
        </div>

        {/* ROW 2: VISION */}
        <section
          id="vision-mobile"
          style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
          className="w-full"
        >
          {/* Photo First */}
          <div
            style={{ aspectRatio: "687 / 1024" }}
            className="w-full overflow-hidden"
          >
            <img
              src={aboutImages.aboutUs.visionSticky}
              alt={page3.alt || "Steel Mind Engineers Vision"}
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="mt-[40px]">
            <h2 className="text-[17px] sm:text-[19px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]">
              {page3.h1}
            </h2>

            <div className="mt-[22px] space-y-[16px]">
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {page3.quickAnswer}
              </p>
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {p3Pillars[0]}
              </p>
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {p3Pillars[1]}
              </p>
              <p className="text-[12px] leading-[1.65] text-[#0A0A0A]">
                {p3Pillars[2]}
              </p>
            </div>
          </div>
        </section>

        {/* Separator between Vision & Mission */}
        <div className="mt-[100px] mb-[60px]">
          <div className="w-[33px] h-[1px] bg-[rgba(30,58,138,0.18)]" />
        </div>

        {/* ROW 3: MISSION */}
        <section
          id="mission-mobile"
          style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
          className="w-full"
        >
          {/* Photo First */}
          <div
            style={{ aspectRatio: "687 / 1024" }}
            className="w-full overflow-hidden"
          >
            <img
              src={aboutImages.aboutUs.missionSticky}
              alt={page4.alt || "Steel Mind Engineers Mission"}
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="mt-[40px]">
            <h2 className="text-[17px] sm:text-[19px] font-bold text-[#0A0A0A] uppercase leading-[1.22] tracking-[-0.01em]">
              {page4.h1}
            </h2>

            <p className="text-[12px] leading-[1.65] text-[#0A0A0A] mt-[22px]">
              {page4.quickAnswer}
            </p>

            <div className="mt-[28px] space-y-[28px]">
              {p4Defs.map((def: any, idx: number) => {
                const numStr = `0${idx + 1}`;
                return (
                  <div key={def.name} className="flex flex-col">
                    <span className="text-[15px] font-bold leading-[1.25] text-[var(--blue)]">
                      {numStr}
                    </span>
                    <h3 className="text-[15px] font-bold leading-[1.25] text-[#0A0A0A] mt-1">
                      {def.name}
                    </h3>
                    <p className="text-[12px] leading-[1.65] text-[#0A0A0A] mt-1.5">
                      {def.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 100px white space before Core Values band */}
        <div className="w-full h-[100px]" />
      </div>

      {/* SECTION 4: CORE VALUES (Royal Blue Band on Mobile) */}
      <section
        id="core-values-mobile"
        style={{
          backgroundColor: "var(--blue)",
          scrollMarginTop: "var(--nav-h, 88px)",
        }}
        className="block lg:hidden w-full bg-[var(--blue)] text-white py-[64px] px-[22px]"
      >
        <h2 className="text-[17px] sm:text-[19px] font-bold text-white uppercase leading-[1.22] tracking-[-0.01em]">
          {page5.h1}
        </h2>

        <div className="w-[33px] h-[1px] bg-white my-6" />

        <p className="text-[12px] leading-[1.65] text-white">
          {page5.quickAnswer}
        </p>

        <div className="space-y-[36px] mt-8">
          {p5Cards.map((card) => (
            <div key={card.title} className="flex flex-col justify-start">
              <div className="w-[25px] h-[1px] bg-white mb-2" />
              <span className="text-[15px] font-bold leading-[1.25] text-white">
                {card.num}
              </span>
              <div className="w-full h-[1px] bg-white/20 my-3" />
              <h3 className="text-[15px] font-bold leading-[1.25] text-white">
                {card.title}
              </h3>
              <p className="text-[12px] leading-[1.65] text-white mt-2">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Existing Next Banner to SME Policy */}
      <SubpageNextBanner
        heading="SME POLICY: QUALITY, HEALTH, SAFETY AND ENVIRONMENT AT STEEL MIND ENGINEERS"
        title="SME Policy"
        url="/about/sme-policy"
        image={aboutImages.aboutUs.nextSmePolicy}
        overlay={true}
      />
    </div>
  );
};
