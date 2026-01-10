import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from '@supabase/ssr';

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    let hostname = req.headers.get("host") || "";

    // Remove port
    hostname = hostname.replace(/:\d+$/, "");

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    console.log(`[Middleware] Incoming Hostname: ${hostname} | Path: ${path}`);

    // 1. App Domain (Dashboard) - Requires authentication
    if (hostname.startsWith("app.")) {
        // Allow superadmin routes to pass through without tenant auth check
        if (path.startsWith("/superadmin")) {
            console.log(`[Middleware] Superadmin route - Passing through`);
            return NextResponse.next();
        }

        // Check authentication for app subdomain
        let supabaseResponse = NextResponse.next({ request: req });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
                        supabaseResponse = NextResponse.next({ request: req });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // Redirect to login if not authenticated (except for auth pages)
        if (!user && !path.startsWith("/auth")) {
            console.log(`[Middleware] Not authenticated, redirecting to login`);
            const redirectUrl = new URL("/auth/login", req.url);
            return NextResponse.redirect(redirectUrl);
        }

        // Redirect to dashboard if already authenticated and trying to access auth pages
        if (user && path.startsWith("/auth")) {
            console.log(`[Middleware] Already authenticated, redirecting to dashboard`);
            const redirectUrl = new URL("/app", req.url);
            return NextResponse.redirect(redirectUrl);
        }

        // For auth pages, don't rewrite - they're at the root level
        if (path.startsWith("/auth")) {
            console.log(`[Middleware] Auth page, passing through with session`);
            return supabaseResponse;
        }

        // For dashboard root or dashboard paths, pass through (already in /app directory)
        if (path === "/app" || path.startsWith("/app/") || path.startsWith("/app?")) {
            console.log(`[Middleware] Dashboard path, passing through with session`);
            // Copy auth cookies to response
            const passResponse = NextResponse.next({ request: req });
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                passResponse.cookies.set(cookie);
            });
            return passResponse;
        }

        console.log(`[Middleware] Rewriting to /app${path}`);
        const rewriteResponse = NextResponse.rewrite(new URL(`/app${path}`, req.url));

        // Copy auth cookies to rewrite response
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            rewriteResponse.cookies.set(cookie);
        });

        return rewriteResponse;
    }

    // 2. Root Domain (Landing Page)
    // Pass through for root, localhost, and IP
    if (
        hostname === "localhost" ||
        hostname === "simpleoutings.com" ||
        hostname === "www.simpleoutings.com" ||
        hostname.includes("simpleoutings.vercel.app") ||
        hostname.includes("192.168.") ||
        hostname === "127.0.0.1"
    ) {
        console.log(`[Middleware] Root/IP - Passing through`);
        return NextResponse.next();
    }

    // 3. Tenant (Public sites - no auth required)
    console.log(`[Middleware] Rewriting to /${hostname}${path}`);
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}