import Image from "next/image";

export default function Genese() {
  return (
    <section
      id="genese"
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">
            {"// La Genèse du Projet"}
          </span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            L&rsquo;Alliance du Stream &amp; de l&rsquo;Art Physique
          </h2>
          <p className="mt-4 text-sm leading-loose text-gray-300 md:text-base">
            Pour parfaire l&rsquo;atmosphère de son studio, Grim recherchait
            une pièce d&rsquo;art contemporain forte, vivante et capable
            d&rsquo;accaparer le regard sous le rendu caméra.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="artwork-image relative aspect-[4/3] w-full overflow-hidden rounded-sm border-white/10 bg-card">
            <Image
              src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1400&auto=format&fit=crop"
              alt="Grim installant la toile Pokepoulat"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              Studio Review
            </span>
            <span className="absolute right-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              Format 100×100 cm
            </span>

            <button
              type="button"
              className="group absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/40"
              aria-label="Visionner le déballage en vidéo"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 text-white transition-transform group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-6 w-6"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                Replay Extract • Twitch
              </p>
            </div>
          </div>

          <div>
            <p className="serif text-xl italic text-white">
              Grim installe « Pokepoulat » dans son Setup
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">
              Le dévoilement en direct devant des milliers de passionnés
            </p>
            <p className="mt-6 text-sm leading-loose text-gray-300 md:text-base">
              L&rsquo;Agence InRealArt a orchestré l&rsquo;expédition
              sécurisée de l&rsquo;œuvre depuis l&rsquo;atelier de François
              Poulat jusqu&rsquo;au studio de Grim. Du déballage de la caisse
              en bois blindée au placement définitif sous le setup, revivez
              les coulisses de cette création.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#genese" className="btn-action text-center">
                Lancer la vidéo de l&rsquo;Unboxing
              </a>
              <a href="#formats" className="btn-mag self-center">
                Voir les tarifs →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
