"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryDetails } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";

export default function GalleryDetails() {
  const [lightbox, setLightbox] = useState<
    (typeof galleryDetails)[number] | null
  >(null);
  useModalBehavior(lightbox !== null, () => setLightbox(null));

  return (
    <section
      id="galerie"
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">
            {"// Zoom sur les Matières"}
          </span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            Galerie Détaillée de l&rsquo;Œuvre
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            Cliquez sur un visuel pour l&rsquo;agrandir
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryDetails.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(item)}
              className="artwork-container group text-left"
            >
              <div className="artwork-image relative aspect-square w-full overflow-hidden rounded-sm border-white/10 bg-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="serif mt-3 text-base italic text-white">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                {item.caption}
              </p>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
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
              alt={lightbox.title}
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
