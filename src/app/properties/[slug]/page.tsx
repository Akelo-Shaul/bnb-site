import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, properties } from "@/data/properties";
import { BookingProvider } from "@/hooks/useBooking";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/ui/Wordmark";
import { BookLink } from "@/components/ui/BookLink";
import { Footer } from "@/components/ui/Footer";
import { PhotoGrid } from "@/components/listing/PhotoGrid";
import { ListingActions } from "@/components/listing/ListingActions";
import { Overview } from "@/components/listing/Overview";
import { AvailabilityCalendar } from "@/components/listing/AvailabilityCalendar";
import { BookingCard } from "@/components/listing/BookingCard";
import { Reviews } from "@/components/listing/Reviews";
import { LocationSection } from "@/components/listing/LocationSection";
import { HostSection } from "@/components/listing/HostSection";
import { ThingsToKnow } from "@/components/listing/ThingsToKnow";
import { MobileBookingBar } from "@/components/listing/MobileBookingBar";
import { SectionNav } from "@/components/listing/SectionNav";
import { PhotoTour } from "@/components/listing/PhotoTour";

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  return {
    title: property.name,
    description: property.description,
    openGraph: { images: property.images.slice(0, 1) },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  return (
    <BookingProvider>
      <SectionNav property={property} />
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4 xl:px-0">
          <Wordmark className="text-xl md:text-2xl" />
          <BookLink size="sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-6 pb-28 pt-6 lg:pb-12 xl:px-0">
        <h1 className="text-[26px] font-semibold leading-tight">{property.name.split(",")[0]}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="flex flex-wrap items-center gap-1 text-sm">
            <Icon name="star" className="size-3.5 text-brand" />
            <span className="font-semibold">{property.rating.toFixed(1)}</span>·
            <a href="#reviews" className="font-semibold underline">
              {property.reviewCount} reviews
            </a>
            ·
            <a href="#location" className="font-semibold text-muted underline">
              {property.location}
            </a>
          </p>
          <ListingActions slug={property.slug} name={property.name} />
        </div>

        <div id="photos" className="mt-6 scroll-mt-28">
          <PhotoGrid property={property} />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_373px] lg:gap-20">
          <div>
            <Overview property={property} />
            <AvailabilityCalendar town={property.town} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <BookingCard property={property} id="booking-card-desktop" />
            </div>
          </aside>
        </div>

        {/* On small screens the booking card sits inline after the calendar */}
        <div className="mt-2 lg:hidden">
          <BookingCard property={property} id="booking" />
        </div>

        <Reviews property={property} />
        <LocationSection property={property} />
        <HostSection property={property} />
        <ThingsToKnow property={property} />
      </main>

      <Footer />
      <MobileBookingBar property={property} />
      {/* Reads ?modal=photo-tour, so it needs a Suspense boundary on this static page */}
      <Suspense fallback={null}>
        <PhotoTour property={property} />
      </Suspense>
    </BookingProvider>
  );
}
