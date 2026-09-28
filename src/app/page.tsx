import { Hero } from "@/components/home/Hero";
import { Gallery } from "@/components/home/Gallery";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Gallery />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
