import { setRequestLocale } from "next-intl/server";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Genese from "@/components/sections/Genese";
import Process from "@/components/sections/Process";
import Artist from "@/components/sections/Artist";
import Formats from "@/components/sections/Formats";
import Guarantees from "@/components/sections/Guarantees";
import GalleryDetails from "@/components/sections/GalleryDetails";
import Faq from "@/components/sections/Faq";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Genese />
        <GalleryDetails />
        <Process />
        <Artist />
        <Formats />
        <Guarantees />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
