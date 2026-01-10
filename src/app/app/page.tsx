import { db } from "@/db";
import { SiteBuilderForm } from "@/components/site-builder-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout, Plus, ExternalLink, Settings, Home as HomeIcon } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { properties } from "@/db/schema";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  // Get authenticated user
  const user = await requireAuth();

  // Fetch only properties belonging to the authenticated user
  const userProperties = await db.query.properties.findMany({
    where: eq(properties.ownerId, user.id),
  });

  return (
    <div className="min-h-screen bg-stone-50/50 font-sans text-stone-900">
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
           <div className="bg-stone-900 p-1.5 rounded-lg text-white">
             <Layout className="w-5 h-5" />
           </div>
           <span className="font-bold tracking-tight text-lg">SimpleOutings Admin</span>
        </div>
        <div className="flex items-center gap-6">
           <nav className="hidden md:flex gap-6">
             <Link href="/app" className="text-sm font-medium hover:text-stone-900 text-stone-500 border-b-2 border-stone-900 py-5 translate-y-[2px]">Properties</Link>
             <Link href="#" className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5">Activity</Link>
             <Link href="#" className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5">Billing</Link>
           </nav>
           <div className="flex items-center gap-3">
             <LogoutButton />
             <div className="h-8 w-8 bg-stone-200 rounded-full" />
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-stone-500 text-lg">You have {userProperties.length} active homestay websites.</p>
          </div>
          <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full h-12 px-6 shadow-sm" asChild>
            <Link href="/new">
              <Plus className="w-4 h-4 mr-2" />
              Launch New Site
            </Link>
          </Button>
        </div>

        {userProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userProperties.map((prop) => (
              <div key={prop.id} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="h-32 bg-stone-100 overflow-hidden">
                  {/* Decorative background for the card */}
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 -mt-12 relative z-10">
                  <div className="bg-white p-3 rounded-xl shadow-sm w-fit mb-4 border border-stone-100">
                    <HomeIcon className="w-6 h-6 text-stone-400" />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-stone-600 transition-colors uppercase tracking-tight">{prop.name}</h3>
                    <div className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-green-100">Active</div>
                  </div>
                  <p className="text-stone-400 text-sm font-light mb-8 h-10 line-clamp-2">{prop.description}</p>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl border-stone-200 hover:bg-stone-50 h-11" asChild>
                      <Link href={process.env.NODE_ENV === 'production' ? `https://${prop.slug}.simpleoutings.com` : `http://${prop.slug}.localhost:3000`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl border-stone-200 hover:bg-stone-50 p-3 h-11 w-11 shadow-sm" asChild>
                       <Link href={`/app/properties/${prop.id}`}>
                         <Settings className="w-4 h-4" />
                       </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/new" className="border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-stone-50/50 hover:bg-stone-50 transition-colors group cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="w-6 h-6 text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">Add another property</p>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-3xl p-12 lg:p-20 text-center max-w-2xl mx-auto shadow-sm">
             <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Layout className="w-10 h-10 text-stone-300" />
             </div>
             <h2 className="text-2xl font-bold mb-4">Launch your first site</h2>
             <p className="text-stone-500 mb-12 text-lg font-light leading-relaxed">Fill out the details below to create your professional homestay website in under 60 seconds.</p>
             <SiteBuilderForm />
          </div>
        )}
      </main>
    </div>
  );
}
