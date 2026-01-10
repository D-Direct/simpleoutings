import { requireSuperadmin } from "@/lib/superadmin-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft, Mail, Phone, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { notFound } from "next/navigation";
import { TenantStatusForm } from "@/components/superadmin/tenant-status-form";
import { RecordPaymentForm } from "@/components/superadmin/record-payment-form";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const superadmin = await requireSuperadmin();
  const { id } = await params;

  // Get user with all related data
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      properties: true,
      subscriptionPlan: true,
      payments: {
        orderBy: (payments, { desc }) => [desc(payments.createdAt)],
        with: {
          recordedByAdmin: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  const isOverdue = user.nextPaymentDue && new Date(user.nextPaymentDue) < new Date();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Header */}
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/superadmin/tenants" className="hover:bg-stone-50 p-2 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="bg-stone-900 p-1.5 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">
            Tenant Management
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
          <div className="h-8 w-8 bg-stone-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">
              {superadmin.name?.[0] || superadmin.email[0].toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Tenant Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-stone-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {user.name || user.email}
                </h1>
                <p className="text-stone-500">{user.email}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.subscriptionStatus === "active"
                  ? "bg-green-50 text-green-700"
                  : user.subscriptionStatus === "suspended"
                  ? "bg-red-50 text-red-700"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {user.subscriptionStatus}
            </span>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Member Since</span>
              </div>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Subscription Plan</span>
              </div>
              <p className="font-medium">
                {user.subscriptionPlan?.name || "No plan"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Next Payment</span>
              </div>
              <p className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                {user.nextPaymentDue
                  ? new Date(user.nextPaymentDue).toLocaleDateString()
                  : "Not set"}
              </p>
              {isOverdue && (
                <p className="text-xs text-red-600 font-medium mt-1">Overdue!</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-xs">Properties</span>
              </div>
              <p className="font-medium">{user.properties.length} active</p>
            </div>
          </div>
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Payment Overdue</h3>
                <p className="text-sm text-red-700">
                  This tenant's payment was due on{" "}
                  {new Date(user.nextPaymentDue!).toLocaleDateString()}. Consider
                  suspending access if payment is not received soon.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Properties */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Properties</h2>

              {user.properties.length > 0 ? (
                <div className="space-y-3">
                  {user.properties.map((property) => (
                    <div
                      key={property.id}
                      className="p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-stone-500">
                            {property.slug}.simpleoutings.com
                          </p>
                        </div>
                        <Link
                          href={`https://${property.slug}.simpleoutings.com`}
                          target="_blank"
                        >
                          <Button variant="outline" size="sm">
                            View Site
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm">No properties yet</p>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Payment History</h2>

              {user.payments.length > 0 ? (
                <div className="space-y-3">
                  {user.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 rounded-lg border border-stone-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : payment.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : payment.status === "failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-sm text-stone-500 space-y-1">
                        <p>
                          Period: {new Date(payment.periodStart).toLocaleDateString()} -{" "}
                          {new Date(payment.periodEnd).toLocaleDateString()}
                        </p>
                        {payment.paymentDate && (
                          <p>
                            Paid: {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        )}
                        {payment.paymentMethod && (
                          <p>Method: {payment.paymentMethod}</p>
                        )}
                        {payment.referenceNumber && (
                          <p>Ref: {payment.referenceNumber}</p>
                        )}
                        {payment.recordedByAdmin && (
                          <p className="text-xs">
                            Recorded by: {payment.recordedByAdmin.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm">No payment history</p>
              )}
            </div>

            {/* Admin Notes */}
            {user.notes && (
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">
                  {user.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Subscription Status</h2>
              <TenantStatusForm userId={user.id} currentStatus={user.subscriptionStatus} />
            </div>

            {/* Record Payment */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Record Payment</h2>
              <RecordPaymentForm
                userId={user.id}
                adminId={superadmin.id}
                currentPlan={user.subscriptionPlan}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}