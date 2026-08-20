import Image from "next/image";
import { artistStats } from "@/lib/content";

export default function Artist() {
  return (
    <section
      id="artiste"
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10 lg:gap-20">
        <div className="member-card artwork-image relative aspect-[4/5] w-full overflow-hidden rounded-sm border-white/10 bg-card">
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
            alt="François Poulat dans son atelier"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="member-image object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-sm bg-black/70 p-4 backdrop-blur">
            <p className="font-montserrat text-xs uppercase tracking-[0.15em] text-white">
              François Poulat
            </p>
            <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.15em] text-gray-400">
              Artiste Plasticien Partenaire
            </p>
          </div>
        </div>

        <div>
          <span className="section-number">{"// Artiste Plasticien"}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            La Matière Pop Art de François Poulat
          </h2>
          <p className="mt-5 text-sm leading-loose text-gray-300 md:text-base">
            Exposé à l&rsquo;échelle internationale, François Poulat
            s&rsquo;impose par sa maîtrise des contrastes de couleurs et son
            réagencement poétique des icônes Pop Culture. Ses toiles allient
            la rigueur graphique à l&rsquo;énergie brute de la peinture au
            couteau.
          </p>

          <blockquote className="mt-6 border-l-2 border-gold pl-5">
            <p className="serif italic text-lg leading-relaxed text-white">
              « Réinventer l&rsquo;iconographie Pop pour le studio de Grim
              était un défi captivant&nbsp;: allier l&rsquo;énergie gaming à
              la noblesse d&rsquo;une toile travaillée en épaisseur. »
            </p>
          </blockquote>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {artistStats.map((stat) => (
              <div key={stat.label}>
                <p className="serif text-2xl italic text-gold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <a href="#formats" className="btn-mag mt-10 inline-block">
            Réserver une œuvre de la collection →
          </a>
        </div>
      </div>
    </section>
  );
}
