import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { AdminContentForm } from "@/components/admin-content-form";
import Link from "next/link";
import { ChevronLeft, Layout } from "lucide-react";
import { requireAuth } from "@/lib/auth";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // Get authenticated user
  const user = await requireAuth();

  const propertyData = await db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      amenities: true,
      testimonials: true,
      galleryImages: true,
      rooms: true,
      bookings: {
        with: {
          room: true,
        },
        orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
      },
      inquiries: {
        orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
      },
    },
  });

  if (!propertyData) {
    return notFound();
  }

  // Verify property belongs to user
  if (propertyData.ownerId !== user.id) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-stone-50/50 font-sans text-stone-900">
      <header className="h-16 border-b border-stone-200 bg-white flex-shrink-0 flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <Link href="/app" className="hover:bg-stone-50 p-2 rounded-lg transition-colors">
             <ChevronLeft className="w-5 h-5" />
           </Link>
           <div className="bg-stone-900 p-1.5 rounded-lg text-white">
             <Layout className="w-5 h-5" />
           </div>
           <span className="font-bold tracking-tight text-lg">Edit Website</span>
        </div>
        <div className="flex items-center gap-4">
           <Link href={`http://${propertyData.slug}.localhost:3000`} target="_blank" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              View Site
           </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 lg:p-12">
        <AdminContentForm property={propertyData} />
      </main>
    </div>
  );
}
