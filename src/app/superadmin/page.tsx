import { requireSuperadmin } from "@/lib/superadmin-auth";
import { db } from "@/db";
import { users, properties, payments, subscriptionPlans } from "@/db/schema";
import { eq, count, sql, and, gte } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Shield,
  Settings,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

export default async function SuperadminDashboard() {
  // Require superadmin authentication
  const superadmin = await requireSuperadmin();

  // Get statistics
  const [totalUsers] = await db
    .select({ count: count() })
    .from(users);

  const [totalProperties] = await db
    .select({ count: count() })
    .from(properties);

  const [activeUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.subscriptionStatus, "active"));

  const [suspendedUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.subscriptionStatus, "suspended"));

  // Get recent users
  const recentUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    limit: 5,
    with: {
      properties: true,
      subscriptionPlan: true,
    },
  });

  // Get users with overdue payments (next payment due is in the past)
  const overdueUsers = await db.query.users.findMany({
    where: and(
      eq(users.subscriptionStatus, "active"),
      sql`${users.nextPaymentDue} < NOW()`
    ),
    with: {
      properties: true,
    },
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Header */}
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-stone-900 p-1.5 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">
            SimpleOutings Superadmin
          </span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <Link
              href="/superadmin"
              className="text-sm font-medium hover:text-stone-900 text-stone-900 border-b-2 border-stone-900 py-5 translate-y-[2px]"
            >
              Dashboard
            </Link>
            <Link
              href="/superadmin/tenants"
              className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5"
            >
              Tenants
            </Link>
            <Link
              href="/superadmin/payments"
              className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5"
            >
              Payments
            </Link>
            <Link
              href="/superadmin/plans"
              className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5"
            >
              Plans
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <div className="h-8 w-8 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">
                {superadmin.name?.[0] || superadmin.email[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, {superadmin.name || "Admin"}
          </h1>
          <p className="text-stone-500 text-lg">
            Manage tenants, subscriptions, and payments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-stone-500">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalUsers.count}</h3>
            <p className="text-sm text-stone-500">Registered Tenants</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-stone-500">Active</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{activeUsers.count}</h3>
            <p className="text-sm text-stone-500">Active Subscriptions</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-stone-500">Live</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalProperties.count}</h3>
            <p className="text-sm text-stone-500">Property Websites</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-stone-500">Issues</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{suspendedUsers.count}</h3>
            <p className="text-sm text-stone-500">Suspended Tenants</p>
          </div>
        </div>

        {/* Overdue Payments Alert */}
        {overdueUsers.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">
                  {overdueUsers.length} Overdue Payment{overdueUsers.length !== 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  The following tenants have overdue payments and may need follow-up:
                </p>
                <div className="space-y-2">
                  {overdueUsers.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-stone-900">{user.email}</p>
                        <p className="text-xs text-stone-500">
                          Due: {user.nextPaymentDue?.toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/superadmin/tenants/${user.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                {overdueUsers.length > 3 && (
                  <Link
                    href="/superadmin/payments?filter=overdue"
                    className="text-sm text-red-700 hover:text-red-900 font-medium mt-3 inline-block"
                  >
                    View all {overdueUsers.length} overdue payments →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Tenants */}
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Tenants</h2>
            <Link href="/superadmin/tenants">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-stone-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-stone-500">
                        {user.properties.length} propert{user.properties.length !== 1 ? "ies" : "y"} •{" "}
                        {user.subscriptionPlan?.name || "No plan"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.subscriptionStatus === "active"
                        ? "bg-green-50 text-green-700"
                        : user.subscriptionStatus === "suspended"
                        ? "bg-red-50 text-red-700"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {user.subscriptionStatus}
                  </span>
                  <Link href={`/superadmin/tenants/${user.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}