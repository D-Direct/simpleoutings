# HomestaySaas - Next Steps Plan

**Last Updated:** January 6, 2026
**Project Status:** ~70% Complete (Phase 1 progress made)

---

## Recent Completions ✅

### UI & UX Improvements (Completed)
1. ✅ **Cloudinary Integration** - All images now upload to cloud storage
   - Hero images, about images, gallery images, room images, logo uploads
   - Automatic optimization enabled
   - CDN delivery configured
   - Documentation: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)

2. ✅ **Room Management System** - Complete CRUD functionality
   - Database schema enhanced with description, image, features
   - Admin UI with RoomsManager component
   - Room cards with modal details view
   - Click anywhere to view room details

3. ✅ **Header Navigation** - Professional fixed header
   - Logo upload and display functionality
   - Smooth-scroll navigation to sections
   - Mobile-responsive hamburger menu
   - Text logo fallback when no logo uploaded

4. ✅ **Spacing Optimization** - Reduced excessive white space
   - Changed section padding from `py-32` to `py-16`
   - Total spacing reduced from 256px to 128px between sections
   - Much cleaner, professional appearance

---

## Priority Overview

### 🔴 CRITICAL - MVP Blockers
These must be completed before any production launch:

1. **Authentication System** - Cannot launch without real user accounts
2. **Contact Form Backend** - Property owners need to receive inquiries
3. **Security Hardening** - User isolation and data protection

### 🟡 HIGH - Core Business Features
Essential for a functional booking platform:

4. **Booking System** - Core revenue feature
5. **Payment Integration** - Required for booking deposits
6. **Email Notifications** - User engagement and booking confirmations

### 🟢 MEDIUM - Enhancement Features
Important for platform maturity and user experience:

7. **Social Media Links Completion** - Marketing integration
8. **Form Validation** - Better UX and data quality
9. **Error Handling** - Professional error messages
10. **Inquiry Management** - Track and manage contact form submissions

---

## Detailed Action Plan

## Phase 1: MVP Launch Readiness

### Task 1: Authentication System 🔴 CRITICAL
**Priority:** CRITICAL
**Effort:** 8-12 hours
**Status:** Not Started

**Problem:**
- Currently using hardcoded demo user (`demo@staylaunch.lk`)
- No real signup/login functionality
- Security vulnerability: all data accessible to anyone
- No user isolation between property owners

**Implementation Options:**

**Option A: Supabase Auth (Recommended)**
- ✅ Already using Supabase for database
- ✅ Built-in email verification
- ✅ Row Level Security (RLS) for data isolation
- ✅ No additional service needed
- ✅ Free tier generous

**Option B: NextAuth.js**
- ✅ Open-source and free
- ✅ Flexible with multiple providers
- ⚠️ More manual setup required
- ⚠️ Need separate session management

**Option C: Clerk**
- ✅ Best developer experience
- ✅ Beautiful pre-built UI components
- ⚠️ Free tier limited (10k monthly active users)
- ⚠️ Additional service dependency

**Recommended: Supabase Auth**

**Implementation Steps:**
1. Install `@supabase/ssr` package
2. Create auth context and hooks
3. Build signup/login pages
4. Implement session management with cookies
5. Add password reset flow
6. Update all server actions to use real user ID
7. Add user isolation to database queries
8. Test multi-user scenarios

**Files to Create:**
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/lib/supabase/middleware.ts` - Auth middleware
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/signup/page.tsx` - Signup page
- `src/app/auth/reset-password/page.tsx` - Password reset
- `src/components/auth/auth-provider.tsx` - Auth context

**Files to Modify:**
- `src/lib/actions.ts` - Replace `getCurrentUser()` with real auth
- `src/middleware.ts` - Add auth checks
- All server actions - Add user isolation

**Success Criteria:**
- [ ] Users can sign up with email/password
- [ ] Users can log in and log out
- [ ] Sessions persist across page reloads
- [ ] Password reset works via email
- [ ] Each user only sees their own properties
- [ ] No hardcoded demo user remains

---

### Task 2: Contact Form Backend 🔴 CRITICAL
**Priority:** CRITICAL
**Effort:** 4-6 hours
**Status:** Not Started

**Problem:**
- Contact form currently logs to console only
- Property owners don't receive inquiries
- No inquiry tracking or management

**Implementation Steps:**

**Step 1: Create Inquiries Table**
```typescript
export const inquiries = pgTable("Inquiry", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  propertyId: text("propertyId").notNull().references(() => properties.id, { onDelete: "cascade" }),
  guestName: text("guestName").notNull(),
  guestEmail: text("guestEmail").notNull(),
  guestPhone: text("guestPhone"),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // "unread" | "read" | "replied"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

**Step 2: Set up Resend (Email Service)**
```bash
npm install resend react-email
```

**Step 3: Create Email Templates**
- Property owner notification email
- Guest auto-response email

**Step 4: Implement Server Action**
- Save inquiry to database
- Send email to property owner
- Send auto-response to guest
- Return success/error state

**Step 5: Create Inquiry Management UI**
- Admin view to see all inquiries
- Mark as read/unread
- Filter by status
- Reply functionality

**Files to Create:**
- `src/db/schema.ts` - Add inquiries table
- `src/lib/inquiry-actions.ts` - Server actions
- `src/lib/email/templates/inquiry-notification.tsx` - Email template
- `src/lib/email/templates/inquiry-auto-response.tsx` - Email template
- `src/app/app/inquiries/page.tsx` - Inquiry management page
- `src/components/InquiriesManager.tsx` - Admin UI

**Files to Modify:**
- `src/components/tenant/ContactForm.tsx` - Use real server action
- `src/app/app/page.tsx` - Add link to inquiries

**Environment Variables:**
```bash
RESEND_API_KEY=re_...
```

**Success Criteria:**
- [ ] Contact form saves to database
- [ ] Property owner receives email notification
- [ ] Guest receives auto-response email
- [ ] Admin can view all inquiries
- [ ] Admin can mark inquiries as read/replied
- [ ] Email delivery failures are logged

---

### Task 3: Social Media Links Completion 🟢 MEDIUM
**Priority:** MEDIUM
**Effort:** 2-3 hours
**Status:** Placeholder exists, needs implementation

**Current State:**
```tsx
<p className="text-sm text-stone-500 italic">
  Social links coming soon in next update...
</p>
```

**Implementation Steps:**

**Step 1: Add Form Fields to Admin**
- Facebook URL input
- Instagram URL input
- X (Twitter) URL input
- TripAdvisor URL input

**Step 2: Update Database Schema** (Already has `socialLinks` JSON field)
- Structure: `{ facebook?: string, instagram?: string, x?: string, tripadvisor?: string }`

**Step 3: Update Server Action**
- Parse social links from form
- Validate URLs
- Save to database

**Step 4: Display on Tenant Site Footer**
- Add social icons with links
- Hide if no links provided
- Use Lucide icons: Facebook, Instagram, Twitter, MapPin (TripAdvisor)

**Files to Modify:**
- `src/components/admin-content-form.tsx:344` - Add form fields
- `src/lib/actions.ts` - Update `updateProperty` action
- `src/components/tenant/Footer.tsx` - Display social links

**Success Criteria:**
- [ ] Admin can enter social media URLs
- [ ] URLs are validated (proper format)
- [ ] Social icons appear on tenant site footer
- [ ] Links open in new tab
- [ ] Icons hidden when URLs not provided

---

### Task 4: Form Validation with Zod 🟡 HIGH
**Priority:** HIGH
**Effort:** 4-6 hours
**Status:** Not Started

**Problem:**
- No client-side validation
- Incomplete server-side validation
- Poor error messages
- Bad data can reach database

**Implementation Steps:**

**Step 1: Install Zod**
```bash
npm install zod
```

**Step 2: Create Validation Schemas**
```typescript
// src/lib/validations/property.ts
import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9+\s-()]+$/, "Invalid phone number").optional().or(z.literal("")),
  // ... more fields
});

export const roomSchema = z.object({
  type: z.string().min(2, "Room type is required"),
  priceLKR: z.number().positive("Price must be greater than 0"),
  capacity: z.number().int().positive("Capacity must be at least 1"),
  // ... more fields
});

export const inquirySchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

**Step 3: Integrate with React Hook Form**
```bash
npm install react-hook-form @hookform/resolvers
```

**Step 4: Update Forms**
- Use `useForm` with Zod resolver
- Display validation errors inline
- Disable submit on validation errors

**Files to Create:**
- `src/lib/validations/property.ts` - Property validation schemas
- `src/lib/validations/room.ts` - Room validation schemas
- `src/lib/validations/inquiry.ts` - Inquiry validation schemas

**Files to Modify:**
- `src/components/admin-content-form.tsx` - Add validation
- `src/components/RoomsManager.tsx` - Add validation
- `src/components/tenant/ContactForm.tsx` - Add validation
- All server actions - Add Zod validation

**Success Criteria:**
- [ ] Forms show validation errors before submit
- [ ] Server actions validate input data
- [ ] Clear, helpful error messages shown
- [ ] Invalid data cannot reach database
- [ ] Email and URL fields validated properly

---

### Task 5: Error Handling & Loading States 🟡 HIGH
**Priority:** HIGH
**Effort:** 4-6 hours
**Status:** Minimal error handling exists

**Problems:**
- Server actions don't catch errors gracefully
- No user-friendly error messages
- No loading spinners during operations
- Forms don't disable during submission

**Implementation Steps:**

**Step 1: Standardize Error Response Format**
```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

**Step 2: Add Try-Catch to All Server Actions**
```typescript
export async function updateProperty(formData: FormData): Promise<ActionResult<Property>> {
  try {
    // ... validation and business logic
    return { success: true, data: property };
  } catch (error) {
    console.error("Error updating property:", error);
    return {
      success: false,
      error: "Failed to update property. Please try again."
    };
  }
}
```

**Step 3: Add Loading States to Forms**
- Use `useActionState` `isPending` state
- Show spinner icons on buttons
- Disable form inputs during submission
- Add skeleton loaders for data fetching

**Step 4: Display Error Messages**
- Use Sonner toast for errors
- Inline error messages for form fields
- Error boundaries for component errors

**Files to Modify:**
- `src/lib/actions.ts` - Add error handling to all actions
- `src/lib/room-actions.ts` - Add error handling
- `src/lib/gallery-actions.ts` - Add error handling
- `src/components/admin-content-form.tsx` - Add loading states
- `src/components/RoomsManager.tsx` - Add loading states
- `src/components/tenant/ContactForm.tsx` - Add loading states

**Files to Create:**
- `src/components/ui/loading-spinner.tsx` - Reusable spinner
- `src/lib/types/action-result.ts` - Type definitions

**Success Criteria:**
- [ ] All server actions have try-catch blocks
- [ ] Errors shown with toast notifications
- [ ] Forms show loading spinners during submit
- [ ] Buttons disabled during operations
- [ ] Console errors logged for debugging
- [ ] User sees helpful error messages

---

### Task 6: Replace window.location.reload() 🟡 HIGH
**Priority:** HIGH
**Effort:** 2-3 hours
**Status:** Multiple instances in code

**Problem:**
- Poor UX: full page reload after mutations
- Loses scroll position
- Re-fetches all data unnecessarily
- Not following Next.js best practices

**Current Instances:**
- `src/lib/actions.ts` - After amenity/testimonial operations
- `src/lib/gallery-actions.ts` - After image upload/delete
- `src/lib/room-actions.ts` - After room operations

**Solution: Use Next.js Revalidation**
```typescript
import { revalidatePath } from "next/cache";

export async function addAmenity(formData: FormData) {
  // ... business logic

  revalidatePath(`/app/properties/${propertyId}`);
  return { success: true };
}
```

**Files to Modify:**
- `src/lib/actions.ts` - Replace all reloads
- `src/lib/gallery-actions.ts` - Replace all reloads
- `src/lib/room-actions.ts` - Replace all reloads

**Success Criteria:**
- [ ] No `window.location.reload()` calls remain
- [ ] Data updates without page reload
- [ ] Scroll position maintained
- [ ] Faster user experience
- [ ] Cache properly invalidated

---

## Phase 2: Core Business Features

### Task 7: Booking System 🟡 HIGH
**Priority:** HIGH
**Effort:** 20-30 hours
**Status:** Database schema exists, no UI

**Database Schema:** ✅ Already defined in `schema.ts`

**Implementation Steps:**

**Step 1: Install Dependencies**
```bash
npm install react-day-picker date-fns
```

**Step 2: Create Availability Calendar**
- Show available/booked dates
- Date range selection
- Minimum stay validation
- Prevent past date selection

**Step 3: Build Booking Form (Tenant Site)**
- Guest name, email, phone
- Check-in/check-out dates
- Number of guests
- Special requests field
- Price calculation display

**Step 4: Create Booking Actions**
```typescript
// src/lib/booking-actions.ts
export async function createBooking(data: BookingData)
export async function checkAvailability(propertyId: string, checkIn: Date, checkOut: Date)
export async function cancelBooking(bookingId: string)
export async function updateBookingStatus(bookingId: string, status: string)
```

**Step 5: Build Admin Booking Manager**
- List all bookings
- Filter by status (pending, confirmed, completed, cancelled)
- Calendar view of bookings
- Update booking status
- View guest details

**Step 6: Add Booking Conflict Prevention**
- Check overlapping dates
- Lock dates during booking process
- Handle concurrent booking attempts

**Files to Create:**
- `src/lib/booking-actions.ts` - Server actions
- `src/components/tenant/BookingForm.tsx` - Guest booking form
- `src/components/tenant/AvailabilityCalendar.tsx` - Calendar UI
- `src/components/BookingsManager.tsx` - Admin UI
- `src/app/app/bookings/page.tsx` - Bookings dashboard

**Files to Modify:**
- `src/components/admin-content-form.tsx` - Add Bookings tab
- `src/app/[domain]/page.tsx` - Add booking section

**Success Criteria:**
- [ ] Guests can select dates and create bookings
- [ ] Date conflicts prevented
- [ ] Admin can view all bookings
- [ ] Admin can confirm/cancel bookings
- [ ] Calendar shows availability accurately
- [ ] Email notifications sent (after Task 2)

---

### Task 8: Payment Integration (PayHere.lk) 🟡 HIGH
**Priority:** HIGH
**Effort:** 12-16 hours
**Status:** Not Started

**Why PayHere:**
- Leading payment gateway in Sri Lanka
- Supports credit/debit cards, mobile wallets
- Simple integration
- Reasonable fees

**Database Addition:**
```typescript
export const payments = pgTable("Payment", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text("bookingId").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull().default("LKR"),
  status: text("status").notNull(), // "pending" | "completed" | "failed" | "refunded"
  paymentMethod: text("paymentMethod"), // "card" | "wallet" | "bank"
  transactionId: text("transactionId").unique(),
  payhereOrderId: text("payhereOrderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
```

**Implementation Steps:**

**Step 1: Sign up for PayHere**
- Create merchant account at payhere.lk
- Get Merchant ID and Secret
- Set up sandbox for testing

**Step 2: Create Payment Flow**
1. Guest creates booking → Status: "pending_payment"
2. Redirect to PayHere payment page
3. Guest completes payment
4. PayHere sends webhook notification
5. Update booking status → "confirmed"
6. Send confirmation email

**Step 3: Implement Server Actions**
```typescript
// src/lib/payment-actions.ts
export async function initiatePayment(bookingId: string)
export async function handlePaymentCallback(data: PayHereNotifyData)
export async function refundPayment(paymentId: string)
```

**Step 4: Create Webhook Endpoint**
```typescript
// src/app/api/webhooks/payhere/route.ts
export async function POST(req: Request) {
  // Verify PayHere signature
  // Update payment status
  // Update booking status
  // Send confirmation email
}
```

**Files to Create:**
- `src/lib/payment-actions.ts` - Payment operations
- `src/lib/payhere.ts` - PayHere SDK wrapper
- `src/app/api/webhooks/payhere/route.ts` - Webhook handler
- `src/components/PaymentButton.tsx` - Payment initiation UI

**Files to Modify:**
- `src/db/schema.ts` - Add payments table
- `src/components/tenant/BookingForm.tsx` - Add payment step
- `src/components/BookingsManager.tsx` - Show payment status

**Environment Variables:**
```bash
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
PAYHERE_RETURN_URL=https://yourdomain.com/booking/success
PAYHERE_CANCEL_URL=https://yourdomain.com/booking/cancelled
PAYHERE_NOTIFY_URL=https://yourdomain.com/api/webhooks/payhere
PAYHERE_MODE=sandbox # or "live"
```

**Success Criteria:**
- [ ] Guest can pay for booking with card
- [ ] Payment status tracked in database
- [ ] Webhook receives payment notifications
- [ ] Booking confirmed after successful payment
- [ ] Failed payments handled gracefully
- [ ] Refunds can be processed
- [ ] Admin can view payment history

---

### Task 9: Email Notification System 🟡 HIGH
**Priority:** HIGH
**Effort:** 8-12 hours
**Status:** Partially implemented (will use Resend from Task 2)

**Required Emails:**

1. **Inquiry Notifications** (from Task 2)
   - To property owner: New inquiry received
   - To guest: Auto-response confirmation

2. **Booking Confirmations**
   - To guest: Booking confirmed with details
   - To property owner: New booking notification
   - Include calendar invite (.ics file)

3. **Booking Reminders**
   - To guest: Reminder 24h before check-in
   - Include check-in instructions

4. **Welcome Emails**
   - To new users: Welcome to StayLaunch

5. **Password Reset**
   - To user: Reset password link

**Implementation Steps:**

**Step 1: Already done** - Resend set up in Task 2

**Step 2: Create Email Templates with React Email**
```bash
npm install @react-email/components
```

**Step 3: Create Templates**
- Modern, responsive design
- Property branding (logo, colors)
- Mobile-friendly layout

**Step 4: Set up Email Queue** (Optional but recommended)
- Use Vercel Cron Jobs or Upstash QStash
- Retry failed emails
- Rate limiting

**Files to Create:**
- `src/lib/email/templates/booking-confirmation.tsx`
- `src/lib/email/templates/booking-reminder.tsx`
- `src/lib/email/templates/welcome.tsx`
- `src/lib/email/templates/password-reset.tsx`
- `src/lib/email/send.ts` - Email sending utilities
- `src/app/api/cron/booking-reminders/route.ts` - Cron job

**Files to Modify:**
- `src/lib/booking-actions.ts` - Send emails on booking
- Auth pages - Send welcome/reset emails

**Success Criteria:**
- [ ] All email templates created and tested
- [ ] Booking confirmations sent automatically
- [ ] Reminders sent 24h before check-in
- [ ] Welcome emails sent on signup
- [ ] Password reset emails working
- [ ] Emails are mobile-responsive
- [ ] Failed emails are retried

---

## Phase 3: Platform Enhancement

### Task 10: Inquiry Management Dashboard 🟢 MEDIUM
**Priority:** MEDIUM
**Effort:** 4-6 hours
**Status:** Will be created in Task 2

(Covered in Task 2 implementation)

---

### Task 11: Image Upload Validation 🟢 MEDIUM
**Priority:** MEDIUM
**Effort:** 2-3 hours
**Status:** Minimal validation exists

**Current Problems:**
- No file type validation
- No file size limits
- No error handling for upload failures
- Users can upload non-image files

**Implementation:**

**Step 1: Add Client-Side Validation**
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image size must be less than 5MB";
  }
  return null;
}
```

**Step 2: Add Server-Side Validation**
- Verify file type on server
- Check file size limit
- Validate image dimensions if needed

**Files to Modify:**
- `src/lib/cloudinary.ts` - Add validation
- All components with file inputs - Add client validation

**Success Criteria:**
- [ ] Only image files accepted
- [ ] Files over 5MB rejected
- [ ] Clear error messages shown
- [ ] Server validates uploads
- [ ] Upload failures handled gracefully

---

### Task 12: Custom Domain Mapping 🟢 MEDIUM
**Priority:** MEDIUM
**Effort:** 12-16 hours
**Status:** Database field exists, no implementation

**Goal:** Allow premium users to use custom domains (e.g., `www.hillviewvilla.lk` instead of `hillview.staylaunch.lk`)

**Requirements:**
- Domain verification (DNS record check)
- SSL certificate provisioning
- Vercel External Domain API integration
- Admin UI for domain management

**Implementation Steps:**

**Step 1: Create Domain Verification Flow**
1. User enters custom domain
2. System generates DNS records to add
3. User adds DNS records
4. System verifies DNS records
5. Domain activated

**Step 2: Integrate Vercel Domains API**
```typescript
// src/lib/vercel-domains.ts
export async function addDomain(domain: string)
export async function verifyDomain(domain: string)
export async function removeDomain(domain: string)
```

**Step 3: Update Middleware**
- Handle custom domain routing
- Fallback to subdomain if custom domain fails

**Step 4: Create Admin UI**
- Domain input field
- DNS verification instructions
- Domain status indicator
- Remove domain button

**Files to Create:**
- `src/lib/vercel-domains.ts` - Vercel API wrapper
- `src/components/DomainManager.tsx` - Admin UI
- `src/app/api/verify-domain/route.ts` - Verification endpoint

**Files to Modify:**
- `src/middleware.ts` - Add custom domain handling
- `src/components/admin-content-form.tsx` - Add domain tab

**Environment Variables:**
```bash
VERCEL_API_TOKEN=your_token
VERCEL_PROJECT_ID=your_project_id
VERCEL_TEAM_ID=your_team_id # if using team
```

**Success Criteria:**
- [ ] Users can add custom domain
- [ ] DNS verification works
- [ ] SSL certificate auto-provisioned
- [ ] Custom domain routes correctly
- [ ] Users can remove custom domain
- [ ] Instructions clear and helpful

---

### Task 13: Subscription & Pricing System 🟢 MEDIUM
**Priority:** MEDIUM
**Effort:** 16-20 hours
**Status:** Not Started

**Goal:** Monetize the platform with subscription tiers

**Proposed Tiers:**

| Feature | Free | Pro (LKR 2,500/mo) | Enterprise (LKR 5,000/mo) |
|---------|------|-------------------|---------------------------|
| Subdomains | ✅ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ |
| Max Rooms | 3 | 10 | Unlimited |
| Max Gallery Images | 10 | 50 | Unlimited |
| Bookings | ✅ | ✅ | ✅ |
| Email Support | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |
| Remove Branding | ❌ | ✅ | ✅ |

**Database Schema:**
```typescript
export const subscriptions = pgTable("Subscription", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(), // "free" | "pro" | "enterprise"
  status: text("status").notNull(), // "active" | "cancelled" | "expired" | "past_due"
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

**Implementation Steps:**

**Step 1: Create Pricing Page**
- Comparison table
- Feature highlights
- CTA buttons

**Step 2: Integrate Payment (PayHere Recurring)**
- Set up recurring payments
- Handle subscription lifecycle

**Step 3: Feature Gating**
- Check subscription tier before operations
- Enforce limits (room count, image count)
- Show upgrade prompts

**Step 4: Subscription Management**
- User can upgrade/downgrade
- User can cancel subscription
- Handle grace periods

**Files to Create:**
- `src/app/pricing/page.tsx` - Pricing page
- `src/lib/subscription-actions.ts` - Subscription operations
- `src/lib/subscription-limits.ts` - Feature gating logic
- `src/components/SubscriptionManager.tsx` - Admin UI
- `src/app/api/webhooks/payhere-subscription/route.ts` - Webhook

**Files to Modify:**
- `src/db/schema.ts` - Add subscriptions table
- All CRUD operations - Add limit checks

**Success Criteria:**
- [ ] Pricing page live and attractive
- [ ] Users can subscribe to plans
- [ ] Recurring payments work
- [ ] Feature limits enforced
- [ ] Users can manage subscription
- [ ] Graceful handling of expired subscriptions

---

## Phase 4: Security & Polish

### Task 14: Security Hardening 🔴 CRITICAL
**Priority:** CRITICAL
**Effort:** 8-12 hours
**Status:** Basic security exists

**Security Checklist:**

**1. Authentication & Authorization**
- [ ] All routes require authentication (except public tenant sites)
- [ ] Users can only access their own properties
- [ ] Admin routes protected
- [ ] Session timeout implemented
- [ ] Password strength requirements enforced

**2. Input Validation & Sanitization**
- [ ] All user inputs validated with Zod
- [ ] SQL injection prevention (using Drizzle ORM)
- [ ] XSS prevention (React auto-escapes)
- [ ] File upload validation
- [ ] URL validation for external links

**3. CSRF Protection**
- [ ] CSRF tokens on forms
- [ ] SameSite cookie attribute set
- [ ] Origin header validation

**4. Rate Limiting**
```bash
npm install @upstash/ratelimit @upstash/redis
```
- [ ] Login attempts limited (5 per 15 minutes)
- [ ] Contact form submissions limited
- [ ] Image uploads limited
- [ ] API endpoints rate limited

**5. Environment Variables**
- [ ] All secrets in .env
- [ ] .env file in .gitignore
- [ ] No secrets in client-side code
- [ ] Production secrets rotated

**6. Database Security**
- [ ] Row Level Security (RLS) if using Supabase
- [ ] Prepared statements (Drizzle handles this)
- [ ] Cascade deletes configured
- [ ] Regular backups scheduled

**7. File Upload Security**
- [ ] File type validation
- [ ] File size limits
- [ ] Malware scanning (optional)
- [ ] Cloudinary handles CDN security

**Files to Create:**
- `src/lib/ratelimit.ts` - Rate limiting utilities
- `src/lib/csrf.ts` - CSRF token generation/validation

**Files to Modify:**
- `src/middleware.ts` - Add rate limiting
- All server actions - Add CSRF checks
- All forms - Add CSRF tokens

**Success Criteria:**
- [ ] OWASP Top 10 vulnerabilities addressed
- [ ] Rate limiting prevents abuse
- [ ] All inputs validated and sanitized
- [ ] CSRF protection on all mutations
- [ ] Security headers configured
- [ ] Regular security audits scheduled

---

### Task 15: Analytics Dashboard 🟢 LOW
**Priority:** LOW
**Effort:** 12-16 hours
**Status:** Not Started

**Goal:** Provide property owners with insights

**Metrics to Track:**

1. **Booking Analytics**
   - Total bookings
   - Revenue (by month, year)
   - Occupancy rate
   - Average booking value
   - Cancellation rate

2. **Visitor Analytics**
   - Page views
   - Unique visitors
   - Popular pages
   - Traffic sources
   - Bounce rate

3. **Inquiry Analytics**
   - Total inquiries
   - Response time
   - Conversion rate (inquiry → booking)

**Implementation Options:**

**Option A: Custom Analytics**
- Store events in database
- Build charts with Recharts
- Full control

**Option B: Google Analytics Integration**
- Easy setup
- Free
- Limited customization

**Option C: Plausible/Fathom Analytics**
- Privacy-friendly
- Beautiful dashboards
- Paid service

**Recommended:** Combination of custom (bookings/revenue) + Plausible (traffic)

**Implementation:**

```bash
npm install recharts
```

**Files to Create:**
- `src/app/app/analytics/page.tsx` - Analytics dashboard
- `src/components/analytics/BookingChart.tsx` - Booking charts
- `src/components/analytics/RevenueChart.tsx` - Revenue charts
- `src/lib/analytics.ts` - Analytics calculations

**Success Criteria:**
- [ ] Property owners see booking trends
- [ ] Revenue charts displayed
- [ ] Visitor metrics tracked
- [ ] Data exportable to CSV
- [ ] Mobile-friendly dashboard

---

## Quick Wins (Can Be Done Anytime)

These tasks provide immediate value with minimal effort:

### 1. Add Favicon and Meta Tags (30 min)
- [ ] Design/add favicon
- [ ] Add OpenGraph images
- [ ] Add Twitter Card meta tags

### 2. Add Loading Skeletons (2 hours)
- [ ] Gallery section skeleton
- [ ] Room cards skeleton
- [ ] Testimonials skeleton
- Better perceived performance

### 3. Optimize Images (1 hour)
- [ ] Use Next.js Image `priority` for hero
- [ ] Add blur placeholders
- [ ] Optimize image sizes

### 4. Add 404 Page (1 hour)
- [ ] Custom 404 for tenant sites
- [ ] Helpful navigation back

### 5. Add Sitemap (1 hour)
- [ ] Generate sitemap.xml
- [ ] Submit to search engines
- Better SEO

### 6. Add robots.txt (15 min)
- [ ] Configure crawling rules
- [ ] Point to sitemap

---

## Recommended Execution Order

### Week 1-2: MVP Blockers
1. Authentication System (Task 1) - 12 hours
2. Contact Form Backend (Task 2) - 6 hours
3. Form Validation (Task 4) - 6 hours
4. Error Handling (Task 5) - 6 hours
5. Replace window.location.reload() (Task 6) - 3 hours

**Total: 33 hours**

### Week 3-4: Core Features
6. Social Media Links (Task 3) - 3 hours
7. Image Upload Validation (Task 11) - 3 hours
8. Booking System (Task 7) - 30 hours
9. Email Notifications (Task 9) - 12 hours

**Total: 48 hours**

### Week 5-6: Revenue Features
10. Payment Integration (Task 8) - 16 hours
11. Security Hardening (Task 14) - 12 hours
12. Subscription System (Task 13) - 20 hours

**Total: 48 hours**

### Week 7+: Enhancement
13. Custom Domains (Task 12) - 16 hours
14. Analytics Dashboard (Task 15) - 16 hours
15. Testing & Bug Fixes - 20 hours
16. Documentation - 8 hours

**Total: 60 hours**

---

## Total Effort Estimate

| Phase | Hours | Weeks (Full-Time) |
|-------|-------|-------------------|
| Week 1-2: MVP Blockers | 33 | 1 week |
| Week 3-4: Core Features | 48 | 1.5 weeks |
| Week 5-6: Revenue Features | 48 | 1.5 weeks |
| Week 7+: Enhancement | 60 | 2 weeks |
| **TOTAL** | **189 hours** | **~6 weeks** |

---

## Environment Variables Checklist

Make sure these are configured:

```bash
# Database
DATABASE_URL=postgresql://...

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Resend)
RESEND_API_KEY=re_...

# Images (Cloudinary) ✅ DONE
CLOUDINARY_CLOUD_NAME=dh45fufyq
CLOUDINARY_API_KEY=317885866968382
CLOUDINARY_API_SECRET=fE8hRF-J7UQ2ms_254-arl6bG_k

# Payment (PayHere)
PAYHERE_MERCHANT_ID=...
PAYHERE_MERCHANT_SECRET=...
PAYHERE_MODE=sandbox

# Custom Domains (Vercel)
VERCEL_API_TOKEN=...
VERCEL_PROJECT_ID=...

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Success Metrics

Track these KPIs after launch:

### Technical Metrics
- [ ] Page load time < 2 seconds
- [ ] Uptime > 99.5%
- [ ] Zero critical security vulnerabilities
- [ ] Test coverage > 70%

### Business Metrics
- [ ] 10 property owners onboarded (Month 1)
- [ ] 50 bookings processed (Month 1)
- [ ] 5 paid subscriptions (Month 2)
- [ ] LKR 25,000 monthly recurring revenue (Month 3)

### User Satisfaction
- [ ] Contact form response time < 24 hours
- [ ] Customer support satisfaction > 4.5/5
- [ ] Website load time satisfaction > 4/5

---

## Conclusion

The HomestaySaas project has made excellent progress with **~70% completion**. The foundation is solid with:

✅ Beautiful UI components
✅ Multi-tenant routing
✅ Cloud image storage (Cloudinary)
✅ Room management system
✅ Professional header navigation
✅ Optimized spacing and layout

**Critical next steps:**
1. **Authentication** - Cannot launch without this
2. **Contact Form Backend** - Property owners need inquiries
3. **Security Hardening** - Protect user data

**Timeline to MVP:** 2-3 weeks
**Timeline to Full Product:** 6-8 weeks

The platform is well-positioned for a successful launch in the Sri Lankan homestay market. Focus on completing Phase 1 (MVP Blockers) before moving to revenue features.

---

**Document Created:** January 6, 2026
**Next Review:** After Task 1 (Authentication) completion
