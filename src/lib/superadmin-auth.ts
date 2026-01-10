import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/db";
import { superadmins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createServerClient } from "@supabase/ssr";

// Check if user is authenticated as superadmin
export async function requireSuperadmin() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/superadmin/login");
    }

    // Check if user is a superadmin
    const superadmin = await db.query.superadmins.findFirst({
        where: eq(superadmins.email, user.email!),
    });

    if (!superadmin) {
        // Not a superadmin, redirect to login
        redirect("/superadmin/login");
    }

    return superadmin;
}

// Check superadmin status without redirecting
export async function getSuperadmin() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Check if user is a superadmin
    const superadmin = await db.query.superadmins.findFirst({
        where: eq(superadmins.email, user.email!),
    });

    return superadmin;
}