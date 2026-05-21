import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/shared/HeroSection";
import { UpcomingEvents } from "@/components/shared/UpcomingEvents";
import { EventCategories } from "@/components/shared/EventCategories";
import { CallToAction } from "@/components/shared/CallToAction";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <HeroSection />
        <UpcomingEvents />
        <EventCategories />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
