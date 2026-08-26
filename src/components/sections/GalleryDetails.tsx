"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { galleryDetails } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import Reveal from "@/components/Reveal";

const AUTOPLAY_DELAY = 5500;

export default function GalleryDetails() {
  const [active, setActive] = useState(0);
  const t = useTranslations("gallery");
  const [lightbox, setLightbox] = useState<
    (typeof galleryDetails)[number] | null
  >(null);
  useModalBehavior(lightbox !== null, () => setLightbox(null));

  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeAutoplayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const dragState = useRef<{
    startX: number;
    startY: number;
    dragging: boolean;
    axis: "x" | "y" | null;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const count = galleryDetails.length;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_DELAY);
  }, [count, stopAutoplay]);

  // Pause on manual interaction, then resume automatically after a delay
  // (rather than only ever resuming on mouse-leave, which never fires for
  // keyboard/touch users).
  const pauseAutoplay = useCallback(() => {
    stopAutoplay();
    if (resumeAutoplayRef.current) {
      clearTimeout(resumeAutoplayRef.current);
    }
    resumeAutoplayRef.current = setTimeout(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!prefersReducedMotion) startAutoplay();
    }, AUTOPLAY_DELAY);
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!prefersReducedMotion && lightbox === null) {
      startAutoplay();
    }
    return () => {
      stopAutoplay();
      if (resumeAutoplayRef.current) clearTimeout(resumeAutoplayRef.current);
    };
  }, [startAutoplay, stopAutoplay, lightbox]);

  // Animate each slide's transform/opacity as `active` changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(
      track.querySelectorAll<HTMLDivElement>("[data-slide]")
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    slides.forEach((slide, index) => {
      const offset = index - active;
      const isActive = offset === 0;
      const isNeighbor = Math.abs(offset) === 1;
      const isVisible = Math.abs(offset) <= 1;

      const x = offset * 62;
      const scale = isActive ? 1 : isNeighbor ? 0.78 : 0.6;
      const opacity = isActive ? 1 : isNeighbor ? 0.45 : 0;
      const zIndex = isActive ? 30 : isNeighbor ? 20 : 10;

      slide.style.zIndex = String(zIndex);
      slide.style.pointerEvents = isVisible ? "auto" : "none";

      if (prefersReducedMotion) {
        gsap.killTweensOf(slide);
        gsap.set(slide, { xPercent: x, scale, opacity });
        return;
      }

      gsap.to(slide, {
        xPercent: x,
        scale,
        opacity,
        duration: 0.85,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    return () => {
      gsap.killTweensOf(slides);
    };
  }, [active]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      pauseAutoplay();
      prev();
    } else if (event.key === "ArrowRight") {
      pauseAutoplay();
      next();
    }
  };

  const DRAG_MOVE_THRESHOLD = 8;
  const DRAG_NAV_THRESHOLD = 50;

  const handlePointerDown = (event: React.PointerEvent) => {
    // Ignore drags starting on the nav arrows so they keep receiving their
    // own click normally instead of the region capturing the pointer out
    // from under them.
    if ((event.target as HTMLElement).closest("[data-carousel-nav]")) {
      return;
    }
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      dragging: true,
      axis: null,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    pauseAutoplay();
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const state = dragState.current;
    if (!state?.dragging) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (!state.axis) {
      if (Math.abs(dx) < DRAG_MOVE_THRESHOLD && Math.abs(dy) < DRAG_MOVE_THRESHOLD) {
        return;
      }
      state.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      state.moved = true;
    }

    // Only hijack the gesture (and block page scroll) for horizontal swipes.
    if (state.axis === "x") {
      event.preventDefault();
    }
  };

  const endDrag = (event: React.PointerEvent) => {
    const state = dragState.current;
    if (!state?.dragging) return;
    dragState.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (state.moved) {
      // A real drag occurred: swallow the click the browser is about to
      // synthesize on whatever element the pointer released over.
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (state.axis !== "x") return;

    const delta = event.clientX - state.startX;
    if (delta > DRAG_NAV_THRESHOLD) prev();
    else if (delta < -DRAG_NAV_THRESHOLD) next();
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    endDrag(event);
  };

  return (
    <section
      id="galerie"
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-sm text-gray-400">{t("hint")}</p>
        </div>

        <Reveal className="mt-14">
          <div
            className="relative mx-auto h-[380px] max-w-4xl select-none sm:h-[440px] md:h-[520px]"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("ariaLabel")}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={stopAutoplay}
            onMouseLeave={() => lightbox === null && startAutoplay()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              ref={trackRef}
              className="relative h-full w-full overflow-hidden"
            >
              {galleryDetails.map((item, index) => (
                <div
                  key={item.id}
                  data-slide
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ willChange: "transform, opacity" }}
                  aria-hidden={Math.abs(index - active) > 1}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (suppressClickRef.current) return;
                      if (index === active) setLightbox(item);
                      else goTo(index);
                    }}
                    className="artwork-container group h-full w-[78%] text-left sm:w-[62%]"
                    tabIndex={index === active ? 0 : -1}
                  >
                    <div className="artwork-image relative h-[calc(100%-4.5rem)] w-full overflow-hidden rounded-sm border-white/10 bg-card shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
                      <Image
                        src={item.image}
                        alt={t(`items.${item.id}.title`)}
                        fill
                        sizes="(min-width: 1024px) 45vw, 80vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                    <p className="serif mt-3 text-base italic text-white sm:text-lg">
                      {t(`items.${item.id}.title`)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      {t(`items.${item.id}.caption`)}
                    </p>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              data-carousel-nav
              onClick={() => {
                pauseAutoplay();
                prev();
              }}
              aria-label={t("prevLabel")}
              className="absolute left-0 top-[calc(50%-2.25rem)] z-40 flex h-10 w-10 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)] sm:left-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              data-carousel-nav
              onClick={() => {
                pauseAutoplay();
                next();
              }}
              aria-label={t("nextLabel")}
              className="absolute right-0 top-[calc(50%-2.25rem)] z-40 flex h-10 w-10 translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)] sm:right-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            {galleryDetails.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  pauseAutoplay();
                  goTo(index);
                }}
                aria-label={t("dotLabel", { index: index + 1, title: t(`items.${item.id}.title`) })}
                aria-current={index === active}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    index === active
                      ? "h-1.5 w-6 bg-[var(--gold-accent)]"
                      : "h-1.5 w-1.5 bg-white/30 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t(`items.${lightbox.id}.title`)}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t("closeLabel")}
            className="absolute right-6 top-6 text-white/70 transition-colors hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="relative aspect-square w-full max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={t(`items.${lightbox.id}.title`)}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
