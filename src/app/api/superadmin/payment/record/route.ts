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

        const { userId, adminId, amount, paymentMethod, referenceNumber, notes } = await request.json();

        if (!userId || !amount) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Calculate period (1 month from now)
        const periodStart = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        // Record the payment
        await db.insert(payments).values({
            userId,
            amount,
            currency: "LKR",
            status: "completed",
            paymentMethod,
            paymentDate: new Date(),
            periodStart,
            periodEnd,
            referenceNumber,
            notes,
            recordedBy: adminId,
        });

        // Update user's next payment due date
        const nextPaymentDue = new Date(periodEnd);
        await db
            .update(users)
            .set({
                nextPaymentDue,
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