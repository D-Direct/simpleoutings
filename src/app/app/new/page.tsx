import { SiteBuilderForm } from "@/components/site-builder-form";
import Link from "next/link";
import { ChevronLeft, Layout } from "lucide-react";

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-stone-50/50 font-sans text-stone-900">
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
           <Link href="/app" className="hover:bg-stone-50 p-2 rounded-lg transition-colors">
             <ChevronLeft className="w-5 h-5" />
           </Link>
           <div className="bg-stone-900 p-1.5 rounded-lg text-white">
             <Layout className="w-5 h-5" />
           </div>
           <span className="font-bold tracking-tight text-lg">Launch New Site</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8 lg:p-12">
        <div className="bg-white border border-stone-200 rounded-3xl p-10 lg:p-16 shadow-sm">
           <h1 className="text-3xl font-bold mb-4">Property Details</h1>
           <p className="text-stone-500 mb-10 text-lg font-light leading-relaxed">
             Fill out the information below to create your professional homestay website. 
             You can always edit these details later in your property settings.
           </p>
           <SiteBuilderForm />
        </div>
      </main>
    </div>
  );
}
