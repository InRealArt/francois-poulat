import Image from "next/image";
import { heroFeatures } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-background pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:px-10 lg:gap-20">
        <div className="animate-fade-up">
          <span className="section-number">
            Curation Exclusive Grim x François Poulat
          </span>
          <h1 className="serif text-4xl italic leading-[1.1] sm:text-5xl md:text-6xl">
            L&rsquo;Œuvre Ultime du Setup.
            <br />
            <span className="text-gold">« Pokepoulat »</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-loose text-gray-300 md:text-base">
            L&rsquo;énergie contemporaine du stream et l&rsquo;icône Pop Art
            réunies sur une toile physique magistrale. Sélectionnée par Grim
            pour habiller l&rsquo;arrière-plan de son studio, l&rsquo;œuvre
            originale de François Poulat est éditée sur châssis bois noble
            par l&rsquo;Agence InRealArt.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {heroFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-gray-200 sm:text-sm"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#formats" className="btn-action text-center">
              Sécuriser mon tirage (Acompte 50&nbsp;%)
            </a>
            <a href="#genese" className="btn-cta text-center">
              Voir l&rsquo;Unboxing Live
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] uppercase tracking-[0.2em] text-gray-500">
            <span>Stripe SSL</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
            <span>Garantie InRealArt</span>
          </div>
        </div>

        <div className="animate-fade-right relative">
          <div className="artwork-image relative aspect-square w-full overflow-hidden rounded-sm border-white/10 bg-card">
            <Image
              src="https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=1400&auto=format&fit=crop"
              alt="Pokepoulat dans le Setup de Grim"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />

            <span className="absolute left-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              Setup Grim
            </span>
            <span className="absolute right-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              Détail Toile
            </span>

            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 rounded-sm bg-black/70 p-4 backdrop-blur">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-gold">
                Format Officiel Grim : 100 × 100 cm
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-gray-300">
                Technique Mixte : Acrylique &amp; Vernis
              </p>
            </div>
          </div>

          <div className="advantage-box mt-6 flex flex-col gap-3 rounded-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="serif italic text-lg text-white">
              Unboxing Officiel en Live
              <span className="serif block text-sm not-italic text-gray-400">
                Présenté en direct par Grim sur Twitch
              </span>
            </p>
            <a href="#formats" className="btn-mag shrink-0">
              Réserver
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
