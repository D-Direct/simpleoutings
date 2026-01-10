import { NextRequest, NextResponse } from "next/server";
import { getSuperadmin } from "@/lib/superadmin-auth";
import { db } from "@/db";
import { payments, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        // Verify superadmin authentication
        const superadmin = await getSuperadmin();
        if (!superadmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId, adminId, amount, paymentMethod, periodStart, periodEnd, referenceNumber, notes } = await request.json();

        if (!userId || !amount || !periodStart || !periodEnd) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Parse period dates
        const startDate = new Date(periodStart);
        const endDate = new Date(periodEnd);

        // Record the payment
        await db.insert(payments).values({
            userId,
            amount,
            currency: "LKR",
            status: "completed",
            paymentMethod,
            paymentDate: new Date(),
            periodStart: startDate,
            periodEnd: endDate,
            referenceNumber,
            notes,
            recordedBy: adminId,
        });

        // Update user's next payment due date (same as period end)
        await db
            .update(users)
            .set({
                nextPaymentDue: endDate,
                subscriptionStatus: "active", // Activate if suspended
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error recording payment:", error);
        return NextResponse.json(
            { error: "Failed to record payment" },
            { status: 500 }
        );
    }
}