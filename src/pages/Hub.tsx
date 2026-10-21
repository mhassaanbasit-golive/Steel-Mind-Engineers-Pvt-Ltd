import React, { useState, useEffect, useRef, useMemo } from "react";
import { ContentData } from "../content/types.ts";
import { NAV } from "../data/nav.ts";
import { CONTENT_BY_URL } from "../content/index.ts";
import { divisionImages, cl } from "../data/images.ts";
import { TransitionLink } from "../components/ui/TransitionLink.tsx";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import { DotRail } from "../components/page/DotRail.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";

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
  "/services/": {
    key: "services",
    divisionTitle: "SERVICES",
    nextHeading:
      "See the buildings and structures Steel Mind Engineers has delivered.",
    nextUrl: "/projects/",
    nextTitle: "Projects",
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

  const N = items.length;

  // Failed image trackers to avoid broken image icons
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const handleImageError = (imgUrl: string) => {
    setFailedImages((prev) => ({ ...prev, [imgUrl]: true }));
  };

  // Reduced motion detection
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Media query for responsive switching: Stepper (>=1024px) vs Mobile Cards (<1024px)
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // ==========================================
  // NATURAL RATIO CHECKERS FOR HERO & NEXT BANNER
  // Ratio rule: If within 6% of 16/9, keep 16/9. Else set to w / h.
  // ==========================================
  const [heroRatio, setHeroRatio] = useState<string>("16 / 9");
  const [nextRatio, setNextRatio] = useState<string>("16 / 9");

  const checkHeroRatio = (img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.naturalWidth && img.naturalHeight) {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const target = 16 / 9;
      const actual = w / h;
      if (Math.abs(actual - target) / target <= 0.06) {
        setHeroRatio("16 / 9");
      } else {
        setHeroRatio(`${w} / ${h}`);
      }
    }
  };

  const checkNextRatio = (img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.naturalWidth && img.naturalHeight) {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const target = 16 / 9;
      const actual = w / h;
      if (Math.abs(actual - target) / target <= 0.06) {
        setNextRatio("16 / 9");
      } else {
        setNextRatio(`${w} / ${h}`);
      }
    }
  };

  // Preload and decode all list images on mount
  useEffect(() => {
    items.forEach((item) => {
      if (item.image) {
        const img = new Image();
        img.src = cl(item.image, 1400);
        if (img.decode) {
          img.decode().catch(() => {});
        }
      }
    });
  }, [items]);

  // ==========================================
  // DESKTOP STEPPER STATE & PACE CONTROLLER (5 & 5B)
  // Track activeIndex & prevIndex for entering/leaving animations.
  // Pace: minimum 900ms between steps. Advances/reverses one step at a time.
  // ==========================================
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);

  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const targetIndexRef = useRef(0);
  const isSteppingRef = useRef(false);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rAFRef = useRef<number | null>(null);

  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Stepping logic moving toward targetIndex by ONE step at a time with min 900ms delay
  const triggerStep = () => {
    if (isSteppingRef.current) return;
    const current = activeIndexRef.current;
    const target = targetIndexRef.current;
    if (current === target) return;

    const next = target > current ? current + 1 : current - 1;
    isSteppingRef.current = true;
    setIsFlipping(true);

    setPrevIndex(current);
    activeIndexRef.current = next;
    setActiveIndex(next);

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
    }, 1050);

    // Minimum 900ms between steps
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    stepTimerRef.current = setTimeout(() => {
      isSteppingRef.current = false;
      triggerStep();
    }, 900);
  };

  useEffect(() => {
    if (!isDesktop || N <= 1) return;

    const onScroll = () => {
      if (rAFRef.current !== null) return;
      rAFRef.current = requestAnimationFrame(() => {
        rAFRef.current = null;
        if (!trackRef.current || !pinRef.current) return;
        const navH =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
          ) || 88;
        const trackRect = trackRef.current.getBoundingClientRect();
        const maxScroll = trackRef.current.offsetHeight - pinRef.current.offsetHeight;
        if (maxScroll <= 0) return;
        const rawP = Math.max(0, Math.min(1, -(trackRect.top - navH) / maxScroll));
        setStageProgress(rawP);
        const p = Math.max(
          0,
          Math.min(0.9999, -(trackRect.top - navH) / maxScroll)
        );
        const target = Math.floor(p * N);
        targetIndexRef.current = target;
        triggerStep();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rAFRef.current !== null) cancelAnimationFrame(rAFRef.current);
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [isDesktop, N]);

  // ==========================================
  // SECTION 2: INTRO ANIMATION SETUP (KEPT AS-IS)
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
  // SECTION 4: FAQ STATE (KEPT AS-IS)
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
          1. HERO (ALL 5 DIVISIONS) = STRETCH, NO CROP
          - Box: position relative; width 100%; overflow hidden; dark blue-grey background (#0F172A);
            aspect-ratio 16 / 9 until image loads. Same desktop and mobile. No max-height. No min-height.
          - On onLoad (and ref callback): if ratio within 6% of 16/9, keep 16/9, else ${w} / ${h}.
          - <img>: position absolute; inset 0; width 100%; height 100%; object-fit: fill. Never cover/contain.
          - Image: eager, fetchpriority="high", 1000ms opacity fade-in. Cloudinary w_2400.
          - Remove paragraph under hero headline. Keep only headline and Request a Quote button.
          - Desktop (768px+): 3 separate absolute overlay divs:
            a) exact nav blue at alpha 0.30
            b) linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%)
            c) linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)
            Headline bottom-left on image, white, above all overlays (z-10).
          - Mobile (<768px): overlay is exact nav blue at alpha 0.20 only. Image shows alone.
            Headline and button go BELOW image on solid nav blue, white text, 24px side padding, 32px top/bottom padding.
      ======================================================== */}
      <section data-hero className="w-full bg-white">
        {/* Aspect Ratio Box: defaults to 16/9, updates dynamically based on natural image aspect ratio */}
        <div
          className="relative w-full overflow-hidden bg-[#0F172A]"
          style={{ aspectRatio: heroRatio }}
        >
          {imagesData.hero && !heroHasError ? (
            <img
              src={heroImgUrl}
              alt={config.divisionTitle}
              fetchPriority="high"
              loading="eager"
              ref={(el) => {
                if (el && el.complete && el.naturalWidth > 0) {
                  checkHeroRatio(el);
                }
              }}
              onLoad={(e) => checkHeroRatio(e.currentTarget)}
              onError={() => handleImageError(imagesData.hero)}
              className="absolute inset-0 w-full h-full block animate-[heroFadeIn_1000ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
              style={{ objectFit: "fill" }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
          )}

          {/* Desktop Overlay (768px+): 3 separate absolute divs, inset 0 */}
          {/* a) exact nav blue at alpha 0.30 */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.30)" }}
          />
          {/* b) linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%) */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%)",
            }}
          />
          {/* c) linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%) */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
            }}
          />

          {/* Mobile Overlay (<768px): exact nav blue at alpha 0.20 only */}
          <div
            className="md:hidden absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
          />

          {/* Desktop Headline & Button bottom-left on image, above all overlays (z-10) */}
          <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[680px] text-left z-10 pointer-events-auto">
            <h1 className="text-[24px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
              {data.h1}
            </h1>
            <div className="mt-5">
              <TransitionLink
                to="/contact-us/#quote"
                className="btn btn--light btn-sm"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Mobile (<768px): Headline and button go BELOW the image on solid nav blue, 24px side, 32px top/bottom */}
        <div className="md:hidden w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
          <h1 className="text-[20px] font-bold text-white uppercase leading-[1.2] tracking-[-0.02em]">
            {data.h1}
          </h1>
          <div className="mt-5">
            <TransitionLink
              to="/contact-us/#quote"
              className="btn btn--light btn-sm"
            >
              <span>Request a Quote</span>
              <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INTRO (KEPT AS-IS)
          - Spacing: 96px desktop, 56px mobile to list below.
      ======================================================== */}
      <section
        ref={introRef}
        className="w-full bg-white pt-[72px] lg:pt-[120px] pb-[56px] lg:pb-[96px] px-5 lg:px-10"
      >
        <div className="max-w-[720px] mx-auto text-center flex flex-col items-center">
          {/* Animated H2 Title */}
          <h2
            aria-label={introTitle}
            className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] text-center uppercase"
          >
            {titleWords.map((word, wordIdx) => {
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
              className="mt-6 max-w-[640px] text-[14px] lg:text-[15px] font-normal text-[#0A0A0A] leading-[1.7] text-center mx-auto"
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
          3. SUB-PAGE LIST:
          - At >= 1024px: DESKTOP SCROLL-PINNED STEPPER (Parts 5 & 5B)
          - Below 1024px: MOBILE CARDS (Part 6)
          - Never render both!
      ======================================================== */}
      {isDesktop ? (
        /* DESKTOP SCROLL-PINNED STEPPER (1024px and wider) */
        <section
          ref={trackRef}
          className="relative w-full bg-white"
          style={{ height: `calc(${N} * 120vh)` }}
        >
          <div
            ref={pinRef}
            className="sticky w-full max-w-[1280px] mx-auto px-8 grid grid-cols-[7fr_5fr] gap-16 items-center"
            style={{
              top: "var(--nav-h, 88px)",
              height: "calc(100vh - var(--nav-h, 88px))",
            }}
          >
            {/* LEFT: Image Stage (link to active sub-page) */}
            <div className="w-full relative flex flex-col items-center justify-center">
              <div
                className="relative w-full"
                style={{
                  width: "min(100%, calc((100vh - var(--nav-h, 88px) - 96px) * 1.5))",
                }}
              >
                <TransitionLink
                  to={items[activeIndex]?.url || "#"}
                  className="block relative w-full overflow-hidden select-none cursor-pointer"
                  style={{
                    aspectRatio: "3 / 2",
                    backgroundColor: "#0F172A",
                  }}
                  aria-label={`View ${items[activeIndex]?.title || "division details"}`}
                >
                  {items.map((item, idx) => {
                    const isActive = activeIndex === idx;
                    const isLeaving = prevIndex === idx;
                    const hasErr = failedImages[item.image];
                    const hasImage = item.image && !hasErr;

                    return (
                      <div
                        key={item.url || idx}
                        className="absolute inset-0 w-full h-full bg-[#0F172A] overflow-hidden"
                        style={{
                          opacity: isActive ? 1 : 0,
                          zIndex: isActive ? 10 : isLeaving ? 5 : 0,
                          pointerEvents: isActive ? "auto" : "none",
                          transition: prefersReduced
                            ? "opacity 200ms ease"
                            : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                          willChange: isFlipping ? "opacity, transform" : "auto",
                        }}
                      >
                        {hasImage ? (
                          <img
                            src={cl(item.image, 1400)}
                            alt={item.title}
                            loading="eager"
                            onError={() => handleImageError(item.image)}
                            className={`absolute inset-0 w-full h-full object-cover object-center block ${
                              isActive && !prefersReduced
                                ? "animate-[enterScale_1000ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
                                : ""
                            }`}
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                              transform: isLeaving || prefersReduced ? "scale(1)" : undefined,
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
                        )}
                      </div>
                    );
                  })}
                </TransitionLink>

                {/* 2px progress line under the stage that fills with the scroll in that section */}
                <div className="w-full h-[2px] bg-[rgba(10,10,10,0.12)] mt-3 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[var(--blue, #1E3A8A)] transition-all duration-150 ease-out"
                    style={{ width: `${Math.round(stageProgress * 100)}%` }}
                  />
                </div>

                {/* DotRail on the right edge of the sticky stage */}
                <div className="absolute right-[-44px] top-1/2 -translate-y-1/2 z-20">
                  <DotRail
                    count={N}
                    active={activeIndex}
                    onSelect={(idx) => {
                      targetIndexRef.current = idx;
                      triggerStep();
                      if (trackRef.current && pinRef.current) {
                        const navH =
                          parseFloat(
                            getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
                          ) || 88;
                        const maxScroll = trackRef.current.offsetHeight - pinRef.current.offsetHeight;
                        const scrollTarget =
                          window.scrollY +
                          trackRef.current.getBoundingClientRect().top -
                          navH +
                          (idx / Math.max(1, N - 1)) * maxScroll;
                        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
                      }
                    }}
                    orientation="vertical"
                    itemNames={items.map((it) => it.title)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Text Slides stacked in same grid cell */}
            <div className="w-full relative flex flex-col justify-center">
              <div className="grid grid-cols-1 grid-rows-1 w-full">
                {items.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  const isLeaving = prevIndex === idx;

                  // Text flip animation per Part 5B
                  const slideTransform = prefersReduced
                    ? "none"
                    : isActive
                    ? "translateY(0)"
                    : isLeaving
                    ? "translateY(-24px)"
                    : "translateY(24px)";

                  const slideOpacity = isActive ? 1 : 0;

                  const slideTransition = prefersReduced
                    ? "opacity 200ms ease"
                    : isActive
                    ? "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms"
                    : isLeaving
                    ? "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none";

                  return (
                    <div
                      key={item.url || idx}
                      className="col-start-1 row-start-1 w-full text-left flex flex-col"
                      style={{
                        opacity: slideOpacity,
                        transform: slideTransform,
                        transition: slideTransition,
                        pointerEvents: isActive ? "auto" : "none",
                        zIndex: isActive ? 10 : isLeaving ? 5 : 0,
                        willChange: isFlipping ? "opacity, transform" : "auto",
                      }}
                      aria-hidden={!isActive}
                      inert={!isActive ? true : undefined}
                    >
                      {/* Title */}
                      <h3
                        className="font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.01em] mb-4"
                        style={{
                          fontSize: "clamp(24px, 2.4vw, 36px)",
                          opacity: isActive ? 1 : 0,
                          transform: prefersReduced
                            ? "none"
                            : isActive
                            ? "translateY(0)"
                            : "translateY(12px)",
                          transition: prefersReduced
                            ? "none"
                            : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 280ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 280ms",
                        }}
                      >
                        <TransitionLink
                          to={item.url}
                          className="text-[#0A0A0A] hover:text-[#1E3A8A] transition-colors block"
                        >
                          {item.title}
                        </TransitionLink>
                      </h3>

                      {/* Description */}
                      {item.desc && (
                        <p
                          className="text-[14px] lg:text-[15px] text-[#0A0A0A] leading-[1.7] max-w-[440px] mb-6"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: prefersReduced
                              ? "none"
                              : isActive
                              ? "translateY(0)"
                              : "translateY(12px)",
                            transition: prefersReduced
                              ? "none"
                              : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 360ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 360ms",
                          }}
                        >
                          {item.desc}
                        </p>
                      )}

                      {/* Link View → */}
                      <div>
                        <TransitionLink
                          to={item.url}
                          className="link-arrow text-[14px] font-semibold text-[#1E3A8A]"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: prefersReduced
                              ? "none"
                              : isActive
                              ? "translateY(0)"
                              : "translateY(12px)",
                            transition: prefersReduced
                              ? "none"
                              : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 440ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 440ms",
                          }}
                        >
                          <span>View</span>
                          <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
                        </TransitionLink>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line Under the slide: 2px grey line with 2px blue scale line */}
              <div className="w-full h-[2px] bg-[#E5E5E5] mt-10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-full h-[2px] bg-[#1E3A8A]"
                  style={{
                    transform: `scaleX(${(activeIndex + 1) / N})`,
                    transformOrigin: "left",
                    transition: prefersReduced
                      ? "none"
                      : "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* MOBILE CARDS (below 1024px) */
        <section className="w-full bg-white px-6 py-6">
          <div className="w-full flex flex-col gap-8 max-w-[600px] mx-auto">
            {items.map((item, idx) => {
              const hasErr = failedImages[item.image];
              const hasImage = item.image && !hasErr;

              return (
                <TransitionLink
                  key={item.url || idx}
                  to={item.url}
                  className="block w-full min-h-[48px] select-none no-underline group text-left"
                >
                  {/* Card Image Box: aspect-ratio 3 / 2, overflow hidden, dark blue-grey bg */}
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#0F172A]">
                    {hasImage ? (
                      <img
                        src={cl(item.image, 1400)}
                        alt={item.title}
                        loading={idx < 2 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : "auto"}
                        onError={() => handleImageError(item.image)}
                        className="absolute inset-0 w-full h-full object-cover object-center block"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
                    )}
                  </div>

                  {/* Row with title and arrow (no number) */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] font-bold text-[#0A0A0A] uppercase leading-[1.2] truncate">
                      {item.title}
                    </h3>
                    <span className="text-[#1E3A8A] text-[18px] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>

                  {/* ONE line of description with ellipsis */}
                  {item.desc && (
                    <p className="mt-2 text-[13px] text-[#0A0A0A] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                      {item.desc}
                    </p>
                  )}
                </TransitionLink>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          4. FAQ (Standardized to match Homepage FAQ)
          - Spacing: bottom padding 96px desktop, 64px mobile.
          - Followed by next banner directly.
      ======================================================== */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white pt-16 lg:pt-24 pb-[64px] lg:pb-[96px] px-5 lg:px-8 border-t border-[#E5E5E5]">
          <div className="max-w-[1280px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.01em] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* ========================================================
          5. NEXT DIVISION BANNER (ALL 5 DIVISIONS)
          - Stretch box and natural-ratio rule matching hero. object-fit: fill. Cloudinary w_2000.
          - Overlay: exact nav blue alpha 0.20, separate div.
          - No "NEXT" label. Keep existing headline and link.
          - Desktop: headline and link bottom-left on image, white. Whole banner is one link.
          - Mobile: image alone. Headline and link below on nav blue, 24px side, 32px top/bottom padding.
          - Whole banner is one link.
      ======================================================== */}
      <section className="w-full bg-white border-t border-[#E5E5E5]">
        <TransitionLink
          to={config.nextUrl}
          className="group block w-full no-underline select-none cursor-pointer"
        >
          {/* Banner Image Box: stretch with natural aspect ratio */}
          <div
            className="relative w-full overflow-hidden bg-[#0F172A]"
            style={{ aspectRatio: nextRatio }}
          >
            {imagesData.next && !nextHasError ? (
              <img
                src={nextImgUrl}
                alt={config.nextTitle}
                loading="lazy"
                ref={(el) => {
                  if (el && el.complete && el.naturalWidth > 0) {
                    checkNextRatio(el);
                  }
                }}
                onLoad={(e) => checkNextRatio(e.currentTarget)}
                onError={() => handleImageError(imagesData.next)}
                className="absolute inset-0 w-full h-full block"
                style={{ objectFit: "fill" }}
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
            )}

            {/* Separate 20% exact nav blue overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
            />

            {/* Desktop dark gradient for high contrast */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0) 100%)",
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
        @keyframes enterScale {
          from { transform: scale(1.04); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
