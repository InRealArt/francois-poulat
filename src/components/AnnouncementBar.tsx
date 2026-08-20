export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] flex flex-col items-center justify-center gap-1 border-b border-white/10 bg-black px-3 py-2 text-center sm:flex-row sm:gap-4">
      <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.15em] text-white/80 sm:text-xs">
        Édition d&rsquo;Art Physique Officielle « Pokepoulat » — Réservation
        Ouverte (Acompte 50&nbsp;%)
      </p>
      <a
        href="#formats"
        className="text-[0.65rem] uppercase tracking-[0.15em] text-gold underline decoration-gold/50 underline-offset-4 hover:text-white sm:text-xs"
      >
        Explorer les 7 formats →
      </a>
    </div>
  );
}
