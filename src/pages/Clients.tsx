// PART 11. CLIENTS PAGE — Banner + 10 Logos Centered + Repeat Clients + FAQ + NextBand
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
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
  photoUrl?: string;
}

const CLIENTS: ClientItem[] = [
  {
    name: "Haier",
    logo: A.clientLogo["Haier"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/haier-peb-crane-and-mezzanine-shed-raiwind/",
    projectNote: "Store Shed, Crane Shed, Mezzanine",
    photoUrl: "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401784/Haier-Injection-Modling-Structure-Fabrication-Main-Image.png",
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
    photoUrl: "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401780/Dravton-Dairy-Shed-Main-image.png",
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
    photoUrl: "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401787/Maria-B-Mezzanine-Floor-Main-Image.png",
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedPhotos, setLoadedPhotos] = useState<
    Record<string, { loaded: boolean; aspect: string; ratio: number }>
  >({});

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  const repeatClientsRef = useRef<HTMLDivElement>(null);
  const whatClientsReceiveRef = useRef<HTMLDivElement>(null);
  const becomeClientRef = useRef<HTMLDivElement>(null);

  // Preload all client photos once with requestIdleCallback (fallback 1500ms timeout)
  useEffect(() => {
    const urls = CLIENTS.map((c) => c.photoUrl).filter(Boolean) as string[];

    const preloadAll = () => {
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
        const markLoaded = () => {
          const w = img.naturalWidth || 16;
          const h = img.naturalHeight || 9;
          setLoadedPhotos((prev) => ({
            ...prev,
            [url]: {
              loaded: true,
              aspect: `${w} / ${h}`,
              ratio: w / h,
            },
          }));
        };

        if (img.complete && img.naturalWidth > 0) {
          markLoaded();
        } else {
          img.onload = markLoaded;
        }
      });
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = (window as any).requestIdleCallback(preloadAll, { timeout: 1500 });
        return () => {
          if ("cancelIdleCallback" in window) {
            (window as any).cancelIdleCallback(id);
          }
        };
      } else {
        const timer = setTimeout(preloadAll, 200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Pointer Enter handler with timer cancellation and mouse detection
  const handleCellEnter = useCallback((client: ClientItem) => {
    if (typeof window !== "undefined") {
      const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!isFinePointer) return;
    }

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    setHoveredId(client.name);
    // TEMPORARY LOG per specification
    console.log("[clients-hover]", client.name, client.photoUrl || null);
  }, []);

  // Pointer Leave handler with 80ms delay to prevent gap flicker
  const handleCellLeave = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 80);
  }, []);

  // Cleanup leave timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
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
              className="text-[17px] sm:text-[19px] lg:text-[28px] font-semibold text-[#0A0A0A] uppercase tracking-tight"
            >
              Companies That Have Built With Us
            </h2>
            <p
              ref={sublineRef}
              className="text-[13px] lg:text-[14px] text-[#0A0A0A] mt-1.5"
            >
              Click any client to see their completed projects and facilities
            </p>
          </div>

          {/* Clean 2 columns on mobile, 3 columns on desktop */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center client-grid"
          >
            {CLIENTS.map((client, idx) => {
              const isHovered = hoveredId === client.name;
              const isDimmed = hoveredId !== null && !isHovered;
              const photoMeta = client.photoUrl ? loadedPhotos[client.photoUrl] : null;
              const hasLoadedPhoto = Boolean(photoMeta?.loaded);

              return (
                <div
                  key={client.name}
                  ref={(el) => {
                    cellRefs.current[idx] = el;
                  }}
                  data-hovered={isHovered ? "true" : undefined}
                  className={`cell relative w-full flex items-center justify-center ${
                    isHovered ? "is-focused" : isDimmed ? "is-dimmed" : ""
                  }`}
                  onPointerEnter={() => handleCellEnter(client)}
                  onPointerLeave={handleCellLeave}
                  onFocus={() => handleCellEnter(client)}
                  onBlur={handleCellLeave}
                >
                  <TransitionLink
                    to={client.projectUrl || "/projects/"}
                    className="group relative flex flex-col items-center justify-center p-3 sm:p-5 w-full select-none"
                  >
                    {/* Inner wrapper that receives blur(4px) without affecting reveal transforms */}
                    <div className="cell-inner w-full flex flex-col items-center justify-center">
                      {/* Logo and Project Photo Stage Area */}
                      <div className="relative w-full h-[90px] sm:h-[110px] md:h-[130px] lg:h-[145px] flex items-center justify-center">
                        {/* Client Logo Underneath: fades to opacity 0 over 250ms on photo reveal */}
                        <div
                          className={`client-logo-wrapper w-full h-full flex items-center justify-center ${
                            isHovered && hasLoadedPhoto ? "has-photo" : ""
                          }`}
                        >
                          {client.logo ? (
                            <img
                              src={client.logo}
                              alt={`${client.name} logo`}
                              width={client.width}
                              height={client.height}
                              loading={idx === 0 ? "eager" : "lazy"}
                              decoding="async"
                              className="w-full h-full object-contain block"
                            />
                          ) : (
                            <span className="font-semibold text-[16px] lg:text-[20px] text-[var(--ink)] tracking-tight group-hover:text-[var(--blue)] transition-colors">
                              {client.name}
                            </span>
                          )}
                        </div>

                        {/* Absolutely positioned project photo layer, centered in cell, max-height 220px */}
                        {client.photoUrl && (
                          <div
                            className="client-photo-wrapper"
                            style={
                              {
                                "--photo-aspect": photoMeta?.aspect || "16 / 9",
                                "--photo-ratio": photoMeta?.ratio || 1.777,
                              } as React.CSSProperties
                            }
                          >
                            <img
                              src={client.photoUrl}
                              alt={`${client.name} main project`}
                              className={`client-photo-img ${hasLoadedPhoto ? "is-ready" : ""}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Sector label under the logo stays visible and sharp */}
                      {client.projectNote && (
                        <span className="mt-3 text-center text-[11px] sm:text-[12px] uppercase tracking-wider text-[#0A0A0A] font-medium line-clamp-1 transition-colors">
                          {client.projectNote}
                        </span>
                      )}
                    </div>
                  </TransitionLink>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Embedded CSS for Hover Focus Blur and Project Photo Reveal */}
      <style>{`
        /* Mouse & Fine Pointer device behaviors */
        @media (hover: hover) and (pointer: fine) {
          /* 2. Blur transition on inner wrapper: 400ms cubic-bezier(.16, 1, .3, 1), no opacity change, no grey */
          .client-grid .cell-inner {
            transition: filter 400ms cubic-bezier(.16, 1, .3, 1);
            will-change: filter;
          }

          .client-grid .cell.is-dimmed .cell-inner {
            filter: blur(4px);
          }

          .client-grid .cell.is-focused .cell-inner {
            filter: blur(0px);
          }

          /* 3. Photo Layer: centered, width 100%, aspect-ratio from image, max-height 220px, clip-path inset(100% 0 0 0) */
          .client-photo-wrapper {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 20;
          }

          .client-photo-img {
            display: block;
            width: 100%;
            max-height: 220px;
            max-width: calc(220px * var(--photo-ratio, 1.777));
            aspect-ratio: var(--photo-aspect, 16 / 9);
            object-fit: cover;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            clip-path: inset(100% 0 0 0);
            transition: clip-path 300ms cubic-bezier(.76, 0, .24, 1);
            pointer-events: none;
          }

          .cell.is-focused .client-photo-img.is-ready {
            clip-path: inset(0 0 0 0);
            transition: clip-path 600ms cubic-bezier(.76, 0, .24, 1);
          }

          /* Logo underneath fades out to opacity 0 over 250ms when cell is focused and photo is available */
          .client-logo-wrapper {
            transition: opacity 250ms cubic-bezier(.16, 1, .3, 1);
          }

          .cell.is-focused .client-logo-wrapper.has-photo {
            opacity: 0;
          }
        }

        /* Reduced motion: instantaneous appearance, no transitions, no blur */
        @media (prefers-reduced-motion: reduce) {
          .client-grid .cell-inner,
          .client-grid .client-photo-img,
          .client-grid .client-logo-wrapper {
            filter: none !important;
            transition: none !important;
          }

          .cell.is-focused .client-photo-img.is-ready {
            clip-path: none !important;
            display: block !important;
          }

          .cell:not(.is-focused) .client-photo-img {
            clip-path: none !important;
            display: none !important;
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
              className="p-8 lg:p-10 space-y-4 text-white shadow-md transition-all duration-300 flex flex-col justify-start"
            >
              <h3 className="text-[17px] sm:text-[20px] lg:text-[26px] font-bold text-white uppercase tracking-tight">
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
              className="p-8 lg:p-10 space-y-4 text-white shadow-md transition-all duration-300 flex flex-col justify-start"
            >
              <h3 className="text-[17px] sm:text-[20px] lg:text-[26px] font-bold text-white uppercase tracking-tight">
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
              <h3 className="text-[17px] sm:text-[20px] lg:text-[24px] font-bold text-white uppercase tracking-tight">
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
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold uppercase text-[#0A0A0A] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
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
