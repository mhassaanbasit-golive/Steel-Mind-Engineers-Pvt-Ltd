import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

/**
 * Reusable Scroll Animation System per Part E spec
 */

// 1. Reveal.Lines
export interface RevealLinesProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  delay?: number;
}

const Lines: React.FC<RevealLinesProps> = ({
  children,
  as: Component = "h2",
  className = "",
  delay = 0,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split into lines or phrases
  const lines = children.split("\n").filter(Boolean);

  if (reducedMotion) {
    return (
      <Component
        ref={(n: any) => {
          ref.current = n;
        }}
        className={`transition-opacity duration-250 ${inView ? "opacity-100" : "opacity-0"} ${className}`}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={(n: any) => {
        ref.current = n;
      }}
      className={className}
    >
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden">
          <span
            className="block transform transition-transform duration-800"
            style={{
              transitionTimingFunction: "var(--ease-out)",
              transitionDelay: `${delay + idx * 80}ms`,
              transform: inView ? "translateY(0)" : "translateY(110%)",
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
};

// 2. Reveal.Fade
export interface RevealFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

const Fade: React.FC<RevealFadeProps> = ({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion) {
    return (
      <Component
        ref={(n: any) => {
          ref.current = n;
        }}
        className={`transition-opacity duration-250 ${inView ? "opacity-100" : "opacity-0"} ${className}`}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={(n: any) => {
        ref.current = n;
      }}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{
        transitionTimingFunction: "var(--ease-out)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
};

// 3. Reveal.Image
export interface RevealImageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ImageReveal: React.FC<RevealImageProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion) {
    return (
      <div
        ref={ref}
        className={`transition-opacity duration-250 ${inView ? "opacity-100" : "opacity-0"} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden transition-[clip-path] duration-1100 ${className}`}
      style={{
        transitionTimingFunction: "var(--ease-inout)",
        transitionDelay: `${delay}ms`,
        clipPath: inView ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      }}
    >
      <div
        className="w-full h-full transition-transform duration-1400"
        style={{
          transitionTimingFunction: "var(--ease-out)",
          transitionDelay: `${delay}ms`,
          transform: inView ? "scale(1)" : "scale(1.15)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 4. Reveal.Line
export interface RevealLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  delay?: number;
}

const Line: React.FC<RevealLineProps> = ({
  orientation = "horizontal",
  className = "",
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion) {
    return (
      <div
        ref={ref}
        className={`transition-opacity duration-250 ${inView ? "opacity-100" : "opacity-0"} ${className}`}
      />
    );
  }

  const isHoriz = orientation === "horizontal";

  return (
    <div
      ref={ref}
      className={`transition-transform duration-900 origin-left ${className}`}
      style={{
        transitionTimingFunction: "var(--ease-inout)",
        transitionDelay: `${delay}ms`,
        transform: inView
          ? isHoriz
            ? "scaleX(1)"
            : "scaleY(1)"
          : isHoriz
          ? "scaleX(0)"
          : "scaleY(0)",
      }}
    />
  );
};

export const Reveal = {
  Lines,
  Fade,
  Image: ImageReveal,
  Line,
};

// 5. Parallax helper
export interface ParallaxProps {
  speed?: number; // e.g. 10 means -10% to +10%
  children: React.ReactNode;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  speed = 10,
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let rafId: number;
    let isIntersecting = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          inner.style.willChange = "transform";
        } else {
          inner.style.willChange = "auto";
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const onScroll = () => {
      if (!isIntersecting) return;
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Progress from 0 (at bottom of screen) to 1 (at top of screen)
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      // Map 0 -> 1 to -speed% -> +speed%
      const yOffset = (clamped * 2 - 1) * speed;
      inner.style.transform = `translate3d(0, ${yOffset}%, 0)`;
    };

    const loop = () => {
      onScroll();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [speed, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
};

// 6. CountUp helper
export interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}) => {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVal(to);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();

          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo: progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setVal(Math.round(eased * to));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, started, reducedMotion]);

  return (
    <span ref={ref} className={`font-number ${className}`}>
      {prefix}
      {reducedMotion ? to : val}
      {suffix}
    </span>
  );
};
