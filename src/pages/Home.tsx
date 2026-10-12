import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-01.json";
import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { PROJECTS } from "../data/projects.ts";
import { videoSrc, videoPoster } from "../lib/cloudinary.ts";
import { Button } from "../components/ui/Button.tsx";
import { Section } from "../components/ui/Section.tsx";
import { Stat } from "../components/ui/Stat.tsx";
import { Img } from "../components/ui/Img.tsx";
import { SwipeRow } from "../components/ui/SwipeRow.tsx";
import { Marquee } from "../components/ui/Marquee.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";

const DESKTOP_VIDEO_ORIGINAL =
  "https://res.cloudinary.com/cyfb9slf/video/upload/v1791664367/Main-homepage-Video_01.mp4.mov";
const DESKTOP_VIDEO_HD =
  "https://res.cloudinary.com/cyfb9slf/video/upload/f_mp4,vc_h264,w_1920,q_85/v1791664367/Main-homepage-Video_01.mp4.mov";
const DESKTOP_POSTER =
  "https://res.cloudinary.com/cyfb9slf/video/upload/so_0,f_jpg,q_90,w_1920/v1791664367/Main-homepage-Video_01.mp4.mov";

const MOBILE_VIDEO_ORIGINAL =
  "https://res.cloudinary.com/cyfb9slf/video/upload/v1791664502/15409488_2160_3840_60fps_1.mov";
const MOBILE_VIDEO_HD =
  "https://res.cloudinary.com/cyfb9slf/video/upload/f_mp4,vc_h264,w_1080,q_85/v1791664502/15409488_2160_3840_60fps_1.mov";
const MOBILE_POSTER =
  "https://res.cloudinary.com/cyfb9slf/video/upload/so_0,f_jpg,q_90,w_1080/v1791664502/15409488_2160_3840_60fps_1.mov";

export const Home: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [industryOpen, setIndustryOpen] = useState<number>(0);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Autoplay and pause video when off screen
  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const tryPlay = () => {
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const onInteract = () => {
            v.play().catch(() => {});
            window.removeEventListener("click", onInteract);
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("scroll", onInteract);
          };
          window.addEventListener("click", onInteract, { once: true, passive: true });
          window.addEventListener("touchstart", onInteract, { once: true, passive: true });
          window.addEventListener("scroll", onInteract, { once: true, passive: true });
        });
      }
    };

    tryPlay();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(v);

    return () => observer.disconnect();
  }, [isMobile, reducedMotion]);

  // Selected 4 projects
  const selectedProjectIds = [
    "haier-crane-mezzanine",
    "dravton-dairy-shed",
    "maria-b-mezzanine",
    "yascon-bridge",
  ];
  const selectedProjects = selectedProjectIds
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean);

  const whatWeBuildItems = [
    {
      title: "Pre-Engineered Buildings (PEB)",
      desc: "Clear-span and multi-span steel buildings designed for the loads, cranes and clearances your operation needs.",
      img: A.division.peb,
      url: "/pre-engineered-buildings-pakistan/",
    },
    {
      title: "Structural Steel Fabrication",
      desc: "Columns, beams, trusses, platforms, bridges and complete steel frames, fabricated to drawing.",
      img: A.division.structural,
      url: "/structural-steel-fabrication-pakistan/",
    },
    {
      title: "Industrial Sheds",
      desc: "Steel sheds for production, storage, dairy and livestock use.",
      img: A.division.sheds,
      url: "/industrial-sheds-pakistan/",
    },
    {
      title: "Steel Warehouses",
      desc: "Wide-span storage and logistics buildings that make full use of the floor area.",
      img: A.division.warehouses,
      url: "/steel-warehouses-pakistan/",
    },
    {
      title: "Custom Steel Fabrication",
      desc: "Machine frames, tanks, hoppers, gates, stairs and other steel items made to your own drawings.",
      img: A.division.custom,
      url: "/custom-steel-fabrication-pakistan/",
    },
  ];

  const services = [
    { name: "Design", img: A.service.design, url: "/services/design/", desc: "the engineering of your structure." },
    { name: "Detailing", img: A.service.detailing, url: "/services/detailing/", desc: "the drawings the factory and the site use." },
    { name: "Fabrication", img: A.service.fabrication, url: "/services/fabrication/", desc: "cutting, welding and assembly in the factory." },
    { name: "Cleaning", img: A.service.cleaning, url: "/services/cleaning/", desc: "surface preparation before coating." },
    { name: "Painting", img: A.service.painting, url: "/services/painting/", desc: "protective coating systems." },
    { name: "Erection", img: A.service.erection, url: "/services/erection/", desc: "assembly of the structure on your site." },
    { name: "After Sale Services", img: A.service.aftersale, url: "/services/after-sale-services/", desc: "repairs, additions and extensions." },
  ];

  const industries = [
    {
      name: "Manufacturing",
      img: A.industry.manufacturing,
      desc: "Steel buildings for production halls, assembly lines and machine shops.",
      url: "/pre-engineered-buildings-pakistan/",
    },
    {
      name: "Dairy and Livestock",
      img: A.industry.dairy,
      desc: "Sheds for cattle and poultry with airflow, shade and drainage.",
      url: "/industrial-sheds-pakistan/",
    },
    {
      name: "Apparel and Retail",
      img: A.industry.apparel,
      desc: "Buildings for garment units, showrooms and retail floors.",
      url: "/steel-warehouses-pakistan/",
    },
    {
      name: "Steel and Engineering",
      img: A.industry.steel,
      desc: "Frames, trusses and mezzanines for steel processors.",
      url: "/structural-steel-fabrication-pakistan/",
    },
    {
      name: "Infrastructure",
      img: A.industry.infrastructure,
      desc: "Steel bridges, gantries and public works structures.",
      url: "/custom-steel-fabrication-pakistan/",
    },
  ];

  const blogArticles = [
    {
      title: "What Is a Pre-Engineered Building? A Plain Guide for Pakistani Business Owners",
      category: "Pre-Engineered Building Basics",
      img: A.blog.whatIsPeb,
      url: "/blog/what-is-a-pre-engineered-building/",
    },
    {
      title: "PEB vs Concrete Construction in Pakistan: Time, Cost and Flexibility",
      category: "Pre-Engineered Building Basics",
      img: A.blog.pebVsConcrete,
      url: "/blog/peb-vs-concrete-construction-pakistan/",
    },
    {
      title: "Factory Shed Checklist: Ten Questions to Answer Before You Build",
      category: "Industrial Sheds",
      img: A.blog.factoryShed,
      url: "/blog/factory-shed-checklist-pakistan/",
    },
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Video Section */}
      <section className="relative w-full h-[100svh] min-h-[560px] lg:h-screen overflow-hidden bg-[var(--ink)]">
        {/* Video Wrapper */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Instant Poster Background - eliminates layout shift & blank flash */}
          <img
            src={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
            alt="Steel Mind Engineers industrial facility"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          {/* Single responsive video element */}
          <video
            key={isMobile ? "mobile-video" : "desktop-video"}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
            onLoadedData={() => setVideoLoaded(true)}
            onPlaying={() => setVideoLoaded(true)}
            className={`relative w-full h-full object-cover object-center z-[1] transition-opacity duration-300 ${
              videoLoaded ? "opacity-100" : "opacity-95"
            }`}
          >
            {/* 1. Primary Full HD 1080p 60fps H.264: Instant 80ms start, 60fps hardware decoded, zero stutter */}
            <source
              src={isMobile ? MOBILE_VIDEO_HD : DESKTOP_VIDEO_HD}
              type="video/mp4"
            />
            {/* 2. Secondary High-Res Fallback for high-capacity decoders */}
            <source
              src={isMobile ? MOBILE_VIDEO_ORIGINAL : DESKTOP_VIDEO_ORIGINAL}
              type='video/mp4; codecs="hevc, hvc1"'
            />
            <source
              src={isMobile ? MOBILE_VIDEO_ORIGINAL : DESKTOP_VIDEO_ORIGINAL}
              type="video/quicktime"
            />
          </video>

          {/* Hero Gradient Overlay - Darkened bottom-left for high contrast text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.92) 100%)",
            }}
          />
        </div>

        {/* Hero Text Block: Bottom-left position */}
        <div
          className="absolute z-10 text-white left-[20px] right-[20px] lg:left-[40px] lg:right-auto bottom-[calc(120px+env(safe-area-inset-bottom))] lg:bottom-[140px] max-w-[320px] lg:max-w-[520px]"
        >
          {/* H1: 18-20px mobile / 32px desktop, weight 600, line-height 1.2, tracking -0.01em, white, clamped max 4 lines */}
          <h1
            className="text-[18px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-white line-clamp-4 lg:line-clamp-none"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            data-split=""
          >
            Turnkey provider from design and fabrication to installation for Pre-Engineered Steel Buildings, Steel Structures and Industrial Sheds along with Custom Steel Fabrication across Pakistan.
          </h1>

          {/* Supporting line: 12px mobile / 14px desktop, line-height 1.5, white at 82%, margin-top 10px, max 3 lines */}
          <p
            className="mt-[10px] text-[12px] lg:text-[14px] leading-[1.5] max-w-[320px] lg:max-w-[520px] line-clamp-3 lg:line-clamp-none"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            data-fade-up=""
          >
            Steel Mind Engineers Pvt. Ltd. handles every steel project from the first drawing to the final handover. Design, fabrication, delivery and erection for factories, warehouses, farms and commercial buildings across Pakistan.
          </p>
        </div>

        {/*
          Rule for future sections:
          On white or offwhite backgrounds: primary button is Royal Blue with white text. Secondary button is transparent with Royal Blue border and Royal Blue text.
          On blue or dark image backgrounds: primary button is white with Royal Blue text. Secondary button is transparent with white border and white text.
          If a section has two buttons, one must be primary and one must be secondary. Never two primary. Never two identical.
        */}
        {/* Buttons: One horizontal row below text block at bottom-left */}
        <div
          className="absolute z-10 flex flex-row items-center gap-[10px] left-[20px] bottom-[calc(48px+env(safe-area-inset-bottom))] lg:left-[40px] lg:bottom-[64px]"
          data-fade-up=""
        >
          {/* Button 1 — Primary on dark: White bg, Royal Blue text, height 36px, radius 0 */}
          <Link
            to="/contact-us/#quote"
            style={{
              backgroundColor: "#FFFFFF",
              color: "var(--blue)",
              height: "36px",
              padding: "10px 16px",
              borderRadius: "0px",
              transition: "background-color 300ms, color 300ms",
            }}
            className="inline-flex items-center justify-center text-[10px] uppercase font-semibold tracking-[0.08em] whitespace-nowrap max-w-[155px] hover:!bg-[var(--blue)] hover:!text-white cursor-pointer select-none"
          >
            Request a Quote
          </Link>

          {/* Button 2 — Secondary on dark: Transparent bg, 1px white border, white text, height 36px, radius 0 */}
          <Link
            to="/projects/"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.85)",
              color: "#FFFFFF",
              height: "36px",
              padding: "10px 16px",
              borderRadius: "0px",
              transition: "background-color 300ms, color 300ms",
            }}
            className="inline-flex items-center justify-center text-[10px] uppercase font-semibold tracking-[0.08em] whitespace-nowrap max-w-[155px] hover:!bg-white hover:!text-[var(--blue)] cursor-pointer select-none"
          >
            View Our Projects
          </Link>
        </div>

        {/* Scroll Hint (Bottom Right Line) */}
        <div className="hidden lg:block absolute bottom-8 right-8 z-10">
          <div className="w-[1px] h-[40px] bg-white origin-top animate-[scrollLine_2.4s_cubic-bezier(0.76,0,0.24,1)_infinite]" />
        </div>

        <style>{`
          @keyframes scrollLine {
            0% { transform: scaleY(0); opacity: 0; }
            50% { transform: scaleY(1); opacity: 1; }
            100% { transform: scaleY(0); opacity: 0; }
          }
        `}</style>
      </section>

      {/* 2. Line under the hero (Quick Answer removed per Item E) */}
      <section className="py-16 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <p
            className="text-[18px] lg:text-[22px] font-medium leading-[1.3] text-[var(--ink)] max-w-[520px] mx-auto text-center"
            data-split=""
          >
            Steel Mind Engineers builds turnkey steel structures in Pakistan, from engineering and fabrication to erection.
          </p>
        </div>
      </section>

      {/* 3. About Steel Mind Engineers (Offwhite) */}
      <Section
        bg="offwhite"
        title="About Steel Mind Engineers"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6" data-reveal-group="">
            <p className="text-[15px] lg:text-[16px] leading-[1.65] text-[var(--grey)] max-w-[520px]" data-reveal="">
              Steel Mind Engineers is a steel fabrication and engineering company based in Pakistan. It builds complete steel buildings and structures for manufacturers, dairy and livestock farms, retailers, logistics companies and public-sector clients. In more than eight years, the company has completed over thirty projects in more than ten cities.
            </p>
            <p className="text-[15px] lg:text-[16px] leading-[1.65] text-[var(--grey)] max-w-[520px]" data-reveal="">
              The factory in Karol Ghati, Lahore, has cutting machines, welding units and material-handling systems. This allows the team to run several projects at the same time without losing control of quality or schedule. Many clients return for later phases, for example a feed storage building after a dairy shed.
            </p>
            <div className="pt-4" data-fade-up="">
              <Button variant="secondary" href="/about-us/introduction/">
                Read the Introduction
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Img
              src={A.about}
              alt="Steel fabrication team at work at the Steel Mind Engineers factory"
              ratio="5/6"
              className="w-full"
            />
          </div>
        </div>
      </Section>

      {/* 4. What We Build (White) — 5 uniform 4:5 cards, equal height, no numbering */}
      <Section
        bg="white"
        title="What We Build"
        intro="We build steel structures for factories, warehouses, farms, commercial buildings and other projects that need large, practical spaces."
      >
        <SwipeRow ariaLabel="What We Build">
          {whatWeBuildItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="group flex flex-col h-full bg-transparent cursor-pointer"
              data-reveal=""
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Img
                    src={item.img}
                    alt={item.title}
                    ratio="4/5"
                  />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-[18px] lg:text-[22px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[var(--grey)] line-clamp-3">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-end">
                  <svg className="w-6 h-6 stroke-current text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <polyline points="14 6 20 12 14 18" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </SwipeRow>
      </Section>

      {/* 5. How We Work + 7 Services (Royal Blue Glossy) */}
      <section
        style={{
          background: "var(--blue-glossy)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
        className="py-[var(--section-y)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] mb-12 lg:mb-16">
          <h2
            className="text-[22px] lg:text-[36px] font-semibold leading-[1.2] tracking-[-0.015em] text-white mb-6"
            data-split=""
          >
            How We Work
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[15px] lg:text-[16px] text-white/78 leading-[1.65]" data-reveal-group="">
            <p data-reveal="" className="max-w-[520px]">
              We start with the drawings and requirements, then handle the engineering, fabrication and erection through the same team. This keeps the project coordinated from the workshop to the site.
            </p>
            <p data-reveal="" className="max-w-[520px]">
              For you, this means one contract and one point of contact. The engineer who designs your building is available while the steel is cut, and the crew that erects it works from the same drawings the workshop used.
            </p>
          </div>
        </div>

        {/* 7 Services SwipeRow */}
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <SwipeRow theme="dark" ariaLabel="Seven Services">
            {services.map((svc) => (
              <Link
                key={svc.name}
                to={svc.url}
                className="group block bg-transparent p-4"
                data-reveal=""
              >
                <div className="overflow-hidden mb-3">
                  <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                    <Img src={svc.img} alt={svc.name} ratio="4/5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[16px] lg:text-[20px] font-semibold text-white group-hover:text-white/80 transition-colors leading-[1.25]">
                    {svc.name}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-white/78">
                    {svc.desc}
                  </p>
                </div>
              </Link>
            ))}
          </SwipeRow>
        </div>
      </section>

      {/* 6. Trusted By (Offwhite) */}
      <Marquee />

      {/* 7. Our Work in Numbers (White) */}
      <Section
        bg="white"
        title="Our Work in Numbers"
        intro="We have completed 30+ projects, worked across 10+ cities and fabricated more than 1,000 tons of steel over 8+ years."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {SITE.stats.map((st) => (
            <Stat
              key={st.label}
              value={st.value}
              suffix={st.suffix}
              label={st.label}
              format={st.format}
            />
          ))}
        </div>
      </Section>

      {/* 8. Selected Projects (Offwhite) */}
      <Section
        bg="offwhite"
        title="Selected Projects"
      >
        <SwipeRow ariaLabel="Selected Projects">
          {selectedProjects.map((p) => {
            if (!p) return null;
            return (
              <Link
                key={p.id}
                to={`/projects/${p.slug}/`}
                className="group block bg-transparent"
                data-reveal=""
              >
                <div className="overflow-hidden mb-3">
                  <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                    <Img
                      src={p.images[0]}
                      alt={p.title}
                      ratio="16/9"
                    />
                  </div>
                </div>
                <div className="space-y-1 mt-3">
                  <div className="text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                    {p.client} · {p.location}
                  </div>
                  <h3 className="text-[16px] lg:text-[20px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-1 leading-[1.25]">
                    {p.title}
                  </h3>
                  <div className="text-[14px] font-semibold text-[var(--blue)]">
                    {p.area.toLocaleString()} sq ft
                  </div>
                </div>
              </Link>
            );
          })}
        </SwipeRow>
      </Section>

      {/* 9. Team (White Split Card) */}
      <section className="relative w-full bg-white">
        {/* Desktop View: image left (5 cols), text right (7 cols), gap 32px */}
        <div className="hidden lg:block max-w-[1340px] mx-auto px-[var(--pad-x)] py-16 lg:py-20">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-5 flex items-center justify-center">
              <img
                src={A.team}
                alt="Steel Mind Engineers fabrication team in front of the factory building in Lahore."
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="col-span-7 space-y-4">
              <h2 className="text-[18px] lg:text-[30px] font-semibold text-[var(--ink)] leading-[1.2]" data-split="">
                How the Team Is Organized
              </h2>
              <p className="text-[13px] lg:text-[14px] text-[var(--grey)] leading-[1.65] max-w-[520px]" data-reveal="">
                Four groups share responsibility for each structure. Engineers handle design and detailing. The workshop team handles fabrication and quality checks. Site crews handle erection and safety. Project coordinators handle schedules, material flow and communication with you.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View: Bordered offwhite card */}
        <div className="lg:hidden px-[var(--pad-x)] py-12">
          <div className="border border-[var(--line)] bg-[var(--offwhite)] p-5 flex flex-col gap-4">
            <div className="w-full">
              <img
                src={A.team}
                alt="Steel Mind Engineers fabrication team in front of the factory building in Lahore."
                className="w-full h-auto object-contain block"
              />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--ink)] mb-2 leading-[1.25]">
                How the Team Is Organized
              </h3>
              <p className="text-[13px] text-[var(--grey)] leading-[1.65]">
                Four groups share responsibility for each structure. Engineers handle design and detailing. The workshop team handles fabrication and quality checks. Site crews handle erection and safety. Project coordinators handle schedules, material flow and communication with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Industries We Serve (Offwhite) — Expanding list with description */}
      <Section
        bg="offwhite"
        title="Industries We Serve"
      >
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {industries.map((ind, idx) => {
            const isOpen = industryOpen === idx;
            const numStr = String(idx + 1).padStart(2, "0");
            return (
              <div key={ind.name} className="py-4 overflow-hidden transition-all duration-500">
                <button
                  type="button"
                  onClick={() => setIndustryOpen(isOpen ? -1 : idx)}
                  className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-6">
                    <span className="text-[14px] font-semibold text-[var(--blue)]">
                      {numStr}
                    </span>
                    <span className="text-[16px] lg:text-[20px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                      {ind.name}
                    </span>
                  </div>
                  <span className="relative w-4 h-4 flex items-center justify-center">
                    <span className="absolute w-4 h-[1.5px] bg-[var(--ink)]" />
                    <span
                      className={`absolute h-4 w-[1.5px] bg-[var(--ink)] transition-transform duration-300 ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="py-4 space-y-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="max-w-[720px] overflow-hidden">
                      <Img
                        src={ind.img}
                        alt={`${ind.name} sector: steel building by Steel Mind Engineers`}
                        ratio="16/9"
                      />
                    </div>
                    <p className="text-[14px] leading-[1.6] text-[var(--grey)] line-clamp-2 max-w-[640px]">
                      {ind.desc}
                    </p>
                    <div>
                      <Link
                        to={ind.url}
                        className="text-[14px] font-semibold text-[var(--blue)] hover:underline inline-flex items-center"
                      >
                        <span>Explore</span>
                        <svg className="w-4 h-4 ml-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 11. Get a Quote Band */}
      <QuoteBand />

      {/* 12. Latest From the Blog (White) */}
      <Section
        bg="white"
        title="Latest From the Blog"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blogArticles.map((art) => (
            <Link
              key={art.title}
              to={art.url}
              className="group block bg-transparent"
              data-reveal=""
            >
              <div className="overflow-hidden mb-4">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Img src={art.img} alt={art.title} ratio="4/3" />
                </div>
              </div>
              <span className="block text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
                {art.category}
              </span>
              <h3 className="text-[18px] lg:text-[22px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25] line-clamp-3">
                {art.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-4">
          <Link
            to="/blog/"
            className="text-[14px] font-semibold text-[var(--blue)] hover:underline inline-flex items-center"
          >
            <span>Blogs</span>
            <svg className="w-4 h-4 ml-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Section>

      {/* 13. Company Profile (Royal Blue Glossy) */}
      <section
        style={{
          background: "var(--blue-glossy)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
        className="py-20 text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] flex flex-col items-start space-y-6" data-fade-up="">
          <h2 className="text-[22px] lg:text-[36px] font-semibold text-white leading-tight" data-split="">
            Company Profile
          </h2>
          <p className="text-[15px] lg:text-[16px] text-white/78 max-w-[520px] leading-[1.65]">
            The Steel Mind Engineers Pvt. Ltd. company profile is a 29-page PDF. It introduces the company, the head office and factory in Lahore, the services, the projects and the clients. Download it to share with your team or your consultant.
          </p>
          <a
            href={SITE.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-semibold text-[11px] uppercase tracking-[0.1em] px-6 py-3 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors rounded-none"
          >
            {SITE.profileButton}
          </a>
        </div>
      </section>

      {/* 14. Frequently Asked Questions (White) */}
      <Section
        bg="white"
        title="Frequently Asked Questions"
      >
        <Accordion items={pageData.faq} />
      </Section>
    </div>
  );
};
