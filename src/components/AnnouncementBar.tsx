import { getTranslations } from "next-intl/server";

export default async function AnnouncementBar() {
  const t = await getTranslations("announcementBar");

  return (
    <div className="relative z-[60] flex flex-col items-center justify-center gap-1 border-b border-black/10 bg-white px-3 py-2 text-center sm:flex-row sm:gap-4">
      <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.15em] text-black/80 sm:text-xs">
        {t("text")}
      </p>
      <a
        href="#formats"
        className="text-[0.65rem] uppercase tracking-[0.15em] text-gold underline decoration-gold/50 underline-offset-4 hover:text-black sm:text-xs"
      >
        {t("cta")}
      </a>
    </div>
  );
}
