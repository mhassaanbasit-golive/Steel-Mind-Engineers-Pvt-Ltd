// Structural Steel Fabrication Signature Layouts (9.18 - 9.22)
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";
import { gsap, ScrollTrigger, CustomEase } from "../../../lib/gsap.ts";
import { lenis } from "../../../lib/lenis.ts";

function cl(url: string, width = 1920) {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width}/`);
}

function extractSections(data: ContentData) {
  const sections: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] }[] = [];
  let current: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] } | null = null;
  const introPs: string[] = [];

  data.blocks.forEach((b: ContentBlock) => {
    if (b.type === "h2") {
      if (current) sections.push(current);
      current = { title: b.title || "", text: "", paragraphs: [] };
    } else if (b.type === "p" && b.text) {
      if (current) {
        current.paragraphs.push(b.text);
        current.text = current.text ? `${current.text} ${b.text}` : b.text;
      } else {
        introPs.push(b.text);
      }
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.18 Columns and Beams — signature: "Type cards + split rows"
export const ColumnsBeamsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 3) || sections[1];
  const typeCards = typesSec?.items || [
    { name: "Rolled sections", text: "Standard I-beams, channels and angles cut to length." },
    { name: "Built-up sections", text: "Plates welded into I-shaped members of any depth and thickness, giving an efficient shape for each load." },
    { name: "Box sections", text: "Hollow members for heavy loads or where appearance matters." },
  ];
  const typeImages = [
    IMG.structural.columnsBeams.c1,
    IMG.structural.columnsBeams.c2,
    IMG.structural.columnsBeams.c3,
  ];

  const splitSec1 = sections[2] || sections[0];
  const splitSec2 = sections[3] || sections[1];

  // Mobile types selector state & swipe
  const [activeTypeIdx, setActiveTypeIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) {
      // Swipe Right -> previous
      setActiveTypeIdx((prev) => (prev > 0 ? prev - 1 : typeCards.length - 1));
    } else if (diff < -40) {
      // Swipe Left -> next
      setActiveTypeIdx((prev) => (prev < typeCards.length - 1 ? prev + 1 : 0));
    }
    setTouchStartX(null);
  };

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const cbRootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // CURTAIN image reveals on desktop and mobile
      const curtainEls = cbRootRef.current?.querySelectorAll(".cb-curtain");
      curtainEls?.forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "E2" }
        );
        if (img) {
          tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: "E1" }, 0);
        }
      });

      // RISE text reveals on desktop and mobile
      const riseEls = cbRootRef.current?.querySelectorAll(".cb-rise");
      riseEls?.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "E1",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, cbRootRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={cbRootRef} className="w-full bg-white text-left">
      {/* Hero */}
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.columnsBeams.hero}
        imageAlt={data.h1}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* Intro: The Role of Columns and Beams (One-Step TEXT STYLE: Heading UPPERCASE, ink; Text var(--blue)) */}
      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight">
              {(sections[0]?.title || "The Role of Columns and Beams").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 max-w-[640px]">
            {introPs.length > 0 ? (
              introPs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-[15px] lg:text-[16px] text-[var(--blue)] font-normal leading-[1.6] lg:leading-[1.7]"
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] font-normal leading-[1.6] lg:leading-[1.7]">
                {sections[0]?.text ||
                  "Columns carry loads down to the foundation. Beams carry loads across openings and pass them to the columns. Together they form the frame that holds the whole building."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Types Fabricated Section */}
      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Heading: UPPERCASE, bold, ink colour */}
          <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8 lg:mb-12">
            {(typesSec?.title || "Types Fabricated").toUpperCase()}
          </h2>

          {/* Desktop: 3 columns (gap 40px); each photo box has the real photo shape (1024/687, not 3:4); number, title, text under it */}
          <div className="hidden lg:grid grid-cols-3 gap-10">
            {typeCards.map((tc, idx) => (
              <div key={idx} className="flex flex-col text-left">
                {/* Real photo shape (1024 / 687, aspect ratio ~1.4905) */}
                <div
                  className="cb-curtain w-full overflow-hidden mb-6 bg-slate-100"
                  style={{ aspectRatio: "1024 / 687" }}
                >
                  <img
                    src={typeImages[idx] || typeImages[0]}
                    alt={tc.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                <div className="cb-rise">
                  {/* Number: solid, bold, var(--blue), placed above its title, like One-Step. No outline, no stroke. 64px, weight 800 */}
                  <div className="text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Title: bold, ink colour, uppercase, 20px, weight 700 */}
                  <h3 className="text-[20px] font-bold uppercase text-[#0A0A0A] leading-snug mb-2">
                    {tc.name.toUpperCase()}
                  </h3>

                  {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, 16px / 1.7 */}
                  <p className="text-[16px] font-normal text-[var(--blue)] leading-[1.7]">
                    {tc.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Types as a selector: a row of 3 tabs (type names in the title style). Under it a full-width photo that changes, and the text of the active type. Swipe changes the type. */}
          <div className="lg:hidden">
            {/* Tabs Row: 3 tabs with 1px border under row and 2px blue line under active tab */}
            <div
              className="flex border-b border-[#E5E7EB] mb-6 overflow-x-auto no-scrollbar"
              role="tablist"
              aria-label="Types Fabricated"
            >
              {typeCards.map((tc, idx) => {
                const isActive = activeTypeIdx === idx;
                return (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTypeIdx(idx)}
                    className={`flex-1 min-w-[100px] pb-3 text-center transition-colors cursor-pointer text-[17px] font-bold uppercase leading-snug border-b-2 ${
                      isActive
                        ? "border-[var(--blue)] text-[#0A0A0A]"
                        : "border-transparent text-[#0A0A0A] opacity-60 hover:opacity-100"
                    }`}
                  >
                    {tc.name.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Under tabs: Full-width photo that changes, with swipe gesture */}
            <div
              className="w-full overflow-hidden bg-slate-100 touch-pan-y"
              style={{ aspectRatio: "1024 / 687" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                key={activeTypeIdx}
                src={typeImages[activeTypeIdx] || typeImages[0]}
                alt={typeCards[activeTypeIdx]?.name}
                className="w-full h-full object-cover block animate-fade-in"
                loading="lazy"
              />
            </div>

            {/* Under photo: Number, Title, Text of the active type */}
            <div className="mt-5 text-left">
              {/* Number: 40px solid bold var(--blue) */}
              <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                {String(activeTypeIdx + 1).padStart(2, "0")}
              </div>

              {/* Title: 17px bold uppercase ink colour */}
              <h3 className="text-[17px] font-bold uppercase text-[#0A0A0A] leading-snug mb-2">
                {typeCards[activeTypeIdx]?.name.toUpperCase()}
              </h3>

              {/* Text: 15px / 1.6 var(--blue) */}
              <p className="text-[15px] font-normal text-[var(--blue)] leading-[1.6]">
                {typeCards[activeTypeIdx]?.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Two Split Rows:
          Desktop:
            - photo half has the real photo shape, flush to the screen edge (row 1 left, row 2 right);
            - row height follows the photo (no fixed min-height);
            - text half is vertically centered, max width 480px;
            - delete the grey background of the text half.
          Mobile:
            - The two split rows stacked: full-width photo, heading, text.
      */}

      {/* Split Row 1: How Steel Mind Engineers Fabricates (Row 1 left photo flush, right text max-w 480px) */}
      <section className="w-full bg-white border-t border-[var(--rule)]">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-2 items-center w-full">
          {/* Photo half flush to the left screen edge, real shape 1024/687 */}
          <div className="cb-curtain w-full overflow-hidden" style={{ aspectRatio: "1024 / 687" }}>
            <img
              src={IMG.structural.columnsBeams.c4}
              alt={splitSec1?.title || "How Steel Mind Engineers Fabricates"}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>

          {/* Text half vertically centered, max width 480px, no grey background */}
          <div className="flex justify-center items-center px-12 xl:px-16 py-12">
            <div className="cb-rise max-w-[480px] w-full text-left">
              <h2 className="text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4">
                {(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
              </h2>
              <p className="text-[16px] font-normal text-[var(--blue)] leading-[1.7]">
                {splitSec1?.text ||
                  "The team checks the plates and sections on arrival, cuts them to the sizes on the drawing, drills or punches bolt holes, fits and welds the parts, and inspects the welds and dimensions. The parts are then cleaned and painted, marked and packed in erection order. See Painting."}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View: Stacked full-width photo, heading, text */}
        <div className="lg:hidden w-full px-6 py-10">
          <div className="cb-curtain w-full overflow-hidden mb-4" style={{ aspectRatio: "1024 / 687" }}>
            <img
              src={IMG.structural.columnsBeams.c4}
              alt={splitSec1?.title || "How Steel Mind Engineers Fabricates"}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
          <div className="cb-rise">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-3">
              {(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
            </h2>
            <p className="text-[15px] font-normal text-[var(--blue)] leading-[1.6]">
              {splitSec1?.text ||
                "The team checks the plates and sections on arrival, cuts them to the sizes on the drawing, drills or punches bolt holes, fits and welds the parts, and inspects the welds and dimensions. The parts are then cleaned and painted, marked and packed in erection order. See Painting."}
            </p>
          </div>
        </div>
      </section>

      {/* Split Row 2: Accuracy Matters (Row 2 text left max-w 480px, photo right flush) */}
      <section className="w-full bg-white border-t border-b border-[var(--rule)]">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-2 items-center w-full">
          {/* Text half vertically centered, max width 480px, no grey background */}
          <div className="flex justify-center items-center px-12 xl:px-16 py-12">
            <div className="cb-rise max-w-[480px] w-full text-left">
              <h2 className="text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4">
                {(splitSec2?.title || "Accuracy Matters").toUpperCase()}
              </h2>
              <p className="text-[16px] font-normal text-[var(--blue)] leading-[1.7]">
                {splitSec2?.text ||
                  "A hole in the wrong place or a beam that is 10 mm short can delay a whole site. Steel Mind Engineers checks dimensions after cutting so that parts fit the first time."}
              </p>
            </div>
          </div>

          {/* Photo half flush to the right screen edge, real shape 1024/687 */}
          <div className="cb-curtain w-full overflow-hidden" style={{ aspectRatio: "1024 / 687" }}>
            <img
              src={IMG.structural.columnsBeams.c5}
              alt={splitSec2?.title || "Accuracy Matters"}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
        </div>

        {/* Mobile View: Stacked full-width photo, heading, text */}
        <div className="lg:hidden w-full px-6 py-10">
          <div className="cb-curtain w-full overflow-hidden mb-4" style={{ aspectRatio: "1024 / 687" }}>
            <img
              src={IMG.structural.columnsBeams.c5}
              alt={splitSec2?.title || "Accuracy Matters"}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
          <div className="cb-rise">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-3">
              {(splitSec2?.title || "Accuracy Matters").toUpperCase()}
            </h2>
            <p className="text-[15px] font-normal text-[var(--blue)] leading-[1.6]">
              {splitSec2?.text ||
                "A hole in the wrong place or a beam that is 10 mm short can delay a whole site. Steel Mind Engineers checks dimensions after cutting so that parts fit the first time."}
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions: Reduced mobile size (16px heading, 17px Q, 15px A) / Desktop (44px heading, 20px Q, 16px A); All text uses TEXT STYLE */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="py-5 lg:py-6">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold uppercase text-[#0A0A0A] pr-4 leading-snug transition-colors group-hover:text-[var(--blue)]">
                        {item.q.toUpperCase()}
                      </span>
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[var(--blue)] font-bold text-lg">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-3 text-[15px] lg:text-[16px] font-normal text-[var(--blue)] leading-[1.6] lg:leading-[1.7]">
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

      {/* Next Banner */}
      <NextBand
        image={IMG.structural.columnsBeams.next}
        nextUrl="/structural-steel-fabrication-pakistan/trusses/"
        nextTitle="TRUSSES"
      />
    </article>
  );
};

// 9.19 Trusses — signature: "Sticky 7fr/5fr viewer on rail (Desktop) + editorial flow with tick rail (Mobile)"
export const TrussesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [
    IMG.structural.trusses.t1,
    IMG.structural.trusses.t2,
    IMG.structural.trusses.t3,
    IMG.structural.trusses.t4,
    IMG.structural.trusses.t5,
  ];

  const blocks = sections.slice(0, 5).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title || "",
    text: sec.text || "",
    img: images[idx] || images[0],
  }));

  // Active item tracking (ACTIVE 50% rule)
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const displayedIdxRef = useRef(0);
  const hoverControlledRef = useRef(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation & DOM refs
  const rootRef = useRef<HTMLElement>(null);
  const desktopLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const barFillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSwapTweenRef = useRef<gsap.core.Timeline | null>(null);
  const railFillRef = useRef<HTMLDivElement>(null);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 5. Preload and decode all 5 photos before the first swap
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, [images]);

  // SWAP recipe for Desktop:
  // "slower for this page: wipe 1400ms E2, inner scale 1.05 to 1 over 2000ms E1. Bars: PROGRESS BARS 600ms. Dot: 300ms."
  const triggerSwap = useCallback((nextIdx: number) => {
    const currentIdx = displayedIdxRef.current;
    if (nextIdx === currentIdx) return;

    // If running wipe: finish instantly (progress(1)), kill it, start new one
    if (activeSwapTweenRef.current) {
      activeSwapTweenRef.current.progress(1);
      activeSwapTweenRef.current.kill();
      activeSwapTweenRef.current = null;
    }

    const currentLayer = desktopLayersRef.current[currentIdx];
    const nextLayer = desktopLayersRef.current[nextIdx];
    if (!nextLayer) return;

    const nextImg = nextLayer.querySelector("img");
    displayedIdxRef.current = nextIdx;

    if (currentLayer) {
      gsap.set(currentLayer, { zIndex: 1, visibility: "visible" });
    }
    gsap.set(nextLayer, {
      zIndex: 2,
      visibility: "visible",
      clipPath: "inset(0 0 100% 0)",
    });
    if (nextImg) {
      gsap.set(nextImg, { scale: 1.05 });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentLayer) {
          gsap.set(currentLayer, { visibility: "hidden", zIndex: 0 });
        }
        gsap.set(nextLayer, { zIndex: 1 });
        activeSwapTweenRef.current = null;
      },
    });

    tl.to(
      nextLayer,
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.4,
        ease: "E2",
      },
      0
    );

    if (nextImg) {
      tl.to(
        nextImg,
        {
          scale: 1,
          duration: 2.0,
          ease: "E1",
        },
        0
      );
    }

    activeSwapTweenRef.current = tl;

    // Bars: PROGRESS BARS 600ms E1 (moving backwards empties subsequent bars)
    barFillsRef.current.forEach((bar, i) => {
      if (!bar) return;
      if (i < nextIdx) {
        gsap.set(bar, { scaleX: 1 });
      } else if (i > nextIdx) {
        gsap.set(bar, { scaleX: 0 });
      }
    });

    const activeBar = barFillsRef.current[nextIdx];
    if (activeBar) {
      gsap.fromTo(
        activeBar,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "E1", overwrite: "auto" }
      );
    }
  }, []);

  // ACTIVE(50%) rule: on every Lenis scroll event (throttled with rAF)
  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;

        // The next Lenis scroll event hands control back to ACTIVE
        if (hoverControlledRef.current) {
          hoverControlledRef.current = false;
        }

        const isDesktop = window.innerWidth >= 1024;
        const target = window.innerHeight * 0.5;
        const currentBlocks = isDesktop ? blockRefs.current : mobileBlockRefs.current;

        let foundIdx = 0;
        for (let i = 0; i < currentBlocks.length; i++) {
          const el = currentBlocks[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= target) {
            foundIdx = i;
          }
        }

        if (foundIdx !== activeIdxRef.current) {
          activeIdxRef.current = foundIdx;
          setActiveIdx(foundIdx);
          if (isDesktop) {
            triggerSwap(foundIdx);
          }
        }
      });
    };

    if (lenis) {
      lenis.on("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (lenis) {
        lenis.off("scroll", onScroll);
      }
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [triggerSwap]);

  // Hover Intent on Desktop blocks:
  // "pointerenter on a block starts a 150ms timer; if pointer stays, SWAP to that block photo and mark hover-controlled; scroll hands control back"
  const handlePointerEnter = useCallback(
    (idx: number) => {
      if (window.innerWidth < 1024) return;
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

      hoverTimerRef.current = setTimeout(() => {
        hoverControlledRef.current = true;
        activeIdxRef.current = idx;
        setActiveIdx(idx);
        triggerSwap(idx);
      }, 150);
    },
    [triggerSwap]
  );

  const handlePointerLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // GSAP MatchMedia & ScrollTrigger Setup (Desktop + Mobile)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: RAIL(fill) scrub and RISE on blocks
      mm.add("(min-width: 1024px)", () => {
        if (railFillRef.current) {
          gsap.fromTo(
            railFillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: "#trusses-rail-container",
                start: "top 60%",
                end: "bottom 60%",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // RISE text on enter
        blockRefs.current.forEach((el) => {
          if (!el) return;
          const textGroup = el.querySelectorAll(".block-content");
          gsap.fromTo(
            textGroup,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            }
          );
        });
      });

      // Mobile: each photo CURTAIN 900ms, text RISE
      mm.add("(max-width: 1023px)", () => {
        mobileBlockRefs.current.forEach((el) => {
          if (!el) return;
          const photoBox = el.querySelector(".mobile-photo-box");
          const photoImg = el.querySelector(".mobile-photo-img");
          const textGroup = el.querySelectorAll(".mobile-text-group");

          if (photoBox) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            });
            tl.fromTo(
              photoBox,
              { clipPath: "inset(0 0 100% 0)" },
              { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "E2" },
              0
            );
            if (photoImg) {
              tl.fromTo(
                photoImg,
                { scale: 1.06 },
                { scale: 1, duration: 1.17, ease: "E1" },
                0
              );
            }
          }

          if (textGroup.length > 0) {
            gsap.fromTo(
              textGroup,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  once: true,
                },
              }
            );
          }
        });
      });

      // Reduced motion: show final state at once
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (railFillRef.current) gsap.set(railFillRef.current, { scaleY: 1 });
        desktopLayersRef.current.forEach((layer, idx) => {
          if (!layer) return;
          gsap.set(layer, {
            clipPath: "inset(0)",
            visibility: idx === 0 ? "visible" : "hidden",
            zIndex: idx === 0 ? 1 : 0,
          });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left">
      {/* Hero */}
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.trusses.hero}
        imageAlt={data.h1}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* Main Section */}
      <section className="w-full bg-white py-12 lg:py-24 px-6 lg:px-8 border-b border-[var(--rule)]">
        <div className="max-w-[1360px] mx-auto">
          {/* Section Heading: UPPERCASE bold ink color */}
          <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-10 lg:mb-16">
            STEEL ROOF TRUSSES SPECIFICATIONS
          </h2>

          {/* Desktop View: Two columns (7fr / 5fr, gap 88px) */}
          <div
            className="hidden lg:grid items-start"
            style={{ gridTemplateColumns: "7fr 5fr", gap: "88px" }}
          >
            {/* Left Column (7fr): Sticky image box at real photo shape (1024/687) holding 5 stacked photos */}
            <div className="sticky top-[calc(var(--nav-offset,80px)+24px)] flex flex-col">
              <div
                className="w-full relative overflow-hidden bg-slate-900"
                style={{ aspectRatio: "1024 / 687" }}
              >
                {blocks.map((b, idx) => (
                  <div
                    key={b.num}
                    ref={(el) => {
                      desktopLayersRef.current[idx] = el;
                    }}
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{
                      clipPath: idx === 0 ? "inset(0)" : "inset(0 0 100% 0)",
                      zIndex: idx === 0 ? 1 : 0,
                      visibility: idx === 0 ? "visible" : "hidden",
                    }}
                  >
                    <img
                      src={cl(b.img, 1920)}
                      alt={b.title}
                      width={1024}
                      height={687}
                      className="w-full h-full object-cover block"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding={idx === 0 ? "auto" : "async"}
                    />
                  </div>
                ))}
              </div>

              {/* Under the box: 5 thin bars (active = blue, 600ms E1) */}
              <div className="mt-4 flex gap-2 w-full" aria-hidden="true">
                {blocks.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[3px] bg-[#E5E7EB] rounded-none overflow-hidden flex-1 relative"
                  >
                    <div
                      ref={(el) => {
                        barFillsRef.current[idx] = el;
                      }}
                      className="h-full bg-[var(--blue)] origin-left w-full transform-gpu"
                      style={{ transform: idx === 0 ? "scaleX(1)" : "scaleX(0)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5fr): 5 blocks on a rail, each min-height 72svh, content centered */}
            <div id="trusses-rail-container" className="relative pl-12">
              {/* Rail Vertical Lines (2px line, dot turns blue when fill passes) */}
              <div className="absolute left-[6px] top-[5%] bottom-[5%] w-[2px] bg-[#E5E7EB]" />
              <div
                ref={railFillRef}
                className="absolute left-[6px] top-[5%] bottom-[5%] w-[2px] bg-[var(--blue)] origin-top transform-gpu"
              />

              {blocks.map((b, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={b.num}
                    ref={(el) => {
                      blockRefs.current[idx] = el;
                    }}
                    onPointerEnter={() => handlePointerEnter(idx)}
                    onPointerLeave={handlePointerLeave}
                    className="min-h-[72svh] flex flex-col justify-center py-12 relative text-left group"
                  >
                    {/* Rail Dot (10px circle aligned with 2px line at center left: 6px) */}
                    <div
                      className={`absolute left-[-47px] top-[calc(50%-5px)] w-[10px] h-[10px] rounded-full transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--blue)] border-2 border-[var(--blue)] shadow-[0_0_8px_rgba(30,58,138,0.35)]"
                          : "bg-white border-2 border-[var(--blue)]"
                      }`}
                    />

                    {/* Block Content (RISE once, full color kept on all blocks) */}
                    <div className="block-content">
                      {/* Number: solid, bold, var(--blue), placed above title, like One-Step. 64px, weight 800 */}
                      <div className="text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                        {b.num}
                      </div>

                      {/* Title: bold, ink colour, uppercase. 20px, weight 700 */}
                      <h3 className="text-[20px] font-bold uppercase text-[#0A0A0A] leading-snug mb-3">
                        {b.title.toUpperCase()}
                      </h3>

                      {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, 16px / 1.7 */}
                      <p className="text-[16px] font-normal text-[var(--blue)] leading-[1.7] max-w-[480px]">
                        {b.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile View: Editorial flow with right-edge sticky tick rail */}
          <div className="lg:hidden relative">
            {/* Vertical tick rail of 5 tick bars fixed/sticky at right edge (2px x 18px inactive, active 44px blue) */}
            <div
              className="sticky top-[50svh] -translate-y-1/2 float-right ml-2 w-[6px] flex flex-col items-end gap-2.5 pointer-events-none z-20"
              aria-hidden="true"
            >
              {blocks.map((_, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`w-[2px] h-[44px] origin-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "scale-y-100 bg-[var(--blue)]"
                        : "scale-y-[0.41] bg-[rgba(30,58,138,0.18)]"
                    }`}
                  />
                );
              })}
            </div>

            {/* Blocks: full-width photo, number, title, text, 56px between blocks */}
            <div className="space-y-[56px] text-left">
              {blocks.map((b, idx) => (
                <div
                  key={b.num}
                  ref={(el) => {
                    mobileBlockRefs.current[idx] = el;
                  }}
                  className="w-full flex flex-col"
                >
                  {/* Full-width photo box at real photo shape (1024/687) with CURTAIN 900ms */}
                  <div
                    className="mobile-photo-box w-full overflow-hidden bg-slate-100"
                    style={{ aspectRatio: "1024 / 687" }}
                  >
                    <img
                      src={cl(b.img, 1080)}
                      alt={b.title}
                      width={1024}
                      height={687}
                      className="mobile-photo-img w-full h-full object-cover block"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding={idx === 0 ? "auto" : "async"}
                    />
                  </div>

                  {/* Under photo: number, title, text (RISE) */}
                  <div className="mobile-text-group mt-4 pr-6">
                    {/* Number: 40px solid bold var(--blue) */}
                    <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                      {b.num}
                    </div>

                    {/* Title: 17px bold uppercase ink colour */}
                    <h3 className="text-[17px] font-bold uppercase text-[#0A0A0A] leading-snug mb-2">
                      {b.title.toUpperCase()}
                    </h3>

                    {/* Text: 15px / 1.6 var(--blue) */}
                    <p className="text-[15px] font-normal text-[var(--blue)] leading-[1.6]">
                      {b.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions: Reduced mobile size (16px heading, 17px Q, 15px A) / Desktop (44px heading, 20px Q, 16px A); All text uses TEXT STYLE */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="py-5 lg:py-6">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold uppercase text-[#0A0A0A] pr-4 leading-snug transition-colors group-hover:text-[var(--blue)]">
                        {item.q.toUpperCase()}
                      </span>
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[var(--blue)] font-bold text-lg">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-3 text-[15px] lg:text-[16px] font-normal text-[var(--blue)] leading-[1.6] lg:leading-[1.7]">
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

      {/* Next Banner */}
      <NextBand
        image={IMG.structural.trusses.next}
        nextUrl="/structural-steel-fabrication-pakistan/mezzanine-floors/"
        nextTitle="MEZZANINE FLOORS"
      />
    </article>
  );
};

// 9.20 Mezzanine Floors — signature: "Sliding floor bands"
export const MezzanineFloorsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.structural.mezzFloors.m1, IMG.structural.mezzFloors.m2, IMG.structural.mezzFloors.m3, IMG.structural.mezzFloors.m4, IMG.structural.mezzFloors.m5];
  const bands = sections.slice(0, 5).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.mezzFloors.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] space-y-16">
        {bands.map((b) => (
          <div key={b.num} className="border-b border-[var(--rule)] pb-16 space-y-8 text-left">
            <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex items-start gap-4">
                <OutlineNum num={b.num} />
                <h3 className="text-[26px] font-bold text-[var(--ink)] pt-1">{b.title}</h3>
              </div>
              <div className="lg:col-span-8">
                <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.structural.mezzFloors.next}
        nextUrl="/structural-steel-fabrication-pakistan/steel-bridges/"
        nextTitle="Steel Bridges"
      />
    </article>
  );
};

// 9.21 Steel Bridges — signature: "Span diagram"
export const SteelBridgesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const remaining = sections.slice(1, 4);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.bridges.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Centered Intro */}
      <section className="container py-[var(--sec-y-lg)] text-center max-w-[760px] mx-auto">
        <h2 className="font-bold text-[var(--ink)] mb-6" style={{ fontSize: "var(--fs-h2)" }}>
          {sections[0]?.title || "Why Steel for Bridges"}
        </h2>
        <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
          {sections[0]?.text || introPs.join(" ")}
        </p>
      </section>

      {/* Wide Band (100vw) */}
      <section className="w-full overflow-hidden bg-slate-900" style={{ height: "clamp(300px, 42vw, 600px)" }}>
        <img
          src={IMG.structural.bridges.wide}
          alt="Steel Bridge Girder Fabrication"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Span Diagram Section: 3 columns hanging from bridge girder line */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        {/* SVG Bridge Girder Line */}
        <div className="hidden lg:block relative w-full mb-12">
          <div className="w-full h-[3px] bg-[var(--blue)] relative flex justify-between items-center">
            <div className="w-4 h-4 bg-[var(--blue)] rotate-45 -mt-[1px]" />
            <div className="w-4 h-4 bg-[var(--blue)] rotate-45 -mt-[1px]" />
          </div>
          <div className="grid grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="w-[1px] h-12 bg-[var(--blue)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {remaining.map((sec, idx) => (
            <div key={idx} className="border-t lg:border-t-0 border-[var(--rule)] pt-6 lg:pt-0 space-y-4">
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{sec.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.structural.bridges.next}
        nextUrl="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
        nextTitle="Crane Gantry Structures"
      />
    </article>
  );
};

// 9.22 Crane Gantry Structures — signature: "Anatomy triptych + compare band"
export const CraneGantryLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const partsSec = sections[1];
  const designSec = sections[2];
  const compareSec = sections[3];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.gantry.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro + Full image g3 */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What a Gantry Structure Is"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
        <div className="mt-12">
          <PhotoBox src={IMG.structural.gantry.g3} alt="Complete Gantry Structure Yard" ratio="16/9" />
        </div>
      </section>

      {/* 2. Parts Triptych: 2 tall image tiles + 1 Royal Blue tile */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
          {partsSec?.title || "Parts of a Gantry"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="aspect-[4/5] overflow-hidden relative shadow-md">
            <img src={IMG.structural.gantry.g1} alt="Gantry Legs" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-white text-[12px] font-semibold uppercase">
              Heavy Structural Columns
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden relative shadow-md">
            <img src={IMG.structural.gantry.g2} alt="Runway Beams" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-white text-[12px] font-semibold uppercase">
              Crane Runway Beams
            </div>
          </div>
          <div className="bg-[var(--blue)] text-white p-8 lg:p-10 flex flex-col justify-center space-y-4 shadow-md">
            <h3 className="text-[24px] font-bold text-white leading-[1.2]">
              {partsSec?.title || "Integrated Engineering"}
            </h3>
            <p className="text-white/85 text-[15px] leading-[1.7]">
              {partsSec?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Design Points Ledger */}
      {designSec && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
            {designSec.title}
          </h2>
          <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
            {designSec.text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0).map((sentence, sIdx) => (
              <div key={sIdx} className="py-5 grid grid-cols-12 gap-6 items-baseline">
                <div className="col-span-1">
                  <span className="text-[14px] font-mono font-bold text-[var(--blue)]">
                    {String(sIdx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-11">
                  <p className="text-[var(--ink)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                    {sentence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Compare Band: Gantry or Crane Shed? */}
      {compareSec && (
        <section className="w-full bg-[var(--blue)] text-white py-12 lg:py-[var(--sec-y-lg)]">
          <div className="container px-4 sm:px-6 lg:px-8 text-left space-y-5">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-[600] tracking-[-0.025em] text-white leading-[1.15]">
              {compareSec.title}
            </h2>
            <p className="text-white/90 text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.65] max-w-[760px]">
              {compareSec.text}
            </p>
            <div className="pt-2">
              <TransitionLink
                to="/industrial-sheds-pakistan/crane-sheds/"
                className="btn btn-light btn-sm inline-flex items-center gap-2"
              >
                <span>Explore Crane Sheds</span>
                <span className="btn-arrow">→</span>
              </TransitionLink>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.structural.gantry.next}
        nextUrl="/custom-steel-fabrication-pakistan/machine-frames/"
        nextTitle="Machine Frames"
      />
    </article>
  );
};
