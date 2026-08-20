import { footerLinks } from "@/lib/content";

const socials = ["Instagram", "X", "Twitch", "LinkedIn"];

export default function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8">
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-[0.65rem] text-gold">
                IRA
              </span>
              <span className="serif text-lg uppercase tracking-[0.3em]">
                InRealArt
              </span>
            </div>
            <p className="footer-link mt-4 max-w-xs !text-gray-400">
              InRealArt est une agence d&rsquo;art contemporain spécialisée
              dans la création, l&rsquo;édition et la curation
              d&rsquo;œuvres physiques pour collectionneurs et créateurs de
              contenu.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              InRealArt Agency
            </p>
            <ul className="mt-4 flex flex-col">
              {footerLinks.agency.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              Contact &amp; Assistance
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Un projet sur-mesure ou une question sur votre commande&nbsp;?
            </p>
            <a
              href="mailto:contact@inrealart.com"
              className="footer-link mt-2 !text-gold"
            >
              contact@inrealart.com
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              Suivez-nous
            </p>
            <ul className="mt-4 flex flex-wrap gap-4">
              {socials.map((social) => (
                <li key={social}>
                  <a href="#" className="footer-link">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.65rem] uppercase tracking-[0.1em] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 InRealArt. Tous droits réservés. Curation Officielle Grim
            x François Poulat.
          </p>
          <ul className="flex flex-wrap gap-6">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
