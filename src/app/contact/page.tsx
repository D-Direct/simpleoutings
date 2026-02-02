import { Globe, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      <header className="px-6 h-20 flex items-center border-b border-stone-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-stone-900 p-1.5 rounded-lg mr-3 group-hover:scale-110 transition-transform">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">SimpleOutings</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Have questions about SimpleOutings? We&apos;re here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+94777889880" className="text-stone-600 hover:text-stone-900 transition-colors">
                    +94 777 889 880
                  </a>
                  <p className="text-sm text-stone-400 mt-1">Mon - Sat, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@simpleoutings.com" className="text-stone-600 hover:text-stone-900 transition-colors">
                    info@simpleoutings.com
                  </a>
                  <p className="text-sm text-stone-400 mt-1">We&apos;ll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-stone-600">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <Button type="submit" className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-full h-12">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-stone-100 bg-stone-50 text-stone-500 text-center text-sm">
        <p>© {new Date().getFullYear()} SimpleOutings. All rights reserved.</p>
      </footer>
    </div>
  );
}
