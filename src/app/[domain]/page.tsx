import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "@/components/tenant/Header";
import HeroSection from "@/components/tenant/HeroSection";
import AboutSection from "@/components/tenant/AboutSection";
import AmenitiesSection from "@/components/tenant/AmenitiesSection";
import TestimonialsSection from "@/components/tenant/TestimonialsSection";
import GallerySection from "@/components/tenant/GallerySection";
import RoomGallery from "@/components/tenant/RoomGallery";
import BookingForm from "@/components/tenant/BookingForm";
import ContactForm from "@/components/tenant/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = (await params).domain;
  const property = await db.query.properties.findFirst({
    where: eq(properties.slug, domain.split(".")[0]),
  });

  if (!property) return { title: "Not Found" };

  return {
    title: `${property.name} | Official Website`,
    description: property.description?.substring(0, 160),
    openGraph: {
      images: property.heroImage ? [property.heroImage] : [],
    },
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = (await params).domain;
  
  const property = await db.query.properties.findFirst({
    where: eq(properties.slug, domain.split(".")[0]),
    with: {
      rooms: true,
      amenities: true,
      testimonials: true,
      galleryImages: true,
    }
  });

  if (!property) {
    return notFound();
  }

  return (
    <main id="top" className="min-h-screen bg-stone-50 font-sans selection:bg-stone-200 selection:text-stone-900">
      <Header propertyName={property.name} logo={property.logo} />

      <HeroSection
        name={property.name}
        description={property.description}
        heroTitle={property.heroTitle}
        heroSubtitle={property.heroSubtitle}
        image={property.heroImage ?? undefined}
      />

      <AboutSection 
        title={property.aboutTitle}
        content={property.aboutContent || property.description}
        image={property.aboutImage}
      />
      
      <AmenitiesSection amenities={property.amenities || []} />
      
      <RoomGallery rooms={property.rooms} />
      
      <TestimonialsSection testimonials={property.testimonials || []} />

      <GallerySection images={property.galleryImages || []} />

      <BookingForm propertyId={property.id} rooms={property.rooms} />

      <ContactForm
        propertyId={property.id}
        propertyEmail={property.email}
        propertyPhone={property.phone}
        propertyAddress={property.address}
      />

      <footer className="py-20 border-t border-stone-200 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-serif text-stone-900 mb-4">{property.name}</h3>
              <p className="text-stone-500 font-light max-w-sm leading-relaxed">
                {property.footerBio || property.description}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-stone-400 text-sm font-light">
                © {new Date().getFullYear()} {property.name}.
              </p>
              <p className="text-stone-300 text-[10px] uppercase tracking-widest mt-2">
                Built with SimpleOutings
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

