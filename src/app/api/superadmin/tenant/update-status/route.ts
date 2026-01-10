import { NextRequest, NextResponse } from "next/server";
import { getSuperadmin } from "@/lib/superadmin-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
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

        const { userId, status, notes } = await request.json();

        if (!userId || !status) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate status
        if (!["active", "suspended", "cancelled"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Update user status
        const updateData: any = {
            subscriptionStatus: status,
            updatedAt: new Date(),
        };

        if (notes) {
            updateData.notes = notes;
        }

        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating tenant status:", error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}