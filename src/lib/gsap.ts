"use client";

// Single place to register GSAP plugins. Import gsap/useGSAP from here, not
// from "gsap" directly, so plugins are always registered before use.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, useGSAP);

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollTrigger, MorphSVGPlugin, useGSAP };
