import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap.ts";

export function useCountUp(
  target: number,
  options: { suffix?: string; format?: boolean; duration?: number } = {}
) {
  const ref = useRef<HTMLSpanElement>(null);
  const { suffix = "", format = true, duration = 1.5 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        const num = Math.round(obj.val);
        el.textContent = (format ? num.toLocaleString() : num.toString()) + suffix;
      },
    });

    return () => {
      tween.kill();
    };
  }, [target, suffix, format, duration]);

  return ref;
}
