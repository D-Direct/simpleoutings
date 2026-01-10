1. Executive Summary & Concept
StayLaunch SL is a "Shopify-style" multi-tenant SaaS platform specifically for the Sri Lankan homestay and small motel market. It allows non-technical owners to launch professional, high-performance websites (similar to mistyheaven.lk) in minutes.

The Problem: Local providers pay high commissions to OTAs (Airbnb/Booking) or have no professional web presence beyond Facebook. The Solution: A subscription-based platform where they get a custom domain, an availability manager, and a direct inquiry/booking system.

2. The "Vibe" & Design Language
Reference Site: https://mistyheaven.lk/

Aesthetic: Minimalist, high-end boutique feel. Large imagery, serif typography for elegance, and "sticky" call-to-action buttons.

Experience: Lightning-fast loading (90+ Mobile Lighthouses score) to accommodate Sri Lankan 4G/LTE mobile users.

3. Technical Stack (Recommended for AI Development)
Framework: Next.js 15 (App Router)

Routing: Vercel Platforms Architecture (Middleware for Subdomains & Custom Domains)

Database: PostgreSQL with Prisma ORM (via Supabase or Neon)

Authentication: Clerk or NextAuth.js (Email OTP is preferred for ease of use)

Styling: Tailwind CSS + Shadcn UI

Media: Cloudinary or ImageKit (Automatic WebP conversion and resizing)

Localization: * Payments: PayHere.lk (LKR integration)

Alerts: Text.lk or Notify.lk (SMS API for new booking alerts)

4. System Architecture: Multi-Tenancy
The AI agent must implement a "Wildcard" routing system:

Main Site: staylaunch.lk (Landing page, pricing, sign-up)

App Site: app.staylaunch.lk (Owner dashboard to manage content)

Subdomain Sites: [slug].staylaunch.lk (The generated homestay site)

Custom Domains: [custom-domain].lk (Mapping external domains to the tenant's ID)

5. Database Schema (Prisma)
Code snippet

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  properties    Property[]
  createdAt     DateTime   @default(now())
}

model Property {
  id            String     @id @default(cuid())
  name          String     // e.g., Misty Heaven
  slug          String     @unique // e.g., misty-heaven
  customDomain  String?    @unique // e.g., mistyheaven.lk
  description   String?    @db.Text
  address       String?
  phone         String?
  email         String?    // Public email for inquiries
  logo          String?
  images        String[]   // Array of Cloudinary URLs
  rooms         Room[]
  bookings      Booking[]
  owner         User       @relation(fields: [ownerId], references: [id])
  ownerId       String
  themeConfig   Json?      // Store colors, fonts, and template choice
}

model Room {
  id            String     @id @default(cuid())
  type          String     // e.g., Deluxe Double
  priceLKR      Float
  capacity      Int
  property      Property   @relation(fields: [propertyId], references: [id])
  propertyId    String
}

model Booking {
  id            String     @id @default(cuid())
  checkIn       DateTime
  checkOut      DateTime
  guestName     String
  guestPhone    String
  status        String     @default("PENDING") // PENDING, CONFIRMED, CANCELLED
  property      Property   @relation(fields: [propertyId], references: [id])
  propertyId    String
}
6. Implementation Roadmap
Phase 1: The Core Platform (Multi-tenant)
Setup Next.js with middleware.ts to detect hostnames.

Implement logic: If hostname is app.staylaunch.lk, show the Dashboard; otherwise, show the Tenant Site.

Create a basic "Site Builder" form where an owner can input their Name, Description, and upload 3 photos.

Phase 2: The Storefront Template
Build a high-conversion landing page template based on mistyheaven.lk.

This template must be dynamic: it fetches data from the DB based on the current domain.

Implement an Inquiry Form that triggers an email and an SMS to the owner.

Phase 3: Booking & Availability
Create a simple Calendar UI for owners to mark dates as "Booked."

Add "Pay with PayHere" button for direct deposit collection.

Phase 4: Custom Domain Mapping
Integrate Vercel's External Domain API to allow users to add their own .lk or .com domains.

7. Directives for the AI Agent (Vibe Code Prompt)
"Act as a Senior Full-Stack Engineer. Build a multi-tenant SaaS for Sri Lankan homestays.

Use Next.js App Router and Prisma.

Primary Goal: Implement middleware.ts to handle custom domain routing so that one codebase serves multiple unique websites.

Create a public-facing template that looks exactly like a premium boutique villa site (use mistyheaven.lk as a reference for UI/UX).

Ensure all images are lazy-loaded and optimized for mobile performance.

Build an 'Owner Admin' area where they can update their room prices and gallery images without touching code.

Include a 'Call Back Request' feature that sends a notification to the owner."

8. Success Metrics for Development
Time to Launch: An owner should be able to register and have a live URL in under 5 minutes.

SEO: Every tenant site must automatically generate Meta Tags and OpenGraph images for social sharing.

Simplicity: The dashboard must be simple enough for a non-tech-savvy host to use on a smartphone.