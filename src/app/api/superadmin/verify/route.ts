import { NextResponse } from "next/server";
import { getSuperadmin } from "@/lib/superadmin-auth";

export async function GET() {
    try {
        const superadmin = await getSuperadmin();

        return NextResponse.json({
            isSuperadmin: !!superadmin,
            superadmin: superadmin ? {
                id: superadmin.id,
                email: superadmin.email,
                name: superadmin.name,
            } : null,
        });
    } catch (error) {
        console.error("Error verifying superadmin:", error);
        return NextResponse.json(
            { isSuperadmin: false, error: "Verification failed" },
            { status: 500 }
        );
    }
}