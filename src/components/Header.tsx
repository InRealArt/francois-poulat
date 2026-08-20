import Link from "next/link";
import { nav } from "@/lib/content";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-[90px] border-b border-white/10 bg-[rgb(var(--background-rgb))]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between px-3 sm:px-6 lg:px-10">
        <Link
          href="#top"
          className="serif flex items-center gap-3 uppercase tracking-[0.2em] text-sm md:text-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-[0.65rem] font-montserrat tracking-normal text-gold">
            IRA
          </span>
          <span className="hidden sm:flex flex-col leading-tight normal-case">
            <span className="tracking-[0.4em] uppercase">InRealArt</span>
            <span className="font-montserrat text-[0.55rem] tracking-[0.3em] uppercase text-gray-400">
              Agence d&rsquo;Art
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] uppercase tracking-[0.25em] text-white/80 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#formats" className="btn-cta hidden md:inline-flex">
          Réserver mon Tirage
        </a>
        <a
          href="#formats"
          className="md:hidden text-[11px] uppercase tracking-[0.15em] text-gold"
        >
          Réserver
        </a>
      </div>
    </header>
  );
}
