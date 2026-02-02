import { Globe } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-stone max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We collect information you provide directly to us, including your name, email address, phone number, and property details when you create an account and set up your website.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your inquiries.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform, provided they agree to keep your information confidential.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children&apos;s Privacy</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            Our service is not intended for use by children under the age of 18. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
