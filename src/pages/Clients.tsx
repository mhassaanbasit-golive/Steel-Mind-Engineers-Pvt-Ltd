// PART 11. CLIENTS PAGE — Banner + 10 Logos Centered + Repeat Clients + FAQ + NextBand
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import pageData from "../content/generated/page-65.json";
import { A } from "../data/assets.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { Button } from "../components/ui/Button.tsx";
import { TransitionLink } from "../components/ui/TransitionLink.tsx";
import { gsap, ScrollTrigger } from "../lib/gsap.ts";

interface ClientItem {
  name: string;
  logo?: string;
  width?: number;
  height?: number;
  projectUrl?: string;
  projectNote?: string;
}

const CLIENTS: ClientItem[] = [
  {
    name: "Haier",
    logo: A.clientLogo["Haier"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/haier-peb-crane-and-mezzanine-shed-raiwind/",
    projectNote: "Store Shed, Crane Shed, Mezzanine",
  },
  {
    name: "Imperial Denim",
    logo: A.clientLogo["Imperial Denim"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/",
    projectNote: "Apparel & Industrial Facility",
  },
  {
    name: "Moiz Steel",
    logo: A.clientLogo["Moiz Steel"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/",
    projectNote: "Steel Processing Division",
  },
  {
    name: "Saif Engineers",
    logo: A.clientLogo["Saif Engineers"],
    width: 1024,
    height: 765,
    projectUrl: "/projects/",
    projectNote: "Structural Infrastructure",
  },
  {
    name: "Dravton Dairy",
    logo: A.clientLogo["Dravton Dairy"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/dravton-dairy-peb-dairy-shed-chunian/",
    projectNote: "Dairy Shed, Milking Parlour, Rapid Exit",
  },
  {
    name: "Latifia Dairy",
    logo: A.clientLogo["Latifia Dairy"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "PEB Dairy Shed, Kasur",
  },
  {
    name: "Maria B",
    logo: A.clientLogo["Maria B"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/maria-b-peb-mezzanine-floor-lahore/",
    projectNote: "Mezzanine Floor, Lahore",
  },
  {
    name: "Elite Stitching",
    logo: A.clientLogo["Elite Stitching"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Garment Manufacturing Unit",
  },
  {
    name: "MAB",
    logo: A.clientLogo["MAB"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Industrial Engineering",
  },
  {
    name: "Agha Waqar",
    logo: A.clientLogo["Agha Waqar"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Commercial Fabrication",
  },
];

export const Clients: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  const repeatClientsRef = useRef<HTMLDivElement>(null);
  const whatClientsReceiveRef = useRef<HTMLDivElement>(null);
  const becomeClientRef = useRef<HTMLDivElement>(null);

  // Press-and-hold touch handler state refs
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const heldCellIndexRef = useRef<number | null>(null);

  const clearHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    startPosRef.current = null;
    if (gridRef.current) {
      gridRef.current.removeAttribute("data-hold");
    }
    if (heldCellIndexRef.current !== null) {
      const el = cellRefs.current[heldCellIndexRef.current];
      if (el) el.classList.remove("is-held");
      heldCellIndexRef.current = null;
    }
    setHoveredIdx(null);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    if (e.pointerType === "mouse") return; // Touch only
    startPosRef.current = { x: e.clientX, y: e.clientY };

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      if (gridRef.current && cellRefs.current[idx]) {
        heldCellIndexRef.current = idx;
        gridRef.current.setAttribute("data-hold", "true");
        cellRefs.current[idx]?.classList.add("is-held");
        setHoveredIdx(idx);
      }
    }, 160);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPosRef.current) return;
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 8 || dy > 8) {
      clearHold();
    }
  };

  useEffect(() => {
    const onScrollOrCancel = () => clearHold();
    window.addEventListener("scroll", onScrollOrCancel, { passive: true });
    window.addEventListener("pointerup", onScrollOrCancel, { passive: true });
    window.addEventListener("pointercancel", onScrollOrCancel, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrCancel);
      window.removeEventListener("pointerup", onScrollOrCancel);
      window.removeEventListener("pointercancel", onScrollOrCancel);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  // Motion Setup: GSAP + ScrollTrigger with matchMedia
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // 1. Heading and subline: RISE once (heading first, subline 120ms later)
    if (headingRef.current && sublineRef.current) {
      const heading = headingRef.current;
      const subline = sublineRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
          once: true,
          invalidateOnRefresh: true,
        },
        onStart: () => {
          heading.style.willChange = "transform, opacity";
          subline.style.willChange = "transform, opacity";
        },
        onComplete: () => {
          gsap.set([heading, subline], { clearProps: "willChange" });
        },
      });

      tl.fromTo(heading, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "E1" }, 0);
      tl.fromTo(subline, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "E1" }, 0.12);
    }

    // 2. Logos Desktop: row by row (chunks of 3). Start "top 88%", once. Stagger 70ms.
    mm.add("(min-width: 1024px)", () => {
      const desktopRowIndices = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9],
      ];

      desktopRowIndices.forEach((rowIndices) => {
        const rowCells = rowIndices
          .map((i) => cellRefs.current[i])
          .filter(Boolean) as HTMLElement[];

        if (rowCells.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowCells[0],
            start: "top 88%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            rowCells.forEach((c) => {
              c.style.willChange = "transform, opacity";
            });
          },
          onComplete: () => {
            rowCells.forEach((c) => {
              gsap.set(c, { clearProps: "willChange" });
            });
          },
        });

        tl.fromTo(
          rowCells,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "E1",
            stagger: 0.07,
          }
        );
      });
    });

    // 3. Logos Mobile: row by row (chunks of 2). Start "top 92%", once. Stagger 70ms.
    mm.add("(max-width: 1023px)", () => {
      const mobileRowIndices = [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9],
      ];

      mobileRowIndices.forEach((rowIndices) => {
        const rowCells = rowIndices
          .map((i) => cellRefs.current[i])
          .filter(Boolean) as HTMLElement[];

        if (rowCells.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowCells[0],
            start: "top 92%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            rowCells.forEach((c) => {
              c.style.willChange = "transform, opacity";
            });
          },
          onComplete: () => {
            rowCells.forEach((c) => {
              gsap.set(c, { clearProps: "willChange" });
            });
          },
        });

        tl.fromTo(
          rowCells,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "E1",
            stagger: 0.07,
          }
        );
      });
    });

    // 4. Reduced Motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (headingRef.current) gsap.set(headingRef.current, { y: 0, opacity: 1 });
      if (sublineRef.current) gsap.set(sublineRef.current, { y: 0, opacity: 1 });
      cellRefs.current.forEach((cell) => {
        if (cell) gsap.set(cell, { y: 0, opacity: 1 });
      });
    });

    // Refresh ScrollTrigger to ensure accurate trigger measurements
    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      mm.revert();
    };
  }, []);

  // Scroll reveal animation for the bottom section boxes
  useEffect(() => {
    const boxes = [
      repeatClientsRef.current,
      whatClientsReceiveRef.current,
      becomeClientRef.current,
    ].filter(Boolean) as HTMLDivElement[];

    const triggers: ScrollTrigger[] = [];

    boxes.forEach((box, i) => {
      const anim = gsap.fromTo(
        box,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: i === 2 ? 0.1 : i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "top 88%",
            once: true,
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <article className="w-full bg-white">
      {/* 1. Banner: Immersive Hero with updated banner image */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792422059/client-section-banner.jpg"
        imageAlt="Steel buildings built by Steel Mind Engineers for clients across Pakistan."
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* 2. Logos Section */}
      <section className="w-full bg-white py-14 lg:py-20 border-b border-[var(--line)]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2
              ref={headingRef}
              className="text-[20px] lg:text-[28px] font-bold text-[var(--ink)] tracking-tight"
            >
              Companies That Have Built With Us
            </h2>
            <p
              ref={sublineRef}
              className="text-[13px] lg:text-[14px] text-[var(--grey)] mt-1.5"
            >
              Click any client to see their completed projects and facilities
            </p>
          </div>

          {/* Clean 2 columns on mobile, 3 columns on desktop */}
          <div
            ref={gridRef}
            onPointerMove={handlePointerMove}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center client-grid"
          >
            {CLIENTS.map((client, idx) => {
              const isHovered = hoveredIdx === idx;
              const isDimmed = hoveredIdx !== null && !isHovered;

              return (
                <div
                  key={client.name}
                  ref={(el) => {
                    cellRefs.current[idx] = el;
                  }}
                  className={`cell w-full flex items-center justify-center ${
                    isHovered ? "is-focused" : isDimmed ? "is-dimmed" : ""
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  onPointerDown={(e) => handlePointerDown(e, idx)}
                >
                  <TransitionLink
                    to={client.projectUrl || "/projects/"}
                    className="fx group flex flex-col items-center justify-center p-3 sm:p-5 w-full select-none"
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        width={client.width}
                        height={client.height}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-[90px] sm:h-[110px] md:h-[130px] lg:h-[145px] object-contain block"
                      />
                    ) : (
                      <span className="font-semibold text-[16px] lg:text-[20px] text-[var(--ink)] tracking-tight group-hover:text-[var(--blue)] transition-colors">
                        {client.name}
                      </span>
                    )}
                    {client.projectNote && (
                      <span className="mt-3 text-center text-[11px] sm:text-[12px] uppercase tracking-wider text-[var(--grey)] group-hover:text-[var(--blue)] font-medium line-clamp-1 transition-colors">
                        {client.projectNote}
                      </span>
                    )}
                  </TransitionLink>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Embedded CSS for HOVER-FOCUS and Tap states */}
      <style>{`
        .client-grid .fx {
          transition: filter 400ms cubic-bezier(.16, 1, .3, 1), transform 400ms cubic-bezier(.16, 1, .3, 1), opacity 400ms cubic-bezier(.16, 1, .3, 1);
          transform-origin: center center;
        }

        /* React State Driven Hover-Focus Blur */
        .client-grid .cell.is-dimmed .fx {
          filter: blur(4px);
          opacity: 0.65;
          will-change: filter;
        }

        .client-grid .cell.is-focused .fx {
          transform: scale(1.05);
          filter: blur(0px);
          opacity: 1;
        }

        /* Desktop Native CSS Hover-Focus (Immediate on hover, no dependency on .is-ready) */
        @media (hover: hover) and (pointer: fine) {
          .client-grid:has(.cell:hover) .cell:not(:hover) .fx,
          .client-grid:has(.cell:focus-within) .cell:not(:focus-within) .fx {
            filter: blur(4px);
            opacity: 0.65;
            will-change: filter;
          }

          .client-grid .cell:hover .fx,
          .client-grid .cell:focus-within .fx {
            transform: scale(1.05);
            filter: blur(0px);
            opacity: 1;
          }
        }

        /* Touch Press-and-Hold Focus */
        .client-grid[data-hold]:has(.cell.is-held) .cell:not(.is-held) .fx,
        .client-grid[data-hold] .cell:not(.is-held) .fx {
          filter: blur(3px);
          opacity: 0.7;
          will-change: filter;
        }

        .client-grid[data-hold] .cell.is-held .fx {
          transform: scale(1.05);
          filter: blur(0px);
          opacity: 1;
        }

        /* Tap feedback on touch: cell scales to .97 on :active (200ms) and back */
        @media (hover: none) or (pointer: coarse) {
          .client-grid .cell:active .fx {
            transform: scale(0.97);
            transition: transform 200ms cubic-bezier(.16, 1, .3, 1);
          }
        }

        /* Reduced motion: no blur, no scale */
        @media (prefers-reduced-motion: reduce) {
          .client-grid .fx,
          .client-grid .cell.is-dimmed .fx,
          .client-grid .cell.is-focused .fx,
          .client-grid:has(.cell:hover) .cell .fx,
          .client-grid[data-hold] .cell .fx {
            filter: none !important;
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* 3. Repeat Clients & What Clients Receive — Solid blue background, white text, scroll reveal */}
      <section className="py-14 lg:py-20 bg-[#F9FAFB] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Repeat Clients Card */}
            <div
              ref={repeatClientsRef}
              style={{ backgroundColor: "var(--blue)" }}
              className="p-8 lg:p-10 space-y-4 text-white shadow-md transition-all duration-300"
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-white/20 px-2.5 py-1">
                Customer Trust
              </span>
              <h3 className="text-[20px] lg:text-[26px] font-bold text-white tracking-tight">
                Repeat Clients
              </h3>
              <p className="text-[14px] lg:text-[15px] text-white leading-[1.7]">
                Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed, and a combined crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed, and a rapid exit structure. Repeat orders demonstrate lasting satisfaction with structural performance and proactive engineering support.
              </p>
            </div>

            {/* What Clients Receive Card */}
            <div
              ref={whatClientsReceiveRef}
              style={{ backgroundColor: "var(--blue)" }}
              className="p-8 lg:p-10 space-y-4 text-white shadow-md transition-all duration-300"
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-white/20 px-2.5 py-1">
                Turnkey Commitment
              </span>
              <h3 className="text-[20px] lg:text-[26px] font-bold text-white tracking-tight">
                What Clients Receive
              </h3>
              <p className="text-[14px] lg:text-[15px] text-white leading-[1.7]">
                Every client receives one contract, one dedicated point of contact, a milestone-based written schedule, and warranty support after handover. From initial engineering load calculations in Tekla to on-site crane erection and subsequent facility expansions, our single-source model prevents contractor finger-pointing.
              </p>
            </div>
          </div>

          {/* Become a Client Action Band */}
          <div
            ref={becomeClientRef}
            style={{ backgroundColor: "var(--blue)" }}
            className="mt-10 p-8 lg:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md transition-all duration-300"
          >
            <div>
              <h3 className="text-[20px] lg:text-[24px] font-bold text-white tracking-tight">
                Become a Client
              </h3>
              <p className="text-[13px] lg:text-[14px] text-white mt-1 max-w-[620px]">
                Send the use, size and location of your project. An engineer will examine your drawings and specifications and reply with a complete estimate.
              </p>
            </div>
            <Button
              variant="hero-white"
              size="md"
              href="/contact-us/#quote"
              className="flex-shrink-0"
            >
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[800px] mx-auto px-[var(--pad-x)] text-left">
            <h2 className="text-[22px] lg:text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} size="large" />
          </div>
        </section>
      )}

      {/* 5. Next Band */}
      <NextBand
        heading="Explore Our Completed Structures & Case Studies"
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
