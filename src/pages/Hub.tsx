import React, { useState, useEffect, useRef, useMemo } from "react";
import { ContentData } from "../content/types.ts";
import { NAV } from "../data/nav.ts";
import { CONTENT_BY_URL } from "../content/index.ts";
import { divisionImages, cl } from "../data/images.ts";
import { TransitionLink } from "../components/ui/TransitionLink.tsx";

export interface HubProps {
  data: ContentData;
}

type DivisionKey = keyof typeof divisionImages;

const DIVISION_CONFIGS: Record<
  string,
  {
    key: DivisionKey;
    divisionTitle: string;
    nextHeading: string;
    nextUrl: string;
    nextTitle: string;
  }
> = {
  "/pre-engineered-buildings-pakistan/": {
    key: "pre-engineered-buildings",
    divisionTitle: "PRE-ENGINEERED BUILDINGS",
    nextHeading:
      "See the sheds Steel Mind Engineers builds for factories, farms, workshops and cranes.",
    nextUrl: "/industrial-sheds-pakistan/",
    nextTitle: "Industrial Sheds",
  },
  "/industrial-sheds-pakistan/": {
    key: "industrial-sheds",
    divisionTitle: "INDUSTRIAL SHEDS",
    nextHeading:
      "See the warehouses Steel Mind Engineers builds for storage, logistics and cold storage.",
    nextUrl: "/steel-warehouses-pakistan/",
    nextTitle: "Steel Warehouses",
  },
  "/steel-warehouses-pakistan/": {
    key: "steel-warehouses",
    divisionTitle: "STEEL WAREHOUSES",
    nextHeading:
      "See the structural steel Steel Mind Engineers fabricates for frames, trusses and bridges.",
    nextUrl: "/structural-steel-fabrication-pakistan/",
    nextTitle: "Structural Steel Fabrication",
  },
  "/structural-steel-fabrication-pakistan/": {
    key: "structural-steel-fabrication",
    divisionTitle: "STRUCTURAL STEEL FABRICATION",
    nextHeading:
      "See the custom steel items Steel Mind Engineers fabricates to your own drawings.",
    nextUrl: "/custom-steel-fabrication-pakistan/",
    nextTitle: "Custom Steel Fabrication",
  },
  "/custom-steel-fabrication-pakistan/": {
    key: "custom-steel-fabrication",
    divisionTitle: "CUSTOM STEEL FABRICATION",
    nextHeading:
      "See the seven services Steel Mind Engineers runs from design to after sale support.",
    nextUrl: "/services/",
    nextTitle: "Services",
  },
};

export const Hub: React.FC<HubProps> = ({ data }) => {
  const config = DIVISION_CONFIGS[data.url] || {
    key: "pre-engineered-buildings" as DivisionKey,
    divisionTitle: data.h1.split(":")[0]?.toUpperCase() || "DIVISION",
    nextHeading:
      "See the sheds Steel Mind Engineers builds for factories, farms, workshops and cranes.",
    nextUrl: "/industrial-sheds-pakistan/",
    nextTitle: "Industrial Sheds",
  };

  const imagesData = divisionImages[config.key] || divisionImages["pre-engineered-buildings"];

  // Sub-pages list from NAV
  const rawChildren = useMemo(() => {
    let children: Array<{ label: string; url: string }> = [];
    const foundNavItem = NAV.find((item) => item.url === data.url);
    if (foundNavItem?.children) {
      children = foundNavItem.children;
    } else {
      const mainDivs = NAV.find((item) => item.label === "Main Divisions");
      const matchedDiv = mainDivs?.divisions?.find((d) => d.url === data.url);
      if (matchedDiv?.children) {
        children = matchedDiv.children;
      }
    }
    return children;
  }, [data.url]);

  // Combine sub-pages with images from divisionImages.list matching by TITLE
  const items = useMemo(() => {
    return rawChildren.map((child, idx) => {
      const childData = CONTENT_BY_URL[child.url];
      const qa = childData?.quickAnswer || childData?.description || "";
      const firstSentence = qa ? qa.split(". ")[0].replace(/\.$/, "") + "." : "";

      // Match in imagesData.list by title
      const foundImgItem = imagesData.list.find(
        (l) => l.title.toLowerCase().trim() === child.label.toLowerCase().trim()
      );
      const imgItem = foundImgItem || imagesData.list[idx];

      const number =
        imgItem?.number ||
        String(idx + 1).padStart(2, "0");
      const image = imgItem?.image || "";

      return {
        number,
        title: child.label,
        url: child.url,
        desc: firstSentence,
        image,
      };
    });
  }, [rawChildren, imagesData]);

  // Failed image trackers to avoid broken image icons
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const handleImageError = (imgUrl: string) => {
    setFailedImages((prev) => ({ ...prev, [imgUrl]: true }));
  };

  // Active sub-page row index for sticky image
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  // IntersectionObserver for row scrolling at screen center
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute("data-row-index");
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              if (!isNaN(idx) && activeIndexRef.current !== idx) {
                setActiveIndex(idx);
              }
            }
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // Reduced motion detection
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================
  // SECTION 2: INTRO ANIMATION SETUP
  // ==========================================
  const introRef = useRef<HTMLElement>(null);
  const [introTriggered, setIntroTriggered] = useState(prefersReduced);
  const [introAnimating, setIntroAnimating] = useState(false);

  const introTitle = config.divisionTitle;
  const introParagraph = data.quickAnswer || "";

  // Title character splitting
  const titleWords = useMemo(() => {
    return introTitle.trim().split(/\s+/);
  }, [introTitle]);

  const totalTitleChars = useMemo(() => {
    return titleWords.reduce((acc, w) => acc + w.length, 0);
  }, [titleWords]);

  const charStagger = useMemo(() => {
    if (totalTitleChars <= 1) return 0;
    return Math.min(35, 1400 / (totalTitleChars - 1));
  }, [totalTitleChars]);

  const titleStaggerEnd = (totalTitleChars - 1) * charStagger;
  const paragraphStartTime = titleStaggerEnd + 300;

  // Paragraph word splitting
  const paraWords = useMemo(() => {
    return introParagraph.trim().split(/\s+/);
  }, [introParagraph]);

  const wordStagger = useMemo(() => {
    if (paraWords.length <= 1) return 0;
    return Math.min(45, 1400 / (paraWords.length - 1));
  }, [paraWords]);

  const totalIntroDuration =
    paragraphStartTime + (paraWords.length - 1) * wordStagger + 800;

  useEffect(() => {
    if (prefersReduced) {
      setIntroTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !introTriggered) {
            setIntroTriggered(true);
            setIntroAnimating(true);
            observer.disconnect();

            setTimeout(() => {
              setIntroAnimating(false);
            }, totalIntroDuration);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (introRef.current) {
      observer.observe(introRef.current);
    }

    return () => observer.disconnect();
  }, [introTriggered, prefersReduced, totalIntroDuration]);

  // ==========================================
  // SECTION 4: FAQ STATE
  // ==========================================
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // Hero Image URL
  const heroImgUrl = cl(imagesData.hero, 2400);
  const heroHasError = failedImages[imagesData.hero];

  // Next Banner Image URL
  const nextImgUrl = cl(imagesData.next, 2000);
  const nextHasError = failedImages[imagesData.next];

  return (
    <div className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* ========================================================
          1. HERO
          - Box: width 100%, aspect-ratio 1024/559, relative, directly under nav.
          - Image eager, fetchpriority="high", fade-in 1000ms (opacity only).
          - Overlay: separate absolute div, exact nav blue at alpha 0.20. Not a filter.
          - Desktop (768px+): headline and short text bottom-left on the image. Keep existing dark bottom gradient.
          - Mobile (<768px): image alone in box. Headline and text BELOW image on solid nav blue, 24px side, 32px top/bottom.
          - Never crop. Object-fit: contain. Dark blue-grey background.
      ======================================================== */}
      <section className="w-full pt-[64px] lg:pt-[88px] bg-white">
        {/* Aspect Ratio Box 1024/559 */}
        <div className="w-full aspect-[1024/559] relative bg-[#0F172A] overflow-hidden">
          {/* Solid dark block if empty or failed, else <img> contain */}
          {imagesData.hero && !heroHasError ? (
            <img
              src={heroImgUrl}
              alt={config.divisionTitle}
              width="1600"
              height="874"
              fetchPriority="high"
              loading="eager"
              onError={() => handleImageError(imagesData.hero)}
              className="w-full h-full object-contain block animate-[heroFadeIn_1000ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div className="w-full h-full bg-[#0F172A]" />
          )}

          {/* Overlay: separate absolute div, exact nav blue at alpha 0.20. Not a filter. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
          />

          {/* Desktop dark bottom gradient */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Desktop (768px+): Headline & short text bottom-left on the image */}
          <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[680px] text-left z-10 pointer-events-auto">
            <h1 className="text-[24px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
              {data.h1}
            </h1>
            {data.quickAnswer && (
              <p className="mt-3 text-[13px] lg:text-[15px] font-normal text-white/85 leading-[1.6] max-w-[580px]">
                {data.quickAnswer.split(". ")[0].replace(/\.$/, "") + "."}
              </p>
            )}
            <div className="mt-5">
              <TransitionLink
                to="/contact-us/#quote"
                className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
              >
                Request a Quote
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Mobile (<768px): Headline and text go BELOW the image on solid nav blue, 24px side, 32px top/bottom */}
        <div className="md:hidden w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
          <h1 className="text-[20px] font-bold text-white uppercase leading-[1.2] tracking-[-0.02em]">
            {data.h1}
          </h1>
          {data.quickAnswer && (
            <p className="mt-3 text-[13px] font-normal text-white/90 leading-[1.6]">
              {data.quickAnswer.split(". ")[0].replace(/\.$/, "") + "."}
            </p>
          )}
          <div className="mt-5">
            <TransitionLink
              to="/contact-us/#quote"
              className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
            >
              Request a Quote
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INTRO
          - Same centered title and paragraph, same copy.
          - Padding 120px top/bottom desktop, 72px mobile. Paragraph max-width 640px.
          - Title animates per CHARACTER. Paragraph per WORD.
          - Each word = span, display inline-block, white-space nowrap.
          - Wrapper aria-label = original text. Split spans aria-hidden="true".
          - Start: opacity 0, translateY(40%), blur 4px. End: opacity 1, translateY(0), blur 0.
          - 800ms per unit. Stagger 35ms per char, 45ms per word. Cap delay at 1400ms.
          - Paragraph starts 300ms after title stagger ends.
          - Trigger once, IntersectionObserver threshold 0.3. Never replay.
      ======================================================== */}
      <section
        ref={introRef}
        className="w-full bg-white py-[72px] lg:py-[120px] px-5 lg:px-10"
      >
        <div className="max-w-[720px] mx-auto text-center flex flex-col items-center">
          {/* Animated H2 Title */}
          <h2
            aria-label={introTitle}
            className="text-[22px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] text-center uppercase"
          >
            {titleWords.map((word, wordIdx) => {
              // Calculate cumulative character offset before this word
              let prevCharsCount = 0;
              for (let i = 0; i < wordIdx; i++) {
                prevCharsCount += titleWords[i].length;
              }

              return (
                <span
                  key={wordIdx}
                  className="inline-block whitespace-nowrap"
                  aria-hidden="true"
                >
                  {word.split("").map((char, charIdx) => {
                    const globalCharIndex = prevCharsCount + charIdx;
                    const delay = prefersReduced
                      ? 0
                      : globalCharIndex * charStagger;

                    return (
                      <span
                        key={charIdx}
                        className="inline-block"
                        style={{
                          opacity: introTriggered ? 1 : 0,
                          transform: introTriggered
                            ? "translateY(0)"
                            : "translateY(40%)",
                          filter: introTriggered ? "blur(0px)" : "blur(4px)",
                          transition: prefersReduced
                            ? "none"
                            : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                          willChange: introAnimating
                            ? "transform, opacity, filter"
                            : "auto",
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {wordIdx < titleWords.length - 1 ? "\u00A0" : ""}
                </span>
              );
            })}
          </h2>

          {/* Animated Paragraph */}
          {introParagraph && (
            <p
              aria-label={introParagraph}
              className="mt-6 max-w-[640px] text-[14px] lg:text-[15px] font-normal text-[#6B7280] leading-[1.7] text-center mx-auto"
            >
              {paraWords.map((word, wordIdx) => {
                const delay = prefersReduced
                  ? 0
                  : paragraphStartTime + wordIdx * wordStagger;

                return (
                  <span
                    key={wordIdx}
                    className="inline-block whitespace-nowrap"
                    aria-hidden="true"
                    style={{
                      opacity: introTriggered ? 1 : 0,
                      transform: introTriggered
                        ? "translateY(0)"
                        : "translateY(40%)",
                      filter: introTriggered ? "blur(0px)" : "blur(4px)",
                      transition: prefersReduced
                        ? "none"
                        : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                      willChange: introAnimating
                        ? "transform, opacity, filter"
                        : "auto",
                    }}
                  >
                    {word}
                    {wordIdx < paraWords.length - 1 ? "\u00A0" : ""}
                  </span>
                );
              })}
            </p>
          )}
        </div>
      </section>

      {/* ========================================================
          3. SUB-PAGE LIST WITH IMAGES
          Desktop (1024px+):
          - CSS grid, columns 7fr / 5fr, gap 64px, max-width 1280px, centered, side padding 32px, align-items start.
          - Left: ONE sticky box. position sticky; top 120px; width 100%; aspect-ratio 1024/559.
          - Ancestors have NO overflow hidden/auto/scroll, NO transform, NO filter.
          - Inside: relative container, dark blue-grey background (#0F172A).
            One <img> per sub-page, ALL stacked: absolute inset 0, object-fit contain.
            Only active image opacity 1, others 0. Transition opacity 800ms cubic-bezier(0.22,1,0.36,1).
          - Right: list of sub-pages.
            Each row: number (01, 02...), title (H3), desc, link.
            Hover, focus, scroll change active image with smooth cross-fade, no flicker.
          Mobile (<1024px):
          - Each item shows its own image box (aspect-ratio 1024/559, dark blue-grey background, <img> contain)
            followed by number, title, description, and link!
      ======================================================== */}
      <section className="w-full bg-white py-12 lg:py-24 px-5 lg:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-16 items-start">
          {/* DESKTOP LEFT COLUMN: Sticky Box */}
          <div className="hidden lg:block sticky top-[120px] w-full aspect-[1024/559] bg-[#0F172A] relative overflow-hidden">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              const hasErr = failedImages[item.image];
              const hasImage = item.image && !hasErr;

              return (
                <div
                  key={item.url || idx}
                  className={`absolute inset-0 w-full h-full bg-[#0F172A] transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {hasImage ? (
                    <img
                      src={cl(item.image, 1400)}
                      alt={item.title}
                      width="1600"
                      height="874"
                      loading="lazy"
                      onError={() => handleImageError(item.image)}
                      className="w-full h-full object-contain block"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0F172A]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN (DESKTOP) & STACKED ROWS (MOBILE) */}
          <div className="w-full divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              const hasErr = failedImages[item.image];
              const hasImage = item.image && !hasErr;

              return (
                <div
                  key={item.url || idx}
                  ref={(el) => {
                    rowRefs.current[idx] = el;
                  }}
                  data-row-index={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className={`group py-8 lg:py-10 text-left transition-colors duration-300 ${
                    isActive ? "bg-slate-50/50 lg:bg-transparent" : ""
                  }`}
                >
                  {/* Mobile-only inline Image Box */}
                  <div className="lg:hidden w-full aspect-[1024/559] bg-[#0F172A] mb-5 overflow-hidden relative">
                    {hasImage ? (
                      <img
                        src={cl(item.image, 1400)}
                        alt={item.title}
                        width="1600"
                        height="874"
                        loading="lazy"
                        onError={() => handleImageError(item.image)}
                        className="w-full h-full object-contain block"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0F172A]" />
                    )}
                  </div>

                  {/* Number (01, 02...): Inter 700, #1E3A8A, tabular numerals */}
                  <div
                    className="text-[14px] lg:text-[16px] font-bold text-[#1E3A8A] mb-2 tracking-[0.06em]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {item.number}
                  </div>

                  {/* Title (H3) */}
                  <h3 className="text-[18px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] mb-2">
                    <TransitionLink
                      to={item.url}
                      className="text-[#0A0A0A] hover:text-[#1E3A8A] transition-colors block"
                    >
                      {item.title}
                    </TransitionLink>
                  </h3>

                  {/* Description */}
                  {item.desc && (
                    <p className="text-[13px] lg:text-[14px] text-[#6B7280] leading-[1.7] max-w-[500px] mb-4">
                      {item.desc}
                    </p>
                  )}

                  {/* Link View → */}
                  <TransitionLink
                    to={item.url}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1E3A8A] hover:underline"
                  >
                    <span>View</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </TransitionLink>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FAQ
          - Same questions and answers. Full-width hairline rows. Container max-width 1280px.
          - Open/close 700ms using grid-template-rows 0fr to 1fr plus opacity.
          - Plus icon rotates to minus over 700ms.
          - Real <button> with aria-expanded.
      ======================================================== */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-16 lg:py-24 px-5 lg:px-8 border-t border-[#E5E5E5]">
          <div className="max-w-[1280px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[40px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-10">
              Frequently Asked Questions
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div key={idx} className="w-full py-5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left cursor-pointer group focus-visible:outline-none"
                    >
                      <span className="font-semibold text-[15px] lg:text-[17px] text-[#0A0A0A] pr-6">
                        {item.q}
                      </span>

                      {/* Plus icon rotates to minus over 700ms */}
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 stroke-[#0A0A0A]"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.5"
                        >
                          {/* Horizontal line */}
                          <line x1="5" y1="12" x2="19" y2="12" />
                          {/* Vertical line: rotates 90deg over 700ms to become horizontal minus */}
                          <line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                            style={{
                              transformOrigin: "center",
                              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                              opacity: isOpen ? 0 : 1,
                              transition: prefersReduced
                                ? "none"
                                : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                          />
                        </svg>
                      </span>
                    </button>

                    {/* Accordion panel using grid-template-rows 0fr to 1fr plus opacity */}
                    <div
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition: prefersReduced
                          ? "none"
                          : "grid-template-rows 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-3 pb-2 text-[14px] lg:text-[15px] text-[#6B7280] leading-[1.7] max-w-[800px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          5. NEXT DIVISION BANNER
          - Box: width 100%, aspect-ratio 1024/559, relative. Image contain.
          - 20% exact nav blue overlay (separate div, alpha 0.20).
          - Remove the small "NEXT" label. Keep existing headline and link.
          - White text, bottom-left on desktop.
          - Desktop: whole banner is one link to the next division.
          - Mobile (<768px): image alone. Headline and link BELOW image on nav blue, 24px side, 32px top/bottom. Image + text = one tap area.
          - Order: PEB, Industrial Sheds, Steel Warehouses, Structural Steel Fabrication, Custom Steel Fabrication.
      ======================================================== */}
      <section className="w-full bg-white border-t border-[#E5E5E5]">
        <TransitionLink
          to={config.nextUrl}
          className="group block w-full no-underline select-none cursor-pointer"
        >
          {/* Banner Image Box (Aspect Ratio 1024/559) */}
          <div className="w-full aspect-[1024/559] relative bg-[#0F172A] overflow-hidden">
            {imagesData.next && !nextHasError ? (
              <img
                src={nextImgUrl}
                alt={config.nextTitle}
                width="1600"
                height="874"
                loading="lazy"
                onError={() => handleImageError(imagesData.next)}
                className="w-full h-full object-contain block"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div className="w-full h-full bg-[#0F172A]" />
            )}

            {/* Separate 20% exact nav blue overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
            />

            {/* Desktop dark bottom gradient */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Desktop Headline & link bottom-left on the image */}
            <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[800px] text-left z-10">
              <h2 className="text-[24px] lg:text-[38px] font-bold text-white tracking-[-0.02em] leading-[1.15] mb-4">
                {config.nextHeading}
              </h2>
              <div className="inline-flex items-center gap-2 text-[14px] lg:text-[16px] font-semibold text-white">
                <span>{config.nextTitle}</span>
                <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Mobile (<768px): Headline and link BELOW image on nav blue, 24px side, 32px top/bottom */}
          <div className="md:hidden w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
            <h2 className="text-[19px] font-bold text-white tracking-[-0.02em] leading-[1.25] mb-4">
              {config.nextHeading}
            </h2>
            <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-white">
              <span>{config.nextTitle}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
                &rarr;
              </span>
            </div>
          </div>
        </TransitionLink>
      </section>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
