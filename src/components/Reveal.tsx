"use client";

import { useRef, useLayoutEffect, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  direction?: "up" | "left" | "right";
  /** Stagger reveal of direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
};

const offsets: Record<NonNullable<RevealProps["direction"]>, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

export default function Reveal({
  children,
  as: Tag = "div",
  className,
  direction = "up",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el.children.length && stagger ? el.children : el, {
        opacity: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    const { x, y } = offsets[direction];
    const targets = stagger ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction, stagger, delay]);

  const Component = Tag as ElementType;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
