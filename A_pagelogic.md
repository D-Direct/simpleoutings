1. The Page Logic (app/_sites/[site]/page.tsx)This is a Server Component, meaning it fetches data on the server for maximum SEO and speed—crucial for travelers searching on Google.TypeScriptimport { notFound } from "next/navigation";
import prisma from "@/lib/prisma"; // Your Prisma client
import HeroSection from "@/components/tenant/HeroSection";
import RoomGallery from "@/components/tenant/RoomGallery";
import ContactForm from "@/components/tenant/ContactForm";

interface SitePageProps {
  params: { site: string };
}

export default async function SitePage({ params }: SitePageProps) {
  const { site } = params;

  // 1. Fetch Property Data
  // We check if 'site' matches a custom domain OR a subdomain slug
  const data = await prisma.property.findFirst({
    where: {
      OR: [
        { customDomain: site },
        { slug: site.split(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)[0] },
      ],
    },
    include: {
      rooms: true,
    },
  });

  // 2. Handle 404
  if (!data) {
    notFound();
  }

  // 3. Render the Template (Inspired by mistyheaven.lk)
  return (
    <main className="min-h-screen bg-white">
      {/* Dynamic Hero Section */}
      <HeroSection 
        name={data.name} 
        description={data.description} 
        image={data.images[0]} 
      />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-6">Welcome to {data.name}</h2>
          <p className="text-gray-600 leading-relaxed">{data.description}</p>
        </div>
      </section>

      {/* Room Listing */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-serif mb-8 text-center">Our Accommodation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.rooms.map((room) => (
              <RoomGallery key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry/Call-back Form */}
      <section id="contact" className="py-16">
        <div className="max-w-xl mx-auto px-4">
          <h3 className="text-2xl font-serif mb-4 text-center">Inquire Now</h3>
          <p className="text-center text-gray-500 mb-8">
            Send us a message and we will get back to you shortly.
          </p>
          <ContactForm propertyId={data.id} ownerPhone={data.phone} />
        </div>
      </section>
    </main>
  );
}
2. SEO & Metadata LogicTo help each homestay rank on Google (e.g., when someone searches for "Best stay in Ella"), you must generate dynamic metadata in the same file.TypeScriptexport async function generateMetadata({ params }: SitePageProps) {
  const { site } = params;
  const data = await prisma.property.findFirst({
    where: {
      OR: [{ customDomain: site }, { slug: site.split('.')[0] }],
    },
  });

  if (!data) return { title: "Not Found" };

  return {
    title: `${data.name} | Official Website`,
    description: data.description?.substring(0, 160),
    openGraph: {
      images: [data.images[0]],
    },
  };
}
3. Key Components to Build NextTo make this work with your "Vibe Coding" agent, you need to prompt it to create these three UI components:ComponentResponsibilityHeroSectionLarge background image, property name, and a "Book Now" scroll-link.RoomGalleryCards showing room price (LKR), capacity, and an image.ContactFormA simple form that sends a POST request to an API route to trigger the SMS/WhatsApp alert.