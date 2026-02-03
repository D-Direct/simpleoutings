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
import WhatsAppFloatingButton from "@/components/tenant/WhatsAppFloatingButton";
import { shouldShowBadge } from "@/lib/subscription-helpers";

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
      owner: {
        with: {
          subscriptionPlan: true,
        },
      },
    }
  });

  if (!property) {
    return notFound();
  }

  // Debug: Log subscription plan info
  console.log("Property owner:", property.owner?.email);
  console.log("Subscription plan:", property.owner?.subscriptionPlan);
  console.log("Should show badge:", shouldShowBadge(property.owner?.subscriptionPlan || null));

  return (
    <main id="top" className="min-h-screen bg-stone-50 font-sans selection:bg-stone-200 selection:text-stone-900">
      <Header propertyName={property.name} logo={property.logo} />

      {/* WhatsApp Floating Button */}
      {property.whatsappNumber && (
        <WhatsAppFloatingButton
          phoneNumber={property.whatsappNumber}
          propertyName={property.name}
        />
      )}

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
        whatsappNumber={property.whatsappNumber}
        propertyName={property.name}
        connectTitle={property.connectTitle}
        connectDescription={property.connectDescription}
        locationAddress={property.locationAddress}
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
              {shouldShowBadge(property.owner?.subscriptionPlan || null) && (
                <a
                  href="https://simpleoutings.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-900 text-sm font-medium uppercase tracking-wide mt-3 inline-block hover:text-stone-600 transition-colors cursor-pointer"
                >
                  Built with SimpleOutings
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

