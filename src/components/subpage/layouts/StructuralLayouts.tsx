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

  const heroImg = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202922/Columns-Beams-hero.jpg";
  const typeImages = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202918/Columns-beams-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202919/columns-beams-2.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202920/Columns-beams-3.jpg",
  ];
  const splitImg1 = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202922/Columns-beams-4.jpg";
  const splitImg2 = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202920/columns-beams-5.jpg";
  const nextImg = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202920/columns-beams-next.jpg";

  const splitSec1 = sections[2] || sections[0];
  const splitSec2 = sections[3] || sections[1];

  // Mobile types selector state & refs
  const [activeTypeIdx, setActiveTypeIdx] = useState(0);
  const activeTypeIdxRef = useRef(0);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileUnderlineRef = useRef<HTMLDivElement>(null);
  const mobileLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileTextRef = useRef<HTMLParagraphElement>(null);
  const mobileCaptionContainerRef = useRef<HTMLDivElement>(null);

  const swapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const textFadeTweenRef = useRef<gsap.core.Tween | null>(null);

  // Swipe gesture tracking on mobile
  const mobileSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const mobileHasHorizontalIntentRef = useRef<boolean | null>(null);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // DOM Refs for animations
  const cbRootRef = useRef<HTMLElement>(null);
  const desktopColsRef = useRef<HTMLDivElement>(null);
  const desktopColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopColPhotoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopColImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopColTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const desktopSplit1PhotoRef = useRef<HTMLDivElement>(null);
  const desktopSplit1ImgRef = useRef<HTMLImageElement>(null);
  const desktopSplit1TextRef = useRef<HTMLDivElement>(null);

  const desktopSplit2PhotoRef = useRef<HTMLDivElement>(null);
  const desktopSplit2ImgRef = useRef<HTMLImageElement>(null);
  const desktopSplit2TextRef = useRef<HTMLDivElement>(null);

  const mobileSplit1PhotoRef = useRef<HTMLDivElement>(null);
  const mobileSplit1ImgRef = useRef<HTMLImageElement>(null);
  const mobileSplit1TextRef = useRef<HTMLDivElement>(null);

  const mobileSplit2PhotoRef = useRef<HTMLDivElement>(null);
  const mobileSplit2ImgRef = useRef<HTMLImageElement>(null);
  const mobileSplit2TextRef = useRef<HTMLDivElement>(null);

  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Preload and decode images and refresh ScrollTrigger on decode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(debouncedRefresh);
    }

    const allUrls = [heroImg, ...typeImages, splitImg1, splitImg2, nextImg];
    allUrls.forEach((src) => {
      const img = new Image();
      img.src = cl(src, 1920);
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  // Update mobile sliding underline (translateX and width)
  const updateMobileUnderline = useCallback((idx: number) => {
    const tab = mobileTabRefs.current[idx];
    const underline = mobileUnderlineRef.current;
    if (!tab || !underline) return;

    const left = tab.offsetLeft;
    const width = tab.offsetWidth;

    gsap.to(underline, {
      x: left,
      width: width,
      duration: 0.4,
      ease: "E1",
      overwrite: "auto",
    });
  }, []);

  // Initial mobile setup
  useLayoutEffect(() => {
    // Initial states for mobile layers: slide 0 visible, 1 & 2 hidden
    mobileLayerRefs.current.forEach((layer, i) => {
      if (!layer) return;
      if (i === 0) {
        gsap.set(layer, {
          clipPath: "inset(0 0 0% 0)",
          zIndex: 1,
          visibility: "visible",
        });
      } else {
        gsap.set(layer, {
          clipPath: "inset(0 0 100% 0)",
          zIndex: 0,
          visibility: "hidden",
        });
      }
    });

    const initTab = mobileTabRefs.current[0];
    const underline = mobileUnderlineRef.current;
    if (initTab && underline) {
      gsap.set(underline, { x: initTab.offsetLeft, width: initTab.offsetWidth });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateMobileUnderline(activeTypeIdxRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateMobileUnderline]);

  // SWAP recipe for mobile photo change (wipe 1100ms E2, inner img scale 1.08 to 1 1600ms E1, text cross-fade 500ms)
  const selectType = useCallback(
    (nextIdx: number) => {
      if (nextIdx === activeTypeIdxRef.current) return;
      const prevIdx = activeTypeIdxRef.current;
      activeTypeIdxRef.current = nextIdx;
      setActiveTypeIdx(nextIdx);

      updateMobileUnderline(nextIdx);

      const activeTabEl = mobileTabRefs.current[nextIdx];
      if (activeTabEl) {
        activeTabEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }

      if (prefersReducedRef.current) {
        mobileLayerRefs.current.forEach((layer, i) => {
          if (!layer) return;
          if (i === nextIdx) {
            gsap.set(layer, { clipPath: "inset(0 0 0% 0)", zIndex: 1, visibility: "visible" });
          } else {
            gsap.set(layer, { zIndex: 0, visibility: "hidden" });
          }
        });
        if (mobileTitleRef.current) mobileTitleRef.current.textContent = typeCards[nextIdx].name.toUpperCase();
        if (mobileTextRef.current) mobileTextRef.current.textContent = typeCards[nextIdx].text;
        return;
      }

      if (swapTimelineRef.current) {
        swapTimelineRef.current.progress(1);
      }

      const inLayer = mobileLayerRefs.current[nextIdx];
      const inImg = mobileImgRefs.current[nextIdx];
      const outLayer = mobileLayerRefs.current[prevIdx];

      if (inLayer && inImg) {
        if (outLayer) {
          gsap.set(outLayer, { zIndex: 1, visibility: "visible" });
        }
        gsap.set(inLayer, {
          zIndex: 2,
          visibility: "visible",
          clipPath: "inset(0 0 100% 0)",
        });
        gsap.set(inImg, {
          scale: 1.08,
          transformOrigin: "center center",
        });

        const tl = gsap.timeline({
          onStart: () => {
            gsap.set(inLayer, { willChange: "clip-path" });
            gsap.set(inImg, { willChange: "transform" });
          },
          onComplete: () => {
            gsap.set(inLayer, { zIndex: 1, clearProps: "willChange" });
            gsap.set(inImg, { clearProps: "willChange,scale" });
            if (outLayer) {
              gsap.set(outLayer, { visibility: "hidden", zIndex: 0 });
            }
            swapTimelineRef.current = null;
          },
        });

        tl.to(
          inLayer,
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: "E2",
            overwrite: "auto",
          },
          0
        );

        tl.to(
          inImg,
          {
            scale: 1,
            duration: 1.6,
            ease: "E1",
            overwrite: "auto",
          },
          0
        );

        swapTimelineRef.current = tl;
      }

      // Text cross-fade 500ms
      if (mobileCaptionContainerRef.current) {
        if (textFadeTweenRef.current) textFadeTweenRef.current.kill();
        const el = mobileCaptionContainerRef.current;

        textFadeTweenRef.current = gsap.to(el, {
          opacity: 0,
          duration: 0.2,
          ease: "E1",
          onComplete: () => {
            if (mobileTitleRef.current) mobileTitleRef.current.textContent = typeCards[nextIdx].name.toUpperCase();
            if (mobileTextRef.current) mobileTextRef.current.textContent = typeCards[nextIdx].text;

            gsap.to(el, {
              opacity: 1,
              duration: 0.3,
              ease: "E1",
              clearProps: "opacity",
            });
          },
        });
      }
    },
    [typeCards, updateMobileUnderline]
  );

  // Swipe Gestures on Mobile Photo Box (threshold 40px, touch-action: pan-y)
  const onMobilePointerDown = (e: React.PointerEvent) => {
    mobileSwipeStartRef.current = { x: e.clientX, y: e.clientY };
    mobileHasHorizontalIntentRef.current = null;
  };

  const onMobilePointerMove = (e: React.PointerEvent) => {
    if (!mobileSwipeStartRef.current) return;
    const dx = e.clientX - mobileSwipeStartRef.current.x;
    const dy = e.clientY - mobileSwipeStartRef.current.y;

    if (mobileHasHorizontalIntentRef.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        mobileHasHorizontalIntentRef.current = Math.abs(dx) >= Math.abs(dy);
      }
    }
  };

  const onMobilePointerUp = (e: React.PointerEvent) => {
    if (!mobileSwipeStartRef.current) return;
    const dx = e.clientX - mobileSwipeStartRef.current.x;

    if (mobileHasHorizontalIntentRef.current && Math.abs(dx) >= 40) {
      if (dx < 0) {
        selectType((activeTypeIdxRef.current + 1) % typeCards.length);
      } else {
        selectType((activeTypeIdxRef.current - 1 + typeCards.length) % typeCards.length);
      }
    }

    mobileSwipeStartRef.current = null;
    mobileHasHorizontalIntentRef.current = null;
  };

  // Hover handlers for Desktop Types columns
  const handleColMouseEnter = (hoveredIdx: number) => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    desktopColRefs.current.forEach((col, idx) => {
      if (!col) return;
      if (idx !== hoveredIdx) {
        gsap.to(col, { opacity: 0.6, duration: 0.9, ease: "E1", overwrite: "auto" });
      } else {
        gsap.to(col, { opacity: 1, duration: 0.9, ease: "E1", overwrite: "auto" });
      }
    });

    const hoveredImg = desktopColImgRefs.current[hoveredIdx];
    if (hoveredImg) {
      gsap.to(hoveredImg, { scale: 1.03, duration: 0.9, ease: "E1", overwrite: "auto" });
    }
  };

  const handleColsMouseLeave = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    desktopColRefs.current.forEach((col) => {
      if (col) gsap.to(col, { opacity: 1, duration: 0.9, ease: "E1", overwrite: "auto" });
    });

    desktopColImgRefs.current.forEach((img) => {
      if (img) gsap.to(img, { scale: 1, duration: 0.9, ease: "E1", overwrite: "auto" });
    });
  };

  // Motion Setup: Desktop & Mobile MatchMedia
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        // 1. Desktop Types: 3 columns CURTAIN 1200ms, stagger 150ms; number, title, text RISE after.
        if (desktopColsRef.current) {
          const photoBoxes = desktopColPhotoRefs.current.filter(Boolean) as HTMLElement[];
          const innerImgs = desktopColImgRefs.current.filter(Boolean) as HTMLElement[];
          const textGroups = desktopColTextRefs.current.filter(Boolean) as HTMLElement[];

          gsap.set(photoBoxes, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(innerImgs, { scale: 1.06 });
          gsap.set(textGroups, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: desktopColsRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              photoBoxes.forEach((b) => gsap.set(b, { willChange: "clip-path" }));
              innerImgs.forEach((img) => gsap.set(img, { willChange: "transform" }));
              textGroups.forEach((t) => gsap.set(t, { willChange: "transform, opacity" }));
            },
            onComplete: () => {
              photoBoxes.forEach((b) => gsap.set(b, { clearProps: "willChange" }));
              innerImgs.forEach((img) => gsap.set(img, { clearProps: "willChange" }));
              textGroups.forEach((t) => gsap.set(t, { clearProps: "willChange" }));
            },
          });

          // CURTAIN 1200ms with E2, stagger 150ms
          tl.to(
            photoBoxes,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "E2",
              stagger: 0.15,
            },
            0
          );

          // Inner img scale 1.06 to 1 over 1.56s with E1
          tl.to(
            innerImgs,
            {
              scale: 1,
              duration: 1.56,
              ease: "E1",
              stagger: 0.15,
            },
            0
          );

          // Number, title, text RISE after (start at 0.5s into timeline)
          tl.to(
            textGroups,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
              stagger: 0.09,
            },
            0.5
          );
        }

        // 2. Desktop Split Row 1: CURTAIN from the text side (row 1 from the right edge), 1200ms; text RISE 300ms after.
        if (desktopSplit1PhotoRef.current && desktopSplit1TextRef.current) {
          const photoBox = desktopSplit1PhotoRef.current;
          const innerImg = desktopSplit1ImgRef.current;
          const textGroup = desktopSplit1TextRef.current;

          gsap.set(photoBox, { clipPath: "inset(0 0 0 100%)" });
          if (innerImg) gsap.set(innerImg, { scale: 1.06 });
          gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: photoBox,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(photoBox, { willChange: "clip-path" });
              if (innerImg) gsap.set(innerImg, { willChange: "transform" });
              gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(photoBox, { clearProps: "willChange" });
              if (innerImg) gsap.set(innerImg, { clearProps: "willChange" });
              gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          tl.to(
            photoBox,
            {
              clipPath: "inset(0 0 0 0%)",
              duration: 1.2,
              ease: "E2",
            },
            0
          );

          if (innerImg) {
            tl.to(
              innerImg,
              {
                scale: 1,
                duration: 1.56,
                ease: "E1",
              },
              0
            );
          }

          tl.to(
            textGroup,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
            },
            0.3
          );
        }

        // 3. Desktop Split Row 2: CURTAIN from the text side (row 2 from the left edge), 1200ms; text RISE 300ms after.
        if (desktopSplit2PhotoRef.current && desktopSplit2TextRef.current) {
          const photoBox = desktopSplit2PhotoRef.current;
          const innerImg = desktopSplit2ImgRef.current;
          const textGroup = desktopSplit2TextRef.current;

          gsap.set(photoBox, { clipPath: "inset(0 100% 0 0)" });
          if (innerImg) gsap.set(innerImg, { scale: 1.06 });
          gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: photoBox,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(photoBox, { willChange: "clip-path" });
              if (innerImg) gsap.set(innerImg, { willChange: "transform" });
              gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(photoBox, { clearProps: "willChange" });
              if (innerImg) gsap.set(innerImg, { clearProps: "willChange" });
              gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          tl.to(
            photoBox,
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.2,
              ease: "E2",
            },
            0
          );

          if (innerImg) {
            tl.to(
              innerImg,
              {
                scale: 1,
                duration: 1.56,
                ease: "E1",
              },
              0
            );
          }

          tl.to(
            textGroup,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
            },
            0.3
          );
        }
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        // Mobile Split Row 1: CURTAIN 900ms, then heading and text RISE
        if (mobileSplit1PhotoRef.current && mobileSplit1TextRef.current) {
          const photoBox = mobileSplit1PhotoRef.current;
          const innerImg = mobileSplit1ImgRef.current;
          const textGroup = mobileSplit1TextRef.current;

          gsap.set(photoBox, { clipPath: "inset(0 0 100% 0)" });
          if (innerImg) gsap.set(innerImg, { scale: 1.06 });
          gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: photoBox,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(photoBox, { willChange: "clip-path" });
              if (innerImg) gsap.set(innerImg, { willChange: "transform" });
              gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(photoBox, { clearProps: "willChange" });
              if (innerImg) gsap.set(innerImg, { clearProps: "willChange" });
              gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          tl.to(
            photoBox,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "E2",
            },
            0
          );

          if (innerImg) {
            tl.to(
              innerImg,
              {
                scale: 1,
                duration: 1.17,
                ease: "E1",
              },
              0
            );
          }

          tl.to(
            textGroup,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
            },
            0.25
          );
        }

        // Mobile Split Row 2: CURTAIN 900ms, then heading and text RISE
        if (mobileSplit2PhotoRef.current && mobileSplit2TextRef.current) {
          const photoBox = mobileSplit2PhotoRef.current;
          const innerImg = mobileSplit2ImgRef.current;
          const textGroup = mobileSplit2TextRef.current;

          gsap.set(photoBox, { clipPath: "inset(0 0 100% 0)" });
          if (innerImg) gsap.set(innerImg, { scale: 1.06 });
          gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: photoBox,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(photoBox, { willChange: "clip-path" });
              if (innerImg) gsap.set(innerImg, { willChange: "transform" });
              gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(photoBox, { clearProps: "willChange" });
              if (innerImg) gsap.set(innerImg, { clearProps: "willChange" });
              gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          tl.to(
            photoBox,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "E2",
            },
            0
          );

          if (innerImg) {
            tl.to(
              innerImg,
              {
                scale: 1,
                duration: 1.17,
                ease: "E1",
              },
              0
            );
          }

          tl.to(
            textGroup,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
            },
            0.25
          );
        }
      });

      // ==========================================
      // REDUCED MOTION: (prefers-reduced-motion: reduce)
      // ==========================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const photoBoxes = cbRootRef.current?.querySelectorAll(".cb-photo-box");
        const photoImgs = cbRootRef.current?.querySelectorAll(".cb-photo-img");
        const textBlocks = cbRootRef.current?.querySelectorAll(".cb-text-block");

        if (photoBoxes) gsap.set(photoBoxes, { clipPath: "inset(0 0 0% 0)" });
        if (photoImgs) gsap.set(photoImgs, { scale: 1 });
        if (textBlocks) gsap.set(textBlocks, { y: 0, opacity: 1 });
      });
    }, cbRootRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={cbRootRef} className="w-full bg-white text-left">
      {/* 1. Hero Band (Capitalized Heading) */}
      <HeroBand
        variant="immersive"
        imageSrc={heroImg}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Intro: The Role of Columns and Beams (One-Step TEXT STYLE: Heading UPPERCASE, ink; Text var(--blue)) */}
      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight">
              {(sections[0]?.title || "The Role of Columns and Beams").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 max-w-[640px]">
            {introPs.length > 0 ? (
              introPs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal leading-[1.6] lg:leading-[1.7]"
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal leading-[1.6] lg:leading-[1.7]">
                {sections[0]?.text ||
                  "Columns carry loads down to the foundation. Beams carry loads across openings and pass them to the columns. Together they form the frame that holds the whole building."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Types Fabricated Section */}
      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Heading: UPPERCASE, bold, ink colour */}
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8 lg:mb-12">
            {(typesSec?.title || "Types Fabricated").toUpperCase()}
          </h2>

          {/* Desktop: Types Fabricated stays 3 columns (gap 40px); each photo box has the real photo shape (1024/687, not 3:4); number, title, text under it */}
          <div
            ref={desktopColsRef}
            onMouseLeave={handleColsMouseLeave}
            className="hidden lg:grid grid-cols-3 gap-10"
          >
            {typeCards.map((tc, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  desktopColRefs.current[idx] = el;
                }}
                onMouseEnter={() => handleColMouseEnter(idx)}
                className="flex flex-col text-left transition-opacity duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {/* Real photo shape (1024 / 687) with CURTAIN reveal */}
                <div
                  ref={(el) => {
                    desktopColPhotoRefs.current[idx] = el;
                  }}
                  className="w-full aspect-[1024/687] overflow-hidden mb-6 bg-slate-100"
                >
                  <img
                    ref={(el) => {
                      desktopColImgRefs.current[idx] = el;
                    }}
                    src={cl(typeImages[idx] || typeImages[0], 1920)}
                    alt={tc.name}
                    width={1024}
                    height={687}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>

                <div
                  ref={(el) => {
                    desktopColTextRefs.current[idx] = el;
                  }}
                >
                  {/* Title: bold, ink colour, uppercase, 20px, weight 700 */}
                  <h3 className="text-[20px] font-bold uppercase text-[#0A0A0A] leading-snug mb-2">
                    {tc.name.toUpperCase()}
                  </h3>

                  {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, 16px / 1.7 */}
                  <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                    {tc.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Types as a selector: a row of 3 tabs (type names in the title style). Under it a full-width photo that changes, and the text of the active type. Swipe changes the type. */}
          <div className="lg:hidden">
            {/* Tabs Row: 3 tabs with 1px border under row and 2px blue line under active tab. Thin 2px scrollbar in between */}
            <div
              className="relative border-b border-[#E5E5E5] flex justify-between gap-6 pb-2 mb-6 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#94A3B8_#E5E5E5] [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-track]:bg-[#E5E5E5] [&::-webkit-scrollbar-thumb]:bg-[#94A3B8] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden"
              role="tablist"
              aria-label="Types Fabricated"
            >
              {typeCards.map((tc, idx) => {
                const isActive = activeTypeIdx === idx;
                return (
                  <button
                    key={idx}
                    ref={(el) => {
                      mobileTabRefs.current[idx] = el;
                    }}
                    role="tab"
                    id={`tab-type-${idx}`}
                    aria-controls={`panel-type-${idx}`}
                    aria-selected={isActive}
                    onClick={() => selectType(idx)}
                    type="button"
                    className="pb-2 text-left transition-colors cursor-pointer text-[17px] font-bold uppercase text-[#0A0A0A] leading-snug whitespace-nowrap bg-transparent border-0 p-0 focus-visible:outline-none"
                  >
                    {tc.name.toUpperCase()}
                  </button>
                );
              })}

              {/* 2px sliding blue line under active tab */}
              <div
                ref={mobileUnderlineRef}
                className="absolute bottom-2 left-0 h-[2px] bg-[var(--blue)] transform-gpu origin-left pointer-events-none"
                style={{ width: "1px" }}
              />
            </div>

            {/* Under tabs: Full-width photo that changes with SWAP recipe and swipe gesture */}
            <div
              onPointerDown={onMobilePointerDown}
              onPointerMove={onMobilePointerMove}
              onPointerUp={onMobilePointerUp}
              onPointerCancel={onMobilePointerUp}
              style={{ touchAction: "pan-y" }}
              className="relative w-full aspect-[1024/687] overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing mb-6"
            >
              {typeCards.map((tc, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    mobileLayerRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <img
                    ref={(el) => {
                      mobileImgRefs.current[idx] = el;
                    }}
                    src={cl(typeImages[idx], 1920)}
                    alt={tc.name}
                    width={1024}
                    height={687}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Under photo: Title, Text of the active type with cross-fade (no numbering) */}
            <div
              ref={mobileCaptionContainerRef}
              id={`panel-type-${activeTypeIdx}`}
              role="tabpanel"
              aria-labelledby={`tab-type-${activeTypeIdx}`}
              className="text-left"
            >
              {/* Title: 17px bold ink colour, uppercase */}
              <h3
                ref={mobileTitleRef}
                className="text-[17px] font-bold uppercase text-[#0A0A0A] leading-snug mb-2"
              >
                {typeCards[0]?.name.toUpperCase()}
              </h3>

              {/* Text: 15px / 1.6 var(--blue) */}
              <p
                ref={mobileTextRef}
                className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]"
              >
                {typeCards[0]?.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SPLIT ROW 1: How Steel Mind Engineers Fabricates
          Desktop:
            - photo half has real photo shape (1024/687), flush to screen edge (row 1 left);
            - row height follows the photo (no fixed min-height);
            - text half is vertically centered, max width 480px, no grey background;
            - CURTAIN from the text side (from the right edge), 1200ms; text RISE 300ms after.
          Mobile:
            - Stacked: full-width photo, heading, text; CURTAIN 900ms, then heading and text RISE.
      ======================================================== */}
      <section className="w-full bg-white border-t border-[var(--rule)]">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-2 items-center w-full">
          {/* Photo half flush to left edge */}
          <div
            ref={desktopSplit1PhotoRef}
            className="w-full aspect-[1024/687] overflow-hidden bg-slate-100"
          >
            <img
              ref={desktopSplit1ImgRef}
              src={cl(splitImg1, 1920)}
              alt={(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
              width={1024}
              height={687}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Text half vertically centered, max-w 480px, no grey background */}
          <div className="flex justify-center items-center px-12 xl:px-16 py-12">
            <div ref={desktopSplit1TextRef} className="max-w-[480px] w-full text-left">
              <h2 className="text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4">
                {(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
              </h2>
              <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                {splitSec1?.text ||
                  "The team checks the plates and sections on arrival, cuts them to the sizes on the drawing, drills or punches bolt holes, fits and welds the parts, and inspects the welds and dimensions. The parts are then cleaned and painted, marked and packed in erection order. See Painting."}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View: Stacked full-width photo, heading, text */}
        <div className="lg:hidden w-full px-6 py-10">
          <div
            ref={mobileSplit1PhotoRef}
            className="w-full aspect-[1024/687] overflow-hidden mb-6 bg-slate-100"
          >
            <img
              ref={mobileSplit1ImgRef}
              src={cl(splitImg1, 1920)}
              alt={(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
              width={1024}
              height={687}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </div>
          <div ref={mobileSplit1TextRef} className="text-left">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-3">
              {(splitSec1?.title || "How Steel Mind Engineers Fabricates").toUpperCase()}
            </h2>
            <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
              {splitSec1?.text ||
                "The team checks the plates and sections on arrival, cuts them to the sizes on the drawing, drills or punches bolt holes, fits and welds the parts, and inspects the welds and dimensions. The parts are then cleaned and painted, marked and packed in erection order. See Painting."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SPLIT ROW 2: Accuracy Matters
          Desktop:
            - text half on left, vertically centered, max width 480px, no grey background;
            - photo half on right, flush to screen edge, real shape 1024/687;
            - row height follows the photo;
            - CURTAIN from the text side (from the left edge), 1200ms; text RISE 300ms after.
          Mobile:
            - Stacked: full-width photo, heading, text; CURTAIN 900ms, then heading and text RISE.
      ======================================================== */}
      <section className="w-full bg-white border-t border-b border-[var(--rule)]">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-2 items-center w-full">
          {/* Text half vertically centered, max-w 480px, no grey background */}
          <div className="flex justify-center items-center px-12 xl:px-16 py-12">
            <div ref={desktopSplit2TextRef} className="max-w-[480px] w-full text-left">
              <h2 className="text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4">
                {(splitSec2?.title || "Accuracy Matters").toUpperCase()}
              </h2>
              <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                {splitSec2?.text ||
                  "A hole in the wrong place or a beam that is 10 mm short can delay a whole site. Steel Mind Engineers checks dimensions after cutting so that parts fit the first time."}
              </p>
            </div>
          </div>

          {/* Photo half flush to right edge */}
          <div
            ref={desktopSplit2PhotoRef}
            className="w-full aspect-[1024/687] overflow-hidden bg-slate-100"
          >
            <img
              ref={desktopSplit2ImgRef}
              src={cl(splitImg2, 1920)}
              alt={(splitSec2?.title || "Accuracy Matters").toUpperCase()}
              width={1024}
              height={687}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        {/* Mobile View: Stacked full-width photo, heading, text */}
        <div className="lg:hidden w-full px-6 py-10">
          <div
            ref={mobileSplit2PhotoRef}
            className="w-full aspect-[1024/687] overflow-hidden mb-6 bg-slate-100"
          >
            <img
              ref={mobileSplit2ImgRef}
              src={cl(splitImg2, 1920)}
              alt={(splitSec2?.title || "Accuracy Matters").toUpperCase()}
              width={1024}
              height={687}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </div>
          <div ref={mobileSplit2TextRef} className="text-left">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-3">
              {(splitSec2?.title || "Accuracy Matters").toUpperCase()}
            </h2>
            <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
              {splitSec2?.text ||
                "A hole in the wrong place or a beam that is 10 mm short can delay a whole site. Steel Mind Engineers checks dimensions after cutting so that parts fit the first time."}
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        heading="ENGINEERED OPEN-WEB STEEL TRUSSES FOR LONG SPANS AND HIGH ROOF LOADS."
        image={nextImg}
        nextUrl="/structural-steel-fabrication-pakistan/trusses/"
        nextTitle="TRUSSES"
      />
    </article>
  );
};

// 9.19 Trusses — signature: "Sticky 7fr/5fr viewer on rail (Desktop) + editorial flow with tick rail (Mobile)"
export const TrussesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  // Exact Image URLs specified in brief
  const HERO_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202995/trusses-hero.jpg";
  const NEXT_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202999/Trusses-next.jpg";

  const blocks = [
    {
      num: "01",
      title: "What a truss is",
      text: "A truss is a frame made of straight members arranged in triangles. The triangles share the load, so each member carries only tension or compression. This lets a truss span a long distance with little steel.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792203006/truusses-1.jpg",
    },
    {
      num: "02",
      title: "Where trusses are used",
      text: "Trusses support the roofs of sheds, workshops, halls, stadium stands, petrol stations and farms. They suit open-sided buildings, where their shape is also visible and attractive.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202981/trusses-2.jpg",
    },
    {
      num: "03",
      title: "Common truss types",
      text: "A pitched truss has a top chord that slopes to both sides, the usual shape for sheds. A parallel-chord truss has parallel top and bottom chords and suits flat roofs and floor systems. A space truss is a three-dimensional frame for very large roofs.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202988/Trusses-3.jpg",
    },
    {
      num: "04",
      title: "Tubes or angles",
      text: "Trusses can use steel tubes or angle sections. Tubes look clean and resist weather well. Angles are easy to connect and often cost less. The engineer will recommend one based on span, load and budget.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202990/Trusses-4.jpg",
    },
    {
      num: "05",
      title: "Delivery and erection",
      text: "Long trusses are made in parts, delivered on trucks and joined on site. Steel Mind Engineers plans the splice points so that each part can travel and be lifted safely.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202997/Trusses-5.jpg",
    },
  ];

  // Active item tracking (ACTIVE 50% rule)
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const displayedIdxRef = useRef(0);
  const hoverControlledRef = useRef(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation & DOM refs
  const rootRef = useRef<HTMLElement>(null);
  const desktopLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const barFillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSwapTweenRef = useRef<gsap.core.Timeline | null>(null);
  const railFillRef = useRef<HTMLDivElement>(null);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 5. Preload and decode all 5 photos before the first swap
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(debouncedRefresh);
    }

    const allUrls = [HERO_IMAGE, ...blocks.map((b) => b.img), NEXT_IMAGE];
    allUrls.forEach((src) => {
      const img = new Image();
      img.src = cl(src, 1920);
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, []);

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
    const nextImg = desktopImgRefs.current[nextIdx];
    if (!nextLayer) return;

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
      onStart: () => {
        gsap.set(nextLayer, { willChange: "clip-path" });
        if (nextImg) gsap.set(nextImg, { willChange: "transform" });
      },
      onComplete: () => {
        gsap.set(nextLayer, { zIndex: 1, clearProps: "willChange" });
        if (nextImg) gsap.set(nextImg, { clearProps: "willChange,scale" });
        if (currentLayer) {
          gsap.set(currentLayer, { visibility: "hidden", zIndex: 0 });
        }
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

    // Initial check on mount
    onScroll();

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
      if (typeof window === "undefined") return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
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

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
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

        // RISE text on enter (transform and opacity only)
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
              onStart: () => {
                textGroup.forEach((t) => gsap.set(t, { willChange: "transform, opacity" }));
              },
              onComplete: () => {
                textGroup.forEach((t) => gsap.set(t, { clearProps: "willChange" }));
              },
            }
          );
        });
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
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
              onStart: () => {
                gsap.set(photoBox, { willChange: "clip-path" });
                if (photoImg) gsap.set(photoImg, { willChange: "transform" });
              },
              onComplete: () => {
                gsap.set(photoBox, { clearProps: "willChange" });
                if (photoImg) gsap.set(photoImg, { clearProps: "willChange,scale" });
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
                onStart: () => {
                  textGroup.forEach((t) => gsap.set(t, { willChange: "transform, opacity" }));
                },
                onComplete: () => {
                  textGroup.forEach((t) => gsap.set(t, { clearProps: "willChange" }));
                },
              }
            );
          }
        });
      });

      // ==========================================
      // REDUCED MOTION: Show final state at once
      // ==========================================
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
      {/* 1. HERO SECTION: Full photo shape (1024/572), UPPERCASE capitalized bold headings, NO subheading in banner */}
      <section data-hero className="relative w-full bg-[#0A0A0A] overflow-hidden">
        {/* Desktop Hero */}
        <div
          className="hidden md:flex relative w-full overflow-hidden flex-col justify-end"
          style={{
            height: "min(calc(100svh - 40px), 640px)",
            minHeight: "480px",
          }}
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={cl(HERO_IMAGE, 2560)}
              alt="Steel roof trusses in Pakistan"
              width={1024}
              height={572}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_45%]"
            />
          </div>

          {/* Flat nav blue tint 28% + Dark Contrast Gradients */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.28)" }}
          />
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 65%)",
            }}
          />

          {/* Bottom text block: Title + CTA button ONLY */}
          <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8 relative z-[3] pb-12 lg:pb-16 text-left">
            <h1
              className="text-[28px] lg:text-[44px] font-bold text-white uppercase tracking-[-0.02em] leading-[1.15] max-w-[860px]"
            >
              STEEL ROOF TRUSSES IN PAKISTAN: LIGHT, STRONG MEMBERS FOR LONG SPANS
            </h1>

            <div className="mt-6">
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

        {/* Mobile Hero: Compact, tight, zero empty space */}
        <div className="md:hidden w-full flex flex-col">
          <div
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
            style={{ aspectRatio: "1024 / 572" }}
          >
            <img
              src={cl(HERO_IMAGE, 1080)}
              alt="Steel roof trusses in Pakistan"
              width={1024}
              height={572}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.25)" }}
            />
          </div>

          <div
            className="w-full text-white text-left px-6 py-6"
            style={{ backgroundColor: "var(--blue)" }}
          >
            <h1 className="text-[16px] font-bold text-white uppercase tracking-[-0.02em] leading-tight">
              STEEL ROOF TRUSSES IN PAKISTAN: LIGHT, STRONG MEMBERS FOR LONG SPANS
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
      </section>

      {/* 2. MAIN SECTION: Two columns (7fr / 5fr, gap 88px) Desktop + Editorial Flow Mobile */}
      <section className="w-full bg-white py-12 lg:py-24 px-6 lg:px-8 border-b border-[var(--rule)] relative">
        <div className="max-w-[1360px] mx-auto">
          {/* Section Heading: UPPERCASE bold ink color (Mobile 16px, Desktop 44px) */}
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4 lg:mb-6">
            STEEL ROOF TRUSSES SPECIFICATIONS
          </h2>

          {/* Subheading placed directly below main heading */}
          <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] max-w-[840px] mb-10 lg:mb-16">
            A truss is a frame of straight members arranged in triangles, so it spans long distances with little steel. Steel Mind Engineers fabricates pitched, parallel-chord and space trusses for roofs and sheds.
          </p>

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
                      ref={(el) => {
                        desktopImgRefs.current[idx] = el;
                      }}
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

              {/* Under the box: 5 thin bars (active = blue, PROGRESS BARS 600ms E1) */}
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
            <div id="trusses-rail-container" className="relative w-full">
              {/* Rail Vertical Lines: 2px wide, centered at exactly left: 24px */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[rgba(30,58,138,0.18)] pointer-events-none"
                style={{ left: "24px", transform: "translateX(-50%)" }}
              />
              <div
                ref={railFillRef}
                className="absolute top-0 bottom-0 w-[2px] bg-[var(--blue)] origin-top transform-gpu pointer-events-none"
                style={{ left: "24px", transform: "translateX(-50%)" }}
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
                    className="min-h-[72svh] flex flex-col justify-center py-12 relative text-left"
                    style={{ paddingLeft: "64px" }}
                  >
                    {/* Rail Dot: 10px circle perfectly centered at left: 24px and top: 50% */}
                    <div
                      className={`absolute w-[10px] h-[10px] rounded-full z-10 transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--blue)] border-2 border-[var(--blue)]"
                          : "bg-white border-2 border-[var(--blue)]"
                      }`}
                      style={{
                        left: "24px",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />

                    {/* Block Content (RISE once, full colour kept on all blocks) */}
                    <div className="block-content">
                      {/* Number: solid, bold, var(--blue), placed above title, like One-Step. 64px, weight 800 */}
                      <div className="text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                        {b.num}
                      </div>

                      {/* Title: bold, ink colour, sentence case. 20px, weight 700 */}
                      <h3 className="text-[20px] font-bold text-[#0A0A0A] leading-snug mb-3">
                        {b.title}
                      </h3>

                      {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, 16px / 1.7 */}
                      <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7] max-w-[480px]">
                        {b.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile View: Editorial flow with non-intrusive right-edge sticky tick rail */}
          <div className="lg:hidden relative w-full">
            {/* Vertical tick rail of 5 tick bars fixed at right edge of the section (2px x 18px inactive, active 44px blue) */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[14px] pointer-events-none z-20 flex justify-end"
              aria-hidden="true"
            >
              <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
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
            </div>

            {/* Blocks: full-width photo, number, title, text, 56px between blocks */}
            <div className="space-y-[56px] text-left pr-5 pb-24">
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
                      src={cl(b.img, 1920)}
                      alt={b.title}
                      width={1024}
                      height={687}
                      className="mobile-photo-img w-full h-full object-cover block"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding={idx === 0 ? "auto" : "async"}
                    />
                  </div>

                  {/* Under photo: number, title, text (RISE) */}
                  <div className="mobile-text-group mt-4">
                    {/* Number: 40px solid bold var(--blue), weight 800 */}
                    <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                      {b.num}
                    </div>

                    {/* Title: 17px bold sentence case ink colour, weight 700 */}
                    <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mb-2">
                      {b.title}
                    </h3>

                    {/* Text: 15px / 1.6 var(--blue), regular weight */}
                    <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
                      {b.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 4. NEXT BANNER: Real photo shape (1024/434), UPPERCASE capitalized heading */}
      <section className="w-full bg-[#0A0A0A] border-t border-[#E5E5E5]/20 overflow-hidden">
        <TransitionLink
          to="/structural-steel-fabrication-pakistan/mezzanine-floors/"
          className="group block w-full no-underline select-none cursor-pointer"
        >
          {/* Desktop Next Banner */}
          <div className="hidden md:block relative w-full h-[380px] lg:h-[440px] overflow-hidden bg-[#0A0A0A]">
            <img
              src={cl(NEXT_IMAGE, 2560)}
              alt="Mezzanine Floors"
              width={1024}
              height={434}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.25)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
              }}
            />
            <div className="absolute bottom-10 lg:bottom-14 left-6 lg:left-12 max-w-[840px] text-left z-10">
              <h2 className="text-[26px] lg:text-[44px] font-bold uppercase text-white tracking-[-0.02em] leading-[1.18] mb-5">
                CUSTOM-DESIGNED STRUCTURAL STEEL MEZZANINE FLOORS
              </h2>
              <div className="inline-flex items-center gap-2.5 text-[15px] lg:text-[17px] font-semibold text-white">
                <span>MEZZANINE FLOORS</span>
                <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 text-[20px]">
                  &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Next Banner */}
          <div className="md:hidden w-full flex flex-col">
            <div
              className="relative w-full overflow-hidden bg-[#0A0A0A]"
              style={{ aspectRatio: "1024 / 434" }}
            >
              <img
                src={cl(NEXT_IMAGE, 1080)}
                alt="Mezzanine Floors"
                width={1024}
                height={434}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center block"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
              />
            </div>
            <div
              style={{ backgroundColor: "var(--blue)" }}
              className="w-full text-white px-6 py-8 text-left"
            >
              <h2 className="text-[16px] font-bold uppercase text-white tracking-[-0.02em] leading-tight mb-4">
                CUSTOM-DESIGNED STRUCTURAL STEEL MEZZANINE FLOORS
              </h2>
              <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-white">
                <span>MEZZANINE FLOORS</span>
                <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 text-[17px]">
                  &rarr;
                </span>
              </div>
            </div>
          </div>
        </TransitionLink>
      </section>
    </article>
  );
};

// 9.20 Mezzanine Floors — signature: "5 alternating rows with real photo ratio"
export const MezzanineFloorsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);

  const MEZZ_IMAGES = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202949/mezz-floors-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202953/mezz-floors-2.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202954/mezz-floors-3.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202958/mezz-floors-4.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202960/mezz-floors-5.jpg",
  ];

  const blocks = [
    {
      num: "01",
      title: "What This Page Covers",
      text: "This page covers mezzanine floors as stand-alone steel work, for existing buildings, for concrete buildings and for new buildings of any type. For mezzanines inside a new PEB, see Mezzanine System.",
      img: MEZZ_IMAGES[0],
    },
    {
      num: "02",
      title: "Where Mezzanines Help",
      text: "A mezzanine adds floor area without a new building. Factories use them for offices and light assembly. Warehouses use them for small-item picking. Showrooms use them for display and meetings.",
      img: MEZZ_IMAGES[1],
    },
    {
      num: "03",
      title: "What Steel Mind Engineers Provides",
      text: "Steel Mind Engineers designs the columns, beams and deck, fabricates them in Lahore and erects the floor on site. It can also add the staircase, the handrails and the access gate. See Steel Stairs.",
      img: MEZZ_IMAGES[2],
    },
    {
      num: "04",
      title: "Project Reference",
      text: "Steel Mind Engineers built a mezzanine floor of 32,400 square feet for Haier at Raiwind, 12 feet high, 180 feet wide and 180 feet long. It also built a PEB mezzanine floor of 7,020 square feet for Maria B in Lahore, 12 feet high, 90 feet wide and 78 feet long.",
      img: MEZZ_IMAGES[3],
    },
    {
      num: "05",
      title: "What to Send for a Quote",
      text: "Send the floor area, the height between floors, the use and the heaviest load. Send a sketch of the existing building if there is one.",
      img: MEZZ_IMAGES[4],
    },
  ];

  // GSAP Animations with Setup Rules and Motion Recipes
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        const rows = rootRef.current?.querySelectorAll<HTMLElement>(".mezz-row");
        if (!rows) return;

        rows.forEach((row, idx) => {
          const line = row.querySelector<HTMLElement>(".mezz-line");
          const photoWrapper = row.querySelector<HTMLElement>(".mezz-photo-wrapper");
          const photoBox = row.querySelector<HTMLElement>(".mezz-photo-box");
          const photoImg = row.querySelector<HTMLElement>(".mezz-photo-img");
          const textItems = row.querySelectorAll<HTMLElement>(".mezz-text-item");

          const isOddRow = idx % 2 === 0; // 0, 2, 4 = rows 1, 3, 5: photo left, text right
          // Curtain variant from text side:
          // Odd rows: text is on right -> curtain starts from right edge of photo
          // Even rows: text is on left -> curtain starts from left edge of photo
          const initialClip = isOddRow ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

          // Set hidden start states before paint
          if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left" });
          if (photoBox) gsap.set(photoBox, { clipPath: initialClip });
          if (photoImg) gsap.set(photoImg, { scale: 1.06 });
          if (textItems.length > 0) gsap.set(textItems, { y: 24, opacity: 0 });

          // 1. Reveal timeline triggered at top 85%
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // Line DRAW (1000ms E2)
          if (line) {
            tl.to(
              line,
              {
                scaleX: 1,
                duration: 1.0,
                ease: E2,
                clearProps: "transform",
              },
              0
            );
          }

          // Photo CURTAIN 1200ms with E2; inner img scale 1.06 to 1 over 1560ms with E1
          if (photoBox) {
            tl.to(
              photoBox,
              {
                clipPath: "inset(0 0 0 0%)",
                duration: 1.2,
                ease: E2,
                clearProps: "clipPath",
              },
              0
            );
          }
          if (photoImg) {
            tl.to(
              photoImg,
              {
                scale: 1,
                duration: 1.56,
                ease: E1,
                clearProps: "transform",
              },
              0
            );
          }

          // number, heading, text RISE 300ms after (stagger 90ms, 900ms E1)
          if (textItems.length > 0) {
            tl.to(
              textItems,
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: E1,
                stagger: 0.09,
                clearProps: "transform,opacity",
              },
              0.3
            );
          }

          // Photo WRAPPER drifts y 0 to -20px (scrub 1.4); photo inside never moves
          if (photoWrapper) {
            gsap.fromTo(
              photoWrapper,
              { y: 0 },
              {
                y: -20,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.4,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        });
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        const blocks = rootRef.current?.querySelectorAll<HTMLElement>(".mezz-m-block");
        if (!blocks) return;

        blocks.forEach((block) => {
          const photoBox = block.querySelector<HTMLElement>(".mezz-m-photo-box");
          const photoImg = block.querySelector<HTMLElement>(".mezz-m-photo-img");
          const textItems = block.querySelectorAll<HTMLElement>(".mezz-m-text-item");

          // Hidden start states
          if (photoBox) gsap.set(photoBox, { clipPath: "inset(0 0 100% 0)" });
          if (photoImg) gsap.set(photoImg, { scale: 1.06 });
          if (textItems.length > 0) gsap.set(textItems, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // CURTAIN 900ms with E2; inner img scale 1.06 to 1 over 1170ms with E1
          if (photoBox) {
            tl.to(
              photoBox,
              {
                clipPath: "inset(0 0 0 0%)",
                duration: 0.9,
                ease: E2,
                clearProps: "clipPath",
              },
              0
            );
          }
          if (photoImg) {
            tl.to(
              photoImg,
              {
                scale: 1,
                duration: 1.17,
                ease: E1,
                clearProps: "transform",
              },
              0
            );
          }

          // Heading & body text RISE after curtain begins (350ms delay, 90ms stagger, 900ms E1)
          if (textItems.length > 0) {
            tl.to(
              textItems,
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: E1,
                stagger: 0.09,
                clearProps: "transform,opacity",
              },
              0.35
            );
          }
        });
      });

      // ==========================================
      // REDUCED MOTION: (prefers-reduced-motion: reduce)
      // ==========================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const photoBoxes = rootRef.current?.querySelectorAll(".mezz-photo-box, .mezz-m-photo-box");
        const photoImgs = rootRef.current?.querySelectorAll(".mezz-photo-img, .mezz-m-photo-img");
        const textItems = rootRef.current?.querySelectorAll(".mezz-text-item, .mezz-m-text-item");
        const lines = rootRef.current?.querySelectorAll(".mezz-line");

        if (photoBoxes) gsap.set(photoBoxes, { clipPath: "inset(0 0 0 0%)" });
        if (photoImgs) gsap.set(photoImgs, { scale: 1 });
        if (textItems) gsap.set(textItems, { y: 0, opacity: 1 });
        if (lines) gsap.set(lines, { scaleX: 1 });
      });
    }, rootRef);

    // Refresh ScrollTrigger after debounced delay
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left">
      {/* 1. Hero Band (Capitalized Heading, btn-sm matching Columns and Beams) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202962/mezz-floors-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Desktop: 5 Alternating Rows (Odd: photo 7fr, text 5fr; Even: text 5fr, photo 7fr) */}
      <section className="hidden lg:block w-full max-w-[1360px] mx-auto px-8 lg:px-12">
        {blocks.map((b, idx) => {
          const isOddRow = idx % 2 === 0; // 0, 2, 4 = rows 1, 3, 5 (odd)
          return (
            <div key={b.num} className="mezz-row relative w-full">
              {/* 1px DRAW line between rows */}
              {idx > 0 && (
                <div className="mezz-line absolute top-0 left-0 right-0 h-[1px] bg-[#E5E5E5] origin-left" />
              )}

              <div
                className={`w-full py-[96px] grid items-center gap-[88px] ${
                  isOddRow ? "grid-cols-[7fr_5fr]" : "grid-cols-[5fr_7fr]"
                }`}
              >
                {isOddRow ? (
                  <>
                    {/* Photo Column (7fr) with real photo shape */}
                    <div className="mezz-photo-wrapper relative w-full">
                      <div
                        className="mezz-photo-box relative w-full overflow-hidden"
                        style={{ aspectRatio: "1024 / 687" }}
                      >
                        <img
                          src={cl(b.img, 1920)}
                          alt={b.title}
                          width={1024}
                          height={687}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="mezz-photo-img w-full h-full object-cover block"
                        />
                      </div>
                    </div>

                    {/* Text Column (5fr, max width 440px) */}
                    <div className="mezz-text-block max-w-[440px] text-left">
                      <span className="mezz-text-item block text-[64px] font-[800] text-[var(--blue)] leading-none select-none mb-4">
                        {b.num}
                      </span>
                      <h3 className="mezz-text-item text-[44px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-4">
                        {b.title.toUpperCase()}
                      </h3>
                      <p className="mezz-text-item text-[16px] text-[#0A0A0A] font-normal leading-[1.7]">
                        {b.text}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text Column (5fr, max width 440px) */}
                    <div className="mezz-text-block max-w-[440px] text-left">
                      <span className="mezz-text-item block text-[64px] font-[800] text-[var(--blue)] leading-none select-none mb-4">
                        {b.num}
                      </span>
                      <h3 className="mezz-text-item text-[44px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-4">
                        {b.title.toUpperCase()}
                      </h3>
                      <p className="mezz-text-item text-[16px] text-[#0A0A0A] font-normal leading-[1.7]">
                        {b.text}
                      </p>
                    </div>

                    {/* Photo Column (7fr) with real photo shape */}
                    <div className="mezz-photo-wrapper relative w-full">
                      <div
                        className="mezz-photo-box relative w-full overflow-hidden"
                        style={{ aspectRatio: "1024 / 687" }}
                      >
                        <img
                          src={cl(b.img, 1920)}
                          alt={b.title}
                          width={1024}
                          height={687}
                          loading="lazy"
                          decoding="async"
                          className="mezz-photo-img w-full h-full object-cover block"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Mobile: Editorial Flow (Full-width photo, text kept OUT of image, 56px gap, no numbers) */}
      <section className="block lg:hidden w-full px-5 py-12 space-y-[56px]">
        {blocks.map((b, idx) => (
          <div key={b.num} className="mezz-m-block w-full text-left">
            {/* Real photo shape with NO text inside */}
            <div
              className="mezz-m-photo-box relative w-full overflow-hidden"
              style={{ aspectRatio: "1024 / 687" }}
            >
              <img
                src={cl(b.img, 1080)}
                alt={b.title}
                width={1024}
                height={687}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="mezz-m-photo-img w-full h-full object-cover block"
              />
            </div>

            {/* Content OUTSIDE the image: Heading + Body Text */}
            <div className="mezz-m-content mt-4">
              <h3 className="mezz-m-text-item text-[17px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-[1.25] mb-2">
                {b.title.toUpperCase()}
              </h3>
              <p className="mezz-m-text-item text-[15px] text-[#0A0A0A] font-normal leading-[1.6]">
                {b.text}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 4. FAQ (Capitalized Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)] border-t border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 5. Next Banner (Capitalized Heading) */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202966/mezz-floors-next.jpg"
        nextUrl="/structural-steel-fabrication-pakistan/steel-bridges/"
        nextTitle="Steel Bridges"
        heading="CUSTOM-DESIGNED STRUCTURAL STEEL BRIDGES IN PAKISTAN"
      />
    </article>
  );
};

// 9.21 Steel Bridges — signature: "Span diagram"
export const SteelBridgesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);

  // Desktop refs
  const desktopIntroHeadingRef = useRef<HTMLHeadingElement>(null);
  const desktopIntroTextRef = useRef<HTMLParagraphElement>(null);
  const desktopWideWrapperRef = useRef<HTMLDivElement>(null);
  const desktopWideBoxRef = useRef<HTMLDivElement>(null);
  const desktopWideImgRef = useRef<HTMLImageElement>(null);
  const desktopSpanRef = useRef<HTMLDivElement>(null);
  const girderPathRef = useRef<SVGPathElement>(null);
  const girderDetailsRef = useRef<HTMLDivElement>(null);
  const desktopColRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile refs
  const mobileIntroHeadingRef = useRef<HTMLHeadingElement>(null);
  const mobileIntroTextRef = useRef<HTMLParagraphElement>(null);
  const mobileWideBoxRef = useRef<HTMLDivElement>(null);
  const mobileWideImgRef = useRef<HTMLImageElement>(null);
  const mobileRailContainerRef = useRef<HTMLDivElement>(null);
  const mobileRailFillRef = useRef<HTMLDivElement>(null);
  const mobileBottomDiamondRef = useRef<HTMLDivElement>(null);
  const mobileBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // FAQ state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const HERO_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202967/bridges-hero.jpg";
  const WIDE_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202975/bridges-wide.jpg";
  const NEXT_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202974/bridges-next.jpg";

  const introTitle = "WHY STEEL FOR BRIDGES";
  const introText =
    "Steel bridges are light, strong and quick to install. The parts are made in a factory and lifted into place, which reduces road closures and site work.";

  const blocks = [
    {
      num: "01",
      title: "What Steel Mind Engineers fabricates",
      text: "Pedestrian footbridges span roads, canals and drains. Plant and conveyor bridges are steel walkways and supports between buildings. Girder bridges use steel girders with a deck for light vehicle or equipment loads.",
    },
    {
      num: "02",
      title: "Design points",
      text: "The span and width set the depth of the girders. Choose the load from the people, vehicles or equipment that will use the bridge. Bridges stay outdoors, so the coating system matters. See Painting. The crane size and the lift plan must also fit the site.",
    },
    {
      num: "03",
      title: "Project reference",
      text: "Steel Mind Engineers built a water requirement bridge at Petaro Cantt, Sindh. The bridge is 150 feet long, 6 feet wide and 30 feet high, with an area of 900 square feet.",
    },
  ];

  // GSAP Animations with Setup Rules and Motion Recipes
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        // 1. Desktop Intro: RISE (y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
        if (desktopIntroHeadingRef.current && desktopIntroTextRef.current) {
          const introElements = [desktopIntroHeadingRef.current, desktopIntroTextRef.current];
          gsap.set(introElements, { y: 24, opacity: 0 });

          gsap.to(introElements, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.09,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: desktopIntroHeadingRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // 2. Wide band: CURTAIN 1200ms; wrapper drifts y 0 to -24px (scrub 1.4, desktop only)
        if (desktopWideBoxRef.current && desktopWideImgRef.current && desktopWideWrapperRef.current) {
          const box = desktopWideBoxRef.current;
          const img = desktopWideImgRef.current;
          const wrapper = desktopWideWrapperRef.current;

          gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(img, { scale: 1.06 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(box, { willChange: "clip-path" });
              gsap.set(img, { willChange: "transform" });
            },
            onComplete: () => {
              gsap.set(box, { clearProps: "willChange,clipPath" });
              gsap.set(img, { clearProps: "willChange,transform" });
            },
          });

          // CURTAIN: clip-path inset(0 0 100% 0) to inset(0 0 0% 0) over 1200ms with E2
          tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: E2 }, 0);
          // Inner img scale 1.06 to 1 over d x 1.3 (1560ms) with E1
          tl.to(img, { scale: 1, duration: 1.56, ease: E1 }, 0);

          // Wrapper drifts y 0 to -24px (scrub 1.4, desktop only)
          gsap.fromTo(
            wrapper,
            { y: 0 },
            {
              y: -24,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // 3. Desktop Span Diagram: lines DRAW (stroke-dashoffset 1800ms E2); supports/labels fade 500ms after; 3 cols RISE
        if (desktopSpanRef.current) {
          const cols = desktopColRefs.current.filter(Boolean) as HTMLElement[];
          gsap.set(cols, { y: 24, opacity: 0 });

          const path = girderPathRef.current;
          let pathLen = 1200;
          if (path) {
            try {
              pathLen = path.getTotalLength() || 1200;
            } catch {
              pathLen = 1200;
            }
            gsap.set(path, {
              strokeDasharray: pathLen,
              strokeDashoffset: pathLen,
            });
          }

          if (girderDetailsRef.current) {
            gsap.set(girderDetailsRef.current, { opacity: 0 });
          }

          const spanTl = gsap.timeline({
            scrollTrigger: {
              trigger: desktopSpanRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              if (path) gsap.set(path, { willChange: "stroke-dashoffset" });
              cols.forEach((c) => gsap.set(c, { willChange: "transform,opacity" }));
            },
            onComplete: () => {
              if (path) gsap.set(path, { clearProps: "willChange" });
              cols.forEach((c) => gsap.set(c, { clearProps: "willChange,transform,opacity" }));
            },
          });

          // Lines DRAW (stroke-dashoffset 1800ms E2)
          if (path) {
            spanTl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: E2 }, 0);
          }

          // Supports & end bearings fade in 500ms after draw starts
          if (girderDetailsRef.current) {
            spanTl.to(girderDetailsRef.current, { opacity: 1, duration: 0.5, ease: E1 }, 0.5);
          }

          // 3 Columns RISE (y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
          spanTl.to(cols, { y: 0, opacity: 1, duration: 0.9, ease: E1, stagger: 0.09 }, 0.6);
        }
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        // 1. Mobile Intro: RISE (y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
        if (mobileIntroHeadingRef.current && mobileIntroTextRef.current) {
          const introEls = [mobileIntroHeadingRef.current, mobileIntroTextRef.current];
          gsap.set(introEls, { y: 24, opacity: 0 });

          gsap.to(introEls, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.09,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: mobileIntroHeadingRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // 2. Mobile Wide Image: CURTAIN 1200ms
        if (mobileWideBoxRef.current && mobileWideImgRef.current) {
          const box = mobileWideBoxRef.current;
          const img = mobileWideImgRef.current;

          gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(img, { scale: 1.06 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(box, { willChange: "clip-path" });
              gsap.set(img, { willChange: "transform" });
            },
            onComplete: () => {
              gsap.set(box, { clearProps: "willChange,clipPath" });
              gsap.set(img, { clearProps: "willChange,transform" });
            },
          });

          tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: E2 }, 0);
          tl.to(img, { scale: 1, duration: 1.56, ease: E1 }, 0);
        }

        // 3. Mobile Vertical Span Line (Rail) & Blocks RISE
        if (mobileRailContainerRef.current) {
          const blocksEls = mobileBlockRefs.current.filter(Boolean) as HTMLElement[];
          gsap.set(blocksEls, { y: 24, opacity: 0 });

          // Blocks RISE once (y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
          gsap.to(blocksEls, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.09,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: mobileRailContainerRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // RAIL(fill) vertical, scrub 1.2; start "top 60%", end "bottom 60%" of the rail container
          if (mobileRailFillRef.current) {
            const fill = mobileRailFillRef.current;
            const container = mobileRailContainerRef.current;
            const bottomDiamond = mobileBottomDiamondRef.current;
            const dots = mobileDotRefs.current.filter(Boolean) as HTMLElement[];

            gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });

            ScrollTrigger.create({
              trigger: container,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 1.2,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                gsap.set(fill, { scaleY: p });

                // Bottom diamond fills when the fill reaches it
                if (bottomDiamond) {
                  if (p >= 0.98) {
                    bottomDiamond.classList.add("bg-[var(--blue)]");
                    bottomDiamond.classList.remove("bg-white");
                  } else {
                    bottomDiamond.classList.remove("bg-[var(--blue)]");
                    bottomDiamond.classList.add("bg-white");
                  }
                }

                // Each block dot fills as the line passes
                const containerRect = container.getBoundingClientRect();
                const containerH = containerRect.height;
                const fillY = containerH * p;

                dots.forEach((dot) => {
                  const dotTop = dot.offsetTop + dot.offsetHeight / 2;
                  if (fillY >= dotTop) {
                    dot.classList.add("bg-[var(--blue)]");
                    dot.classList.remove("bg-white");
                  } else {
                    dot.classList.remove("bg-[var(--blue)]");
                    dot.classList.add("bg-white");
                  }
                });
              },
            });
          }
        }
      });

      // ==========================================
      // REDUCED MOTION: (prefers-reduced-motion: reduce)
      // ==========================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const boxes = rootRef.current?.querySelectorAll(
          ".wide-box, .mobile-wide-box"
        );
        const imgs = rootRef.current?.querySelectorAll(
          ".wide-img, .mobile-wide-img"
        );
        const textItems = rootRef.current?.querySelectorAll(
          ".intro-item, .span-col, .rail-block"
        );
        const path = girderPathRef.current;
        const girderDetails = girderDetailsRef.current;
        const fill = mobileRailFillRef.current;
        const bottomDiamond = mobileBottomDiamondRef.current;
        const dots = mobileDotRefs.current.filter(Boolean) as HTMLElement[];

        if (boxes) gsap.set(boxes, { clipPath: "none" });
        if (imgs) gsap.set(imgs, { scale: 1 });
        if (textItems) gsap.set(textItems, { y: 0, opacity: 1 });
        if (path) gsap.set(path, { strokeDashoffset: 0 });
        if (girderDetails) gsap.set(girderDetails, { opacity: 1 });
        if (fill) gsap.set(fill, { scaleY: 1 });
        if (bottomDiamond) {
          bottomDiamond.classList.add("bg-[var(--blue)]");
          bottomDiamond.classList.remove("bg-white");
        }
        dots.forEach((dot) => {
          dot.classList.add("bg-[var(--blue)]");
          dot.classList.remove("bg-white");
        });
      });
    }, rootRef);

    // Refresh ScrollTrigger after debounced delay
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left">
      {/* 1. HERO BAND (Capitalized Heading, solid white on photo) */}
      <HeroBand
        variant="immersive"
        imageSrc={HERO_IMAGE}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO SECTION: Left-aligned, UPPERCASE Heading, var(--blue) body text */}
      {/* Desktop Intro (1024px and up) */}
      <section className="hidden lg:block w-full bg-white py-[72px] lg:py-[96px] px-8 lg:px-12 border-b border-[var(--rule)]">
        <div className="max-w-[1280px] mx-auto text-left">
          <div className="max-w-[760px] text-left">
            <h2
              ref={desktopIntroHeadingRef}
              className="intro-item text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-[1.15] mb-6"
            >
              {introTitle}
            </h2>
            <p
              ref={desktopIntroTextRef}
              className="intro-item text-[16px] font-normal text-[#0A0A0A] leading-[1.7]"
            >
              {introText}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Intro (below 1024px) */}
      <section className="block lg:hidden w-full bg-white py-12 px-5 border-b border-[var(--rule)] text-left">
        <div className="w-full text-left">
          <h2
            ref={mobileIntroHeadingRef}
            className="intro-item text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-4"
          >
            {introTitle}
          </h2>
          <p
            ref={mobileIntroTextRef}
            className="intro-item text-[15px] font-normal text-[#0A0A0A] leading-[1.6]"
          >
            {introText}
          </p>
        </div>
      </section>

      {/* 3. WIDE BAND: 100vw, aspect-ratio: 64 / 27, no crop */}
      {/* Desktop Wide Band (with drift scrub 1.4) */}
      <section className="hidden lg:block w-full overflow-hidden bg-[#0A0A0A]">
        <div ref={desktopWideWrapperRef} className="w-full">
          <div
            ref={desktopWideBoxRef}
            className="wide-box relative w-full overflow-hidden"
            style={{ aspectRatio: "64 / 27" }}
          >
            <img
              ref={desktopWideImgRef}
              src={cl(WIDE_IMAGE, 2560)}
              alt="Steel Bridge Girder Fabrication at Steel Mind Engineers"
              width={2560}
              height={1080}
              loading="lazy"
              decoding="async"
              className="wide-img w-full h-full object-cover block"
            />
          </div>
        </div>
      </section>

      {/* Mobile Wide Band: full width at 64:27 */}
      <section className="block lg:hidden w-full overflow-hidden bg-[#0A0A0A]">
        <div
          ref={mobileWideBoxRef}
          className="mobile-wide-box relative w-full overflow-hidden"
          style={{ aspectRatio: "64 / 27" }}
        >
          <img
            ref={mobileWideImgRef}
            src={cl(WIDE_IMAGE, 1920)}
            alt="Steel Bridge Girder Fabrication at Steel Mind Engineers"
            width={1920}
            height={810}
            loading="lazy"
            decoding="async"
            className="mobile-wide-img w-full h-full object-cover block"
          />
        </div>
      </section>

      {/* 4. DESKTOP SPAN DIAGRAM & 3 COLUMNS */}
      <section
        ref={desktopSpanRef}
        className="hidden lg:block w-full bg-white py-[96px] lg:py-[120px] px-8 lg:px-12 border-b border-[var(--rule)]"
      >
        <div className="max-w-[1280px] mx-auto text-left">
          {/* Bridge Girder SVG Span Diagram (DRAW: stroke-dashoffset 1800ms E2) */}
          <div className="relative w-full mb-16">
            <svg
              viewBox="0 0 1200 64"
              fill="none"
              className="w-full h-[64px] overflow-visible"
              aria-hidden="true"
            >
              {/* Girder Structure Path: Top chord, bottom chord, diagonal truss webbing */}
              <path
                ref={girderPathRef}
                d="M 10 18 L 1190 18 M 10 38 L 1190 38 M 10 18 L 60 38 L 110 18 L 160 38 L 200 18 L 200 38 L 240 18 L 280 38 L 330 18 L 380 38 L 430 18 L 480 38 L 530 18 L 580 38 L 600 18 L 600 38 L 620 38 L 670 18 L 720 38 L 770 18 L 820 38 L 870 18 L 920 38 L 970 18 L 1000 38 L 1000 18 L 1030 38 L 1080 18 L 1130 38 L 1190 18"
                stroke="var(--blue)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Supports, end bearings, and vertical drop lines connecting to the 3 columns (fade in 500ms after) */}
            <div ref={girderDetailsRef} className="absolute inset-0 pointer-events-none">
              {/* Left End Bearing Diamond (10px diamond rotated 45deg) */}
              <div
                className="absolute w-[10px] h-[10px] bg-[var(--blue)] rotate-45"
                style={{ left: "10px", top: "18px", transform: "translate(-50%, -50%) rotate(45deg)" }}
              />
              {/* Right End Bearing Diamond */}
              <div
                className="absolute w-[10px] h-[10px] bg-[var(--blue)] rotate-45"
                style={{ right: "10px", top: "18px", transform: "translate(50%, -50%) rotate(45deg)" }}
              />

              {/* 3 Column Drop Connection Points */}
              <div className="w-full grid grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Vertical hanger line dropping down from girder to columns */}
                    <div className="w-[2px] h-[26px] bg-[var(--blue)] mt-[38px]" />
                    {/* 10px circular bearing dot */}
                    <div className="w-[10px] h-[10px] rounded-full bg-[var(--blue)] -mt-[1px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Columns: Solid bold number, Title, Text in One-Step Text Style */}
          <div className="grid grid-cols-3 gap-12 lg:gap-16 items-start">
            {blocks.map((b, idx) => (
              <div
                key={b.num}
                ref={(el) => {
                  desktopColRefs.current[idx] = el;
                }}
                className="span-col flex flex-col items-start text-left"
              >
                {/* Number: solid, bold, var(--blue), placed above title. Desktop: 64px, weight 800 */}
                <div className="text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                  {b.num}
                </div>

                {/* Title: bold, ink colour, sentence case. Desktop: 20px, weight 700 */}
                <h3 className="text-[20px] font-bold text-[#0A0A0A] leading-snug mb-3">
                  {b.title}
                </h3>

                {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, 16px / 1.7 */}
                <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MOBILE SPAN LINE (RAIL): 2px blue, 12px from left edge, 10px diamonds, 10px dots, padding-left: 36px, 48px gap */}
      <section className="block lg:hidden w-full bg-white py-12 px-5 border-b border-[var(--rule)]">
        <div
          ref={mobileRailContainerRef}
          className="relative w-full text-left"
          style={{ paddingLeft: "36px" }}
        >
          {/* Vertical Rail Line: 12px from left edge */}
          {/* Top Diamond: 10px diamond, center at left: 12px, top: 0, filled at load (bg-[var(--blue)]) */}
          <div
            className="absolute w-[10px] h-[10px] bg-[var(--blue)] z-10"
            style={{
              left: "12px",
              top: "0px",
              transform: "translate(-50%, -50%) rotate(45deg)",
            }}
            aria-hidden="true"
          />

          {/* Background Rail Track: 2px wide, centered at left: 12px */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#E5E5E5] pointer-events-none"
            style={{ left: "12px", transform: "translateX(-50%)" }}
            aria-hidden="true"
          />

          {/* Active Rail Fill Line: 2px blue, scaleY scrubbed with ScrollTrigger */}
          <div
            ref={mobileRailFillRef}
            className="absolute top-0 bottom-0 w-[2px] bg-[var(--blue)] pointer-events-none origin-top"
            style={{ left: "12px", transform: "translateX(-50%) scaleY(0)" }}
            aria-hidden="true"
          />

          {/* Bottom Diamond: 10px diamond, center at left: 12px, bottom: 0, fills when fill reaches it */}
          <div
            ref={mobileBottomDiamondRef}
            className="absolute w-[10px] h-[10px] bg-white border-2 border-[var(--blue)] z-10 transition-colors duration-200"
            style={{
              left: "12px",
              bottom: "0px",
              transform: "translate(-50%, 50%) rotate(45deg)",
            }}
            aria-hidden="true"
          />

          {/* 3 Blocks: sitting right of line, 48px between blocks */}
          <div className="space-y-[48px]">
            {blocks.map((b, idx) => (
              <div
                key={b.num}
                ref={(el) => {
                  mobileBlockRefs.current[idx] = el;
                }}
                className="rail-block relative flex flex-col items-start"
              >
                {/* Dot on the rail line: 10px circle, centered at left: 12px (which is -24px relative to padding-left 36px) */}
                <div
                  ref={(el) => {
                    mobileDotRefs.current[idx] = el;
                  }}
                  className="absolute w-[10px] h-[10px] rounded-full bg-white border-2 border-[var(--blue)] z-10 transition-colors duration-200"
                  style={{
                    left: "-24px",
                    top: "20px",
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden="true"
                />

                {/* Number: 40px, weight 800, solid bold var(--blue) */}
                <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                  {b.num}
                </div>

                {/* Title: 17px, weight 700, ink colour, sentence case */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mb-2">
                  {b.title}
                </h3>

                {/* Text: 15px / 1.6, regular weight, var(--blue) */}
                <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-8 border-b border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 7. NEXT BANNER (CAPITALIZED HEADING, EXACT URL) */}
      <NextBand
        image={NEXT_IMAGE}
        nextUrl="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
        nextTitle="Crane Gantry Structures"
        heading="CUSTOM-DESIGNED CRANE GANTRY STRUCTURES IN PAKISTAN"
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
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro + Full image g3 */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={(sections[0]?.title || "What a Gantry Structure Is").toUpperCase()}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
        <div className="mt-12">
          <PhotoBox src={IMG.structural.gantry.g3} alt="Complete Gantry Structure Yard" ratio="16/9" />
        </div>
      </section>

      {/* 2. Parts Triptych: 2 tall image tiles + 1 Royal Blue tile */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-8 uppercase" style={{ fontSize: "var(--fs-h2)" }}>
          {(partsSec?.title || "Parts of a Gantry").toUpperCase()}
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
            <h3 className="text-[24px] font-bold text-white uppercase leading-[1.2]">
              {(partsSec?.title || "Integrated Engineering").toUpperCase()}
            </h3>
            <p className="text-white text-[15px] leading-[1.7]">
              {partsSec?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Design Points Ledger */}
      {designSec && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] mb-8 uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em]">
            {designSec.title.toUpperCase()}
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
        <section className="w-full bg-[var(--blue)] text-white">
          {/* Desktop Band */}
          <div className="hidden lg:block container px-4 sm:px-6 lg:px-8 text-left space-y-5 py-12 lg:py-[var(--sec-y-lg)]">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-[600] tracking-[-0.025em] text-white leading-[1.15] uppercase">
              {compareSec.title.toUpperCase()}
            </h2>
            <p className="text-white text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.65] max-w-[760px]">
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

          {/* Mobile Band: padding 48px 24px, heading & text mobile sizes of TEXT STYLE, white, max-w 32ch, button 24px under text, left aligned */}
          <div
            className="block lg:hidden text-left"
            style={{ padding: "48px 24px" }}
          >
            <h2 className="text-[17px] sm:text-[19px] font-bold text-white uppercase tracking-[-0.02em] leading-tight">
              {compareSec.title.toUpperCase()}
            </h2>
            <p className="text-[15px] font-normal text-white leading-[1.6] max-w-[32ch] mt-3">
              {compareSec.text}
            </p>
            <div className="mt-[24px]">
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
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] mb-8 uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              FREQUENTLY ASKED QUESTIONS
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
        heading="CUSTOM-DESIGNED MACHINE FRAMES IN PAKISTAN"
      />
    </article>
  );
};
