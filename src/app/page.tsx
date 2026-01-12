import { Button } from "@/components/ui/button";
import { Globe, Layout, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-stone-900">
      {/* Header */}
      <header className="px-6 h-20 flex items-center border-b border-stone-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-stone-900 p-1.5 rounded-lg mr-3 group-hover:scale-110 transition-transform">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">SimpleOutings</span>
        </Link>
        <nav className="ml-auto flex gap-8 items-center">
          <Link className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm font-medium">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full px-6">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section - Full Page with Overlay */}
        <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/uploads/Simpleoutings-Hero.jpg"
              alt="Beautiful Sri Lankan homestay property"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 container px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/90 text-stone-900 mb-8 border border-white/20 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-stone-600 mr-2" />
              Stop giving 20% of your hard-earned money to Airbnb. Take control of your bookings.
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/tight max-w-4xl mx-auto mb-8 text-white drop-shadow-2xl">
              Beautiful Websites for <span className="text-stone-200">Sri Lankan Homestays</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-white text-lg md:text-xl lg:text-2xl font-light mb-12 drop-shadow-lg">
              Launch your property&apos;s professional website in minutes. Capture 100% of the booking value without the high commissions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 rounded-full h-14 px-10 text-lg shadow-xl" asChild>
                <Link href="/auth/signup">Start Your Free Website</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-10 text-lg border-white text-stone-900 bg-white/90 hover:bg-white backdrop-blur-sm" asChild>
                <Link href="https://blissfulbangalow.simpleoutings.com" target="_blank">View Sample Site</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 border-t border-stone-100">
          <div className="container px-4 md:px-6 mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Built for Direct Bookings</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">Everything you need to bypass travel agencies and build your own brand.</p>
          </div>
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-stone-900 transition-colors">
                  <Layout className="h-6 w-6 text-stone-900 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Premium Templates</h3>
                <p className="text-stone-500 leading-relaxed font-light">Stunning, mobile-optimized designs inspired by the best boutique villas. Ready to launch in one click.</p>
              </div>
              <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-stone-900 transition-colors">
                  <Zap className="h-6 w-6 text-stone-900 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">WhatsApp Alerts</h3>
                <p className="text-stone-500 leading-relaxed font-light">Receive booking inquiries directly on your phone. Never miss a guest with instant WhatsApp notifications.</p>
              </div>
              <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-stone-900 transition-colors">
                  <Globe className="h-6 w-6 text-stone-900 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Custom Domains</h3>
                <p className="text-stone-500 leading-relaxed font-light">Build trust with a custom .lk or .com domain. Expertly tuned for local and global SEO performance.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-stone-100 bg-stone-50 text-stone-500">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            <span className="font-bold text-lg tracking-tighter text-stone-900">SimpleOutings</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link className="hover:text-stone-900 transition-colors" href="#">Terms</Link>
            <Link className="hover:text-stone-900 transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-stone-900 transition-colors" href="#">Contact</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} SimpleOutings SL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
