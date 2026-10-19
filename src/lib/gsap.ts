import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
if (!CustomEase.get("E1")) {
  CustomEase.create("E1", ".16, 1, .3, 1");
}
if (!CustomEase.get("E2")) {
  CustomEase.create("E2", ".76, 0, .24, 1");
}
gsap.defaults({ ease: "expo.out", duration: 0.9 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, CustomEase };
