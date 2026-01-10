import { requireSuperadmin } from "@/lib/superadmin-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, Search, Filter } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

export default async function TenantsPage() {
  const superadmin = await requireSuperadmin();

  // Get all users with their properties and subscription details
  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      properties: true,
      subscriptionPlan: true,
      payments: {
        orderBy: (payments, { desc }) => [desc(payments.createdAt)],
        limit: 1,
      },
    },
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
              className="text-sm font-medium hover:text-stone-900 text-stone-500 py-5"
            >
              Dashboard
            </Link>
            <Link
              href="/superadmin/tenants"
              className="text-sm font-medium hover:text-stone-900 text-stone-900 border-b-2 border-stone-900 py-5 translate-y-[2px]"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Tenant Management
            </h1>
            <p className="text-stone-500 text-lg">
              {allUsers.length} total tenants
            </p>
          </div>
        </div>

        {/* Filters - Coming soon */}
        {/* <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by email, name, or property..."
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div> */}

        {/* Tenants Table */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Tenant
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Properties
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Plan
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Next Payment
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-600">
                  Joined
                </th>
                <th className="text-right p-4 text-sm font-medium text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-stone-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name || user.email}</p>
                        <p className="text-sm text-stone-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{user.properties.length}</span>
                      {user.properties.length > 0 && (
                        <span className="text-xs text-stone-500">
                          {user.properties.map(p => p.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">
                      {user.subscriptionPlan?.name || "No plan"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        user.subscriptionStatus === "active"
                          ? "bg-green-50 text-green-700"
                          : user.subscriptionStatus === "suspended"
                          ? "bg-red-50 text-red-700"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.nextPaymentDue ? (
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {new Date(user.nextPaymentDue).toLocaleDateString()}
                        </span>
                        {new Date(user.nextPaymentDue) < new Date() && (
                          <span className="text-xs text-red-600 font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-stone-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-stone-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/superadmin/tenants/${user.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No tenants yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}