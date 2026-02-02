import { Globe } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-stone max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            By accessing and using SimpleOutings, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            SimpleOutings provides a website building platform specifically designed for homestay and accommodation businesses in Sri Lanka. Our service allows property owners to create and manage professional websites for their properties.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Content Guidelines</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            You retain ownership of all content you upload to your website. However, you grant SimpleOutings a license to host, display, and distribute your content as necessary to provide our services. You agree not to upload content that is illegal, harmful, or violates the rights of others.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            Paid subscriptions are billed monthly. You may cancel your subscription at any time, and you will continue to have access until the end of your current billing period. Refunds are provided at our discretion.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            SimpleOutings is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our platform. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:info@simpleoutings.com" className="text-stone-900 underline">info@simpleoutings.com</a>.
          </p>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-stone-100 bg-stone-50 text-stone-500 text-center text-sm">
        <p>© {new Date().getFullYear()} SimpleOutings. All rights reserved.</p>
      </footer>
    </div>
  );
}
