import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default async function UpgradePage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-8">
        <Link href="/app" className="text-sm text-stone-500 hover:text-stone-900">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="container mx-auto p-6 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Upgrade Your Plan</h1>
          <p className="text-stone-600 text-lg">
            Current Plan: <span className="font-bold">{user.subscriptionPlan?.name || 'Free'}</span>
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid gap-8 lg:grid-cols-4 max-w-6xl mx-auto mb-12">
          {/* Free Tier */}
          <div className={`p-8 rounded-3xl flex flex-col ${user.subscriptionPlan?.name === 'Free' ? 'bg-stone-900 text-white border border-stone-800' : 'bg-white border border-stone-200'}`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">LKR 0</span>
              </div>
              <p className={`text-sm mt-2 ${user.subscriptionPlan?.name === 'Free' ? 'text-stone-400' : 'text-stone-500'}`}>Forever free</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Free' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Site under subdomain</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Free' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">&quot;Built with SimpleOutings&quot; badge</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Free' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Single property</span>
              </li>
            </ul>
            {user.subscriptionPlan?.name === 'Free' && (
              <div className="text-center py-3 text-sm font-medium">
                Current Plan
              </div>
            )}
          </div>

          {/* Starter Tier */}
          <div className={`p-8 rounded-3xl flex flex-col ${user.subscriptionPlan?.name === 'Starter' ? 'bg-stone-900 text-white border border-stone-800' : 'bg-white border border-stone-200'}`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">LKR 1,240</span>
                <span className={user.subscriptionPlan?.name === 'Starter' ? 'text-stone-400' : 'text-stone-500'}>/mo</span>
              </div>
              <p className={`text-sm mt-2 ${user.subscriptionPlan?.name === 'Starter' ? 'text-stone-400' : 'text-stone-500'}`}>For individual properties</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Starter' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Custom domain support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Starter' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">No branding badge</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Starter' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Single site</span>
              </li>
            </ul>
            {user.subscriptionPlan?.name === 'Starter' ? (
              <div className="text-center py-3 text-sm font-medium">
                Current Plan
              </div>
            ) : (
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link href="/contact">Select Plan</Link>
              </Button>
            )}
          </div>

          {/* Pro Tier */}
          <div className={`p-8 rounded-3xl flex flex-col ${user.subscriptionPlan?.name === 'Pro' ? 'bg-stone-900 text-white border border-stone-800' : 'bg-white border border-stone-200'} relative`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-700 text-white text-xs font-medium px-3 py-1 rounded-full">
              Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">LKR 2,490</span>
                <span className={user.subscriptionPlan?.name === 'Pro' ? 'text-stone-400' : 'text-stone-500'}>/mo</span>
              </div>
              <p className={`text-sm mt-2 ${user.subscriptionPlan?.name === 'Pro' ? 'text-stone-400' : 'text-stone-500'}`}>For growing businesses</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Pro' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">All Starter features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Pro' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Multiple sites under one domain</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Pro' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            {user.subscriptionPlan?.name === 'Pro' ? (
              <div className="text-center py-3 text-sm font-medium">
                Current Plan
              </div>
            ) : (
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link href="/contact">Select Plan</Link>
              </Button>
            )}
          </div>

          {/* Max Tier */}
          <div className={`p-8 rounded-3xl flex flex-col ${user.subscriptionPlan?.name === 'Max' ? 'bg-stone-900 text-white border border-stone-800' : 'bg-white border border-stone-200'}`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Max</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">LKR 4,990</span>
                <span className={user.subscriptionPlan?.name === 'Max' ? 'text-stone-400' : 'text-stone-500'}>/mo</span>
              </div>
              <p className={`text-sm mt-2 ${user.subscriptionPlan?.name === 'Max' ? 'text-stone-400' : 'text-stone-500'}`}>For property managers</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Max' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">All Pro features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Max' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">Unlimited sites</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className={`h-5 w-5 shrink-0 mt-0.5 ${user.subscriptionPlan?.name === 'Max' ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm">WhatsApp integration</span>
              </li>
            </ul>
            {user.subscriptionPlan?.name === 'Max' ? (
              <div className="text-center py-3 text-sm font-medium">
                Current Plan
              </div>
            ) : (
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link href="/contact">Select Plan</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-stone-600 mb-6">
            Contact us to upgrade your plan. We'll help you choose the right tier for your business needs.
          </p>
          <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full px-8 h-12" asChild>
            <Link href="/contact">Contact Us to Upgrade</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
