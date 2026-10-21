import React, { useState, useEffect, useRef } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import pageData from "../content/generated/page-01.json";
import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { PROJECTS } from "../data/projects.ts";
import { Button } from "../components/ui/Button.tsx";
import { Section } from "../components/ui/Section.tsx";
import { Stat } from "../components/ui/Stat.tsx";
import { Img } from "../components/ui/Img.tsx";
import { SwipeRow } from "../components/ui/SwipeRow.tsx";
import { Marquee } from "../components/ui/Marquee.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";
import { gsap, ScrollTrigger } from "../lib/gsap.ts";
import { cl, srcSet } from "../lib/cloudinary.ts";

const TURNKEY_TEXT =
  "We are a turnkey solution provider offering design, fabrication, and installation for pre-engineered steel buildings, steel structures, and industrial sheds, as well as custom steel fabrication across Pakistan.";

const DESKTOP_VIDEO_MP4 =
  "https://res.cloudinary.com/cyfb9slf/video/upload/f_mp4,vc_h264,w_1920,q_auto/v1792608975/New_video_edited.mp4";
const DESKTOP_VIDEO_WEBM =
  "https://res.cloudinary.com/cyfb9slf/video/upload/f_webm,vc_vp9,w_1920,q_auto/v1792608975/New_video_edited.webm";
const DESKTOP_VIDEO_ORIGINAL =
  "https://res.cloudinary.com/cyfb9slf/video/upload/v1792608975/New_video_edited.mov";
const DESKTOP_POSTER =
  "https://res.cloudinary.com/cyfb9slf/video/upload/so_0,f_jpg,q_90,w_1920/v1792608975/New_video_edited.jpg";

const MOBILE_VIDEO_MP4 =
  "https://res.cloudinary.com/cyfb9slf/video/upload/f_mp4,vc_h264,w_1080,q_auto/v1791664502/15409488_2160_3840_60fps_1.mp4";
const MOBILE_VIDEO_ORIGINAL =
  "https://res.cloudinary.com/cyfb9slf/video/upload/v1791664502/15409488_2160_3840_60fps_1.mov";
const MOBILE_POSTER =
  "https://res.cloudinary.com/cyfb9slf/video/upload/so_0,f_jpg,q_90,w_1080/v1791664502/15409488_2160_3840_60fps_1.jpg";

export const Home: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [industryOpen, setIndustryOpen] = useState<number>(0);
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    details: "",
    company_website: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactData.company_website) return;
    if (!contactData.name.trim() || !contactData.phone.trim() || !contactData.details.trim()) {
      return;
    }
    setContactSubmitting(true);
    setContactError(false);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email || "info@steelmind.pk",
          city: "General Inquiry",
          projectType: "General / Turnkey Project",
          message: contactData.details,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setContactSubmitted(true);
    } catch {
      setContactError(true);
    } finally {
      setContactSubmitting(false);
    }
  };

  const pRef = useRef<HTMLParagraphElement>(null);

  // ITEM 1 — Step C: Animate each character on scroll efficiently
  useEffect(() => {
    const p = pRef.current;
    if (!p) return;
    const chars = p.querySelectorAll<HTMLElement>(".fade-char");
    const total = chars.length;

    gsap.registerPlugin(ScrollTrigger);

    let lastRevealed = -1;
    const trigger = ScrollTrigger.create({
      trigger: p,
      start: "top 85%",
      end: "top 40%",
      scrub: 0.5,
      onUpdate: (self) => {
        const revealed = Math.floor(self.progress * total);
        if (revealed !== lastRevealed) {
          lastRevealed = revealed;
          chars.forEach((c, i) => {
            c.style.color = i < revealed ? "var(--ink)" : "var(--grey)";
          });
        }
      },
    });

    return () => trigger.kill();
  }, []);

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

  // Selected projects (Dravton 1st-3rd, Maria B 4th, Haier 5th, Bridge 6th)
  const selectedProjectIds = [
    "dravton-dairy-shed",
    "dravton-milking-parlour",
    "rapid-exit",
    "maria-b-mezzanine",
    "haier-crane-mezzanine",
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
    {
      title: "Structural Steel Fabrication",
      desc: "Columns, beams, trusses, platforms, bridges and complete steel frames, fabricated to drawing.",
      img: A.division.structural,
      url: "/structural-steel-fabrication-pakistan/",
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
      {/* 1. Hero Video Section — 100svh mobile / 100vh desktop, min 600px, overflow hidden */}
      <section data-hero className="relative w-full h-[100svh] lg:h-[100vh] min-h-[600px] overflow-hidden bg-[var(--blue)]">
        {/* Video Wrapper */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
            alt="Steel Mind Engineers industrial facility"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <video
            key={isMobile ? "mobile-video" : "desktop-video"}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
            onLoadedData={() => setVideoLoaded(true)}
            onPlaying={() => setVideoLoaded(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center z-[1] transition-opacity duration-300 ${
              videoLoaded ? "opacity-100" : "opacity-95"
            }`}
          >
            {isMobile ? (
              <>
                <source src={MOBILE_VIDEO_MP4} type="video/mp4" />
                <source src={MOBILE_VIDEO_ORIGINAL} type="video/quicktime" />
              </>
            ) : (
              <>
                <source src={DESKTOP_VIDEO_WEBM} type="video/webm" />
                <source src={DESKTOP_VIDEO_MP4} type="video/mp4" />
                <source src={DESKTOP_VIDEO_ORIGINAL} type="video/quicktime" />
              </>
            )}
          </video>

          {/* Hero Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,31,78,0.68) 0%, rgba(16,31,78,0.25) 30%, rgba(16,31,78,0.55) 60%, rgba(16,31,78,0.90) 100%)",
            }}
          />
        </div>

        {/* Bottom-left stack: Heading, Subheading, and small Buttons directly below subheading */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end">
          <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10 pb-[calc(28px+env(safe-area-inset-bottom))] lg:pb-[44px] pointer-events-auto">
            <div className="flex flex-col items-start">
            {/* Heading */}
            <h1
              className="text-[15px] sm:text-[18px] lg:text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-white whitespace-nowrap max-w-fit uppercase"
              style={{
                whiteSpace: "nowrap",
                maxWidth: "fit-content",
                WebkitLineClamp: "unset",
                overflow: "visible",
                textOverflow: "unset",
              }}
            >
              Where Steel Meets Intelligence
            </h1>

            {/* Subheading directly below heading */}
            <p
              className="mt-[8px] sm:mt-[10px] text-[11px] sm:text-[12px] lg:text-[14px] font-normal leading-[1.45] sm:leading-[1.5] text-white/85 max-w-[280px] sm:max-w-[340px] lg:max-w-[480px] text-left"
              style={{
                WebkitLineClamp: "unset",
                overflow: "visible",
                textOverflow: "unset",
              }}
              data-fade-up=""
            >
              From design to installation, Steel Mind Engineers Pvt. Ltd. delivers turnkey steel for pre-engineered buildings, industrial sheds, steel warehouses, and custom fabrication across Pakistan.
            </p>

            {/* Small buttons placed directly below the subheading in the bottom-left corner */}
            <div
              className="mt-[10px] sm:mt-[14px] flex flex-wrap items-center justify-start gap-[6px] sm:gap-[8px]"
              data-fade-up=""
            >
              <Link
                to="/contact-us/#quote"
                className="hero-btn-primary group inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" aria-hidden="true">
                  &rarr;
                </span>
              </Link>

              <Link
                to="/projects/"
                className="hero-btn-secondary group inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98]"
              >
                <span>View Our Projects</span>
                <span className="btn-arrow ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
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

      {/* 2. ITEM 1 — Single paragraph with .fade-char character spans */}
      <section className="w-full bg-white border-b border-[var(--line)]">
        <p
          ref={pRef}
          className="fade-text"
          style={{
            fontSize: "clamp(14px, 2.2vw, 20px)",
            fontWeight: 500,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "clamp(48px, 8vw, 96px) 20px",
          }}
        >
          {TURNKEY_TEXT.split("").map((ch, i) => (
            <span
              key={i}
              className="fade-char"
              style={{
                color: "var(--grey)",
                transition: "color 0.25s ease",
              }}
            >
              {ch === " " ? (
                <>
                  {"\u00A0"}
                  <wbr />
                </>
              ) : (
                ch
              )}
            </span>
          ))}
        </p>
      </section>

      {/* 3. A Legacy of Leadership (stats) */}
      <Section
        bg="white"
        title="A Legacy of Leadership"
        intro="We have completed 60+ commercial and industrial projects, worked across 10+ cities and fabricated more than 3,000 tons of steel over 8+ years."
        className="border-b border-[var(--line)]"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[
            { value: 60, suffix: "+", label: "projects completed" },
            { value: 8, suffix: "+", label: "years of experience" },
            { value: 10, suffix: "+", label: "cities served" },
            { value: 3000, suffix: "+", label: "tons of steel fabricated", format: true },
          ].map((st) => (
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

      {/* 4. Trusted By (client logos) — moved directly after A Legacy of Leadership */}
      <Marquee />

      {/* 4. About Steel Mind Engineers (Royal Blue — alternating with White) */}
      <Section
        bg="blue"
        title="About Steel Mind Engineers"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-5" data-reveal-group="">
            <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white max-w-[520px]" data-reveal="">
              <strong className="font-bold text-white">Steel Mind Engineers wants to be the steel fabrication and engineering company that Pakistani industry trusts for the long term.</strong>
            </p>
            <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85 max-w-[520px]" data-reveal="">
              Our mission is to deliver dependable steel structures that meet each client’s needs, with quality, safety and efficiency in everything we do. We hold ourselves to three core values: quality fabrication, continuous improvement, and safety and reliability.
            </p>
            <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85 max-w-[520px]" data-reveal="">
              What sets us apart is that we plan the work before we do it, and we stay with you after it is done. You get a written schedule before work begins and one project coordinator from contract to handover. Our checks run through the whole project, from material inspection to final alignment, so the result matches the specification and is finished on time.
            </p>
            <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85 max-w-[520px]" data-reveal="">
              Because a steel building serves its owner for decades, we treat each project as the start of a relationship and stay available for repairs, additions and extensions long after handover.
            </p>
            <div className="pt-3" data-fade-up="">
              <Button variant="hero-white" href="/about-us/introduction/">
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

      {/* 5. What We Build (White) — 5 uniform 4:5 items */}
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
              <div className="overflow-hidden bg-[#F3F4F6]">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Img
                    src={item.img}
                    alt={item.title}
                    ratio="4/5"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-[15px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12px] lg:text-[13px] leading-[1.6] text-[var(--grey)] line-clamp-3">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-end">
                  <svg className="w-5 h-5 stroke-current text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <polyline points="14 6 20 12 14 18" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </SwipeRow>
      </Section>

      {/* 6. How We Work + 7 Services (Royal Blue) */}
      <section
        style={{
          backgroundColor: "var(--blue)",
        }}
        className="py-[var(--section-y)] bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] mb-10 lg:mb-14">
          <h2
            className="text-[20px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-white mb-5 uppercase"
            data-split=""
          >
            How We Work
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[12px] lg:text-[13px] text-white/85 leading-[1.65]" data-reveal-group="">
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
                <div className="overflow-hidden mb-3 bg-white/5">
                  <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                    <Img src={svc.img} alt={svc.name} ratio="4/5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[15px] lg:text-[17px] font-semibold text-white group-hover:text-white/80 transition-colors leading-[1.25]">
                    {svc.name}
                  </h3>
                  <p className="text-[12px] lg:text-[13px] leading-[1.6] text-white/80">
                    {svc.desc}
                  </p>
                </div>
              </Link>
            ))}
          </SwipeRow>
        </div>
      </section>

      {/* 7. Selected Projects (White) */}
      <Section
        bg="white"
        title="Selected Projects"
      >
        <SwipeRow ariaLabel="Selected Projects">
          {selectedProjects.map((p) => {
            if (!p) return null;
            const mainImg = p.images.find((img) => /main-image/i.test(img)) || p.images[0];
            return (
              <Link
                key={p.id}
                to={`/projects/${p.slug}/`}
                className="group flex flex-col h-full bg-transparent"
                data-reveal=""
              >
                <div className="overflow-hidden mb-3 bg-[#F3F4F6]">
                  <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                    <img
                      src={mainImg && !mainImg.startsWith("/") ? cl(mainImg, 1080) : mainImg}
                      srcSet={mainImg && !mainImg.startsWith("/") ? srcSet(mainImg) : undefined}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1080px"
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-1 leading-[1.25] mb-3">
                    {p.title}
                  </h3>
                  <div>
                    <span
                      className="inline-flex items-center justify-center font-semibold text-white uppercase transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[var(--blue-dark)] group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_12px_rgba(30,58,138,0.3)] active:translate-y-0 active:scale-[0.98]"
                      style={{
                        background: "var(--blue)",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "8px 16px",
                        height: "34px",
                        borderRadius: 0,
                        lineHeight: 1,
                      }}
                    >
                      <span>View Project</span>
                      <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </SwipeRow>
      </Section>

      {/* 8. How the Team Is Organized (Royal Blue — no bordered card) */}
      <Section bg="blue">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex items-center justify-center">
            <img
              src={A.team}
              alt="Steel Mind Engineers fabrication team in front of the factory building in Lahore."
              className="w-full h-auto object-contain block"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-[20px] lg:text-[32px] font-semibold text-white leading-[1.2] tracking-[-0.01em] uppercase" data-split="">
              Team Steel Mind Engineers
            </h2>
            <p className="text-[12px] lg:text-[13px] text-white/85 leading-[1.65] max-w-[520px]" data-reveal="">
              Four groups share responsibility for each structure. Engineers handle design and detailing. The workshop team handles fabrication and quality checks. Site crews handle erection and safety. Project coordinators handle schedules, material flow and communication with you.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. Industries We Serve (White) — Expanding list with description */}
      <Section
        bg="white"
        title="Industries We Serve"
      >
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {industries.map((ind, idx) => {
            const isOpen = industryOpen === idx;
            return (
              <div key={ind.name} className="py-3 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIndustryOpen(isOpen ? -1 : idx)}
                  className="w-full py-3 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors duration-300 uppercase">
                    {ind.name}
                  </span>
                  <span className="relative w-4 h-4 flex items-center justify-center shrink-0 ml-4">
                    <span className="absolute w-4 h-[1.5px] bg-[var(--blue)]" />
                    <span
                      className={`absolute h-4 w-[1.5px] bg-[var(--blue)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="py-4 space-y-4">
                      <div className="max-w-[720px] overflow-hidden">
                        <Img
                          src={ind.img}
                          alt={`${ind.name} sector: steel building by Steel Mind Engineers`}
                          ratio="16/9"
                        />
                      </div>
                      <p className="text-[12px] lg:text-[13px] leading-[1.6] text-[var(--grey)] max-w-[640px]">
                        {ind.desc}
                      </p>
                      <div>
                        <Link
                          to={ind.url}
                          className="text-[10px] uppercase tracking-[0.06em] font-semibold text-[var(--blue)] hover:underline inline-flex items-center"
                        >
                          <span>Explore</span>
                          <svg className="w-4 h-4 ml-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 10. Get a Quote Band */}
      <QuoteBand />

      {/* 11. Latest From the Blog (White) */}
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
                  <Img src={art.img} alt={art.title} ratio="16/9" />
                </div>
              </div>
              <span className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
                {art.category}
              </span>
              <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25] line-clamp-3">
                {art.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-4">
          <Link
            to="/blog/"
            className="text-[10px] uppercase tracking-[0.06em] font-semibold text-[var(--blue)] hover:underline inline-flex items-center"
          >
            <span>Blogs</span>
            <svg className="w-4 h-4 ml-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Section>

      {/* 12. Company Profile (Royal Blue) */}
      <section
        style={{
          backgroundColor: "var(--blue)",
        }}
        className="py-20 bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] flex flex-col items-start space-y-5" data-fade-up="">
          <h2 className="text-[20px] lg:text-[32px] font-semibold text-white leading-[1.2] tracking-[-0.01em] uppercase" data-split="">
            Company Profile
          </h2>
          <p className="text-[12px] lg:text-[13px] text-white/85 max-w-[520px] leading-[1.65]">
            The Steel Mind Engineers Pvt. Ltd. company profile is a 29-page PDF. It introduces the company, the head office and factory in Lahore, the services, the projects and the clients. Download it to share with your team or your consultant.
          </p>
          <a
            href={SITE.profilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.08em] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors rounded-none"
          >
            {SITE.profileButton}
          </a>
        </div>
      </section>

      {/* 13. Frequently Asked Questions (White) */}
      <Section
        bg="white"
        title="Frequently Asked Questions"
      >
        <Accordion items={pageData.faq} />
      </Section>

      {/* 14. Contact Section (Solid Blue — Directly above Footer) */}
      <section
        id="contact"
        style={{ backgroundColor: "var(--blue)" }}
        className="relative w-full bg-[var(--blue)] text-white py-10 sm:py-14 lg:py-24 border-t border-white/15"
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Heading and Subtext */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-5 text-left">
              <h2 className="text-[20px] sm:text-[24px] lg:text-[40px] font-bold text-white leading-[1.18] lg:leading-[1.15] tracking-[-0.01em] uppercase">
                Ready to Start Your Project?
              </h2>
              <p className="text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.6] lg:leading-[1.65] text-white/85 max-w-[480px]">
                Send your project dimensions, layout requirements, or questions. Our senior engineers review every inquiry and provide clear advice, preliminary feasibility, and turnkey guidance for your steel structure.
              </p>
              <div className="pt-1 lg:pt-2 space-y-2 lg:space-y-2.5 text-[11px] sm:text-[12px] text-white/75">
                <div className="flex items-center gap-2 lg:gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                  <span>Written schedule and proposal before fabrication begins</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                  <span>Direct engineer communication from concept through erection</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                  <span>Decades of reliable service and after-sale support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 w-full">
              {contactSubmitted ? (
                <div className="p-6 sm:p-10 lg:p-12 bg-white/10 border border-white/20 text-center flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white text-[var(--blue)] flex items-center justify-center font-bold text-lg lg:text-xl shadow-sm">
                    ✓
                  </div>
                  <h3 className="text-[18px] lg:text-[20px] font-bold text-white">Message Received</h3>
                  <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-white/90 max-w-[420px] leading-[1.6]">
                    Your message has been received. A senior engineer will review your inquiry and reply promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactData({
                        name: "",
                        phone: "",
                        email: "",
                        details: "",
                        company_website: "",
                      });
                    }}
                    style={{ backgroundColor: "#FFFFFF", color: "var(--blue)" }}
                    className="inline-flex items-center justify-center font-semibold text-[9.5px] sm:text-[10px] uppercase tracking-[0.08em] px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-all mt-2 cursor-pointer shadow-sm"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="space-y-3 sm:space-y-4 text-left">
                  {/* Anti-spam honeypot */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactData.company_website}
                    onChange={(e) =>
                      setContactData({ ...contactData, company_website: e.target.value })
                    }
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="home-contact-name"
                      className="block text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-white uppercase tracking-[0.08em] mb-1 sm:mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="home-contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={contactData.name}
                      onChange={(e) =>
                        setContactData({ ...contactData, name: e.target.value })
                      }
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full h-[38px] sm:h-[42px] lg:h-[48px] px-3 sm:px-4 text-[12px] sm:text-[13px] lg:text-[14px] text-[#0A0A0A] bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Two-column row on tablet/desktop for Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="home-contact-phone"
                        className="block text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-white uppercase tracking-[0.08em] mb-1 sm:mb-1.5"
                      >
                        Phone Number
                      </label>
                      <input
                        id="home-contact-phone"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        value={contactData.phone}
                        onChange={(e) =>
                          setContactData({ ...contactData, phone: e.target.value })
                        }
                        placeholder="e.g. 0300 1234567"
                        className="w-full h-[38px] sm:h-[42px] lg:h-[48px] px-3 sm:px-4 text-[12px] sm:text-[13px] lg:text-[14px] text-[#0A0A0A] bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-none placeholder:text-gray-400"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="home-contact-email"
                        className="block text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-white uppercase tracking-[0.08em] mb-1 sm:mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="home-contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={contactData.email}
                        onChange={(e) =>
                          setContactData({ ...contactData, email: e.target.value })
                        }
                        placeholder="e.g. name@company.com"
                        className="w-full h-[38px] sm:h-[42px] lg:h-[48px] px-3 sm:px-4 text-[12px] sm:text-[13px] lg:text-[14px] text-[#0A0A0A] bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label
                      htmlFor="home-contact-details"
                      className="block text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-white uppercase tracking-[0.08em] mb-1 sm:mb-1.5"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="home-contact-details"
                      required
                      rows={3}
                      value={contactData.details}
                      onChange={(e) =>
                        setContactData({ ...contactData, details: e.target.value })
                      }
                      placeholder="Please specify estimated dimensions, building purpose, city, and required features..."
                      className="w-full p-2.5 sm:p-3.5 lg:p-4 text-[12px] sm:text-[13px] lg:text-[14px] text-[#0A0A0A] bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-none resize-y placeholder:text-gray-400 min-h-[85px] lg:min-h-[110px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      style={{ backgroundColor: "#FFFFFF", color: "var(--blue)" }}
                      className="group inline-flex items-center justify-center font-bold text-[10px] sm:text-[10.5px] lg:text-[11px] uppercase tracking-[0.08em] px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 min-h-[38px] sm:min-h-[42px] lg:min-h-[44px] bg-white text-[var(--blue)] border border-white hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer shadow-sm disabled:opacity-60"
                    >
                      <span className="text-[var(--blue)] font-bold">
                        {contactSubmitting ? "SENDING..." : "SEND MESSAGE"}
                      </span>
                      <span className="ml-1.5 sm:ml-2 inline-block text-[var(--blue)] font-bold transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    {contactError && (
                      <p className="mt-2.5 text-[11px] sm:text-[12px] text-white/95 font-medium">
                        The message could not send. Please call +92 300 4253966 or reach us on WhatsApp.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
