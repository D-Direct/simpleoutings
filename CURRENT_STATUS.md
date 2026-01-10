# SimpleOutings - Current Project Status

## ✅ Completed Features

### 1. Core Platform
- ✅ Multi-tenant SaaS architecture with subdomain routing
- ✅ Supabase authentication for users
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Property management system
- ✅ Booking and inquiry forms
- ✅ Email notifications via Resend
- ✅ Image uploads via Cloudinary
- ✅ Responsive design with Tailwind CSS

### 2. Branding & Deployment
- ✅ Rebranded from StayLaunch to SimpleOutings
- ✅ Deployed to Vercel
- ✅ Production environment configured
- ✅ All URLs updated for production domains

### 3. Superadmin System (SaaS Management)
- ✅ **Database Schema**: Superadmins, SubscriptionPlans, Payments tables
- ✅ **Authentication**: Separate superadmin verification system
- ✅ **Dashboard**: Statistics, overdue payments, recent tenants
- ✅ **Tenant Management**: View all tenants with details
- ✅ **Individual Tenant Pages**: Full management per tenant
- ✅ **Status Controls**: Active, Suspended, Cancelled
- ✅ **Payment Recording**: Track payments with custom periods
- ✅ **Auto-redirect**: Superadmins automatically go to admin dashboard on login

---

## 🔧 Setup Required (One-Time)

### Database Migration
Run this in Supabase SQL Editor: [scripts/apply-superadmin-migration.sql](scripts/apply-superadmin-migration.sql)

This creates:
- Superadmin table
- SubscriptionPlan table
- Payment table
- New User columns (subscriptionStatus, nextPaymentDue, etc.)

### Create First Superadmin
After migration, run in SQL Editor:
```sql
INSERT INTO "Superadmin" (id, email, name, "createdAt")
VALUES (gen_random_uuid(), 'your-email@example.com', 'Your Name', NOW());
```

### Create Subscription Plans
Run in SQL Editor (creates Basic, Pro, Enterprise plans):
```sql
-- See SUPERADMIN_SETUP.md for full SQL
INSERT INTO "SubscriptionPlan" ...
```

---

## 📍 Access URLs

### Production
- **Landing Page**: https://simpleoutings.com
- **Tenant Login**: https://app.simpleoutings.com/auth/login
- **Signup**: https://app.simpleoutings.com/auth/signup
- **Superadmin Login**: https://app.simpleoutings.com/auth/login (auto-detects)
- **Admin Dashboard**: https://app.simpleoutings.com/superadmin
- **Tenant Sites**: https://{slug}.simpleoutings.com

### Development
- **Landing Page**: http://localhost:3000
- **Tenant Login**: http://app.localhost:3000/auth/login
- **Admin Dashboard**: http://app.localhost:3000/superadmin
- **Tenant Sites**: http://{slug}.localhost:3000

---

## 🎯 How It Works

### User Types

**1. Superadmin (You)**
- Has account in both Supabase AND Superadmin table
- Login at `/auth/login` → auto-redirected to `/superadmin`
- Can manage all tenants, subscriptions, and payments
- Can suspend/activate tenant accounts

**2. Tenant Owner (Property Owners)**
- Has account in Supabase only
- Login at `/auth/login` → redirected to `/app`
- Can manage their own properties
- Subject to subscription status (active/suspended/cancelled)

**3. Guests (Property Visitors)**
- No account needed
- Visit tenant sites at `{slug}.simpleoutings.com`
- Can submit booking requests and inquiries

### Login Flow

```
User visits: https://app.simpleoutings.com/auth/login
     ↓
Enters email + password
     ↓
Supabase Authentication
     ↓
Is email in Superadmin table?
     ↓                    ↓
   YES                  NO
     ↓                    ↓
/superadmin          /app (tenant dashboard)
```

### Subscription Management Flow

```
Tenant Signs Up → Status: "active"
     ↓
Admin records payment → Extends subscription
     ↓
Payment overdue? → Status stays "active" (alert shown)
     ↓
Admin suspends → Status: "suspended" (blocks access)
     ↓
Admin records payment → Status: "active" (restores access)
```

---

## 🚀 Superadmin Features

### Dashboard (`/superadmin`)
- Total tenants count
- Active subscriptions count
- Total properties count
- Suspended tenants count
- Overdue payment alerts (clickable)
- Recent tenants list

### Tenant Management (`/superadmin/tenants`)
- **List View**: All tenants with key info
  - Email, properties count, plan, status, next payment due
  - Quick "Manage" button
- **Filters**: (Coming soon)
  - By status (active/suspended/cancelled)
  - By plan
  - By overdue payments
- **Search**: (Coming soon)

### Individual Tenant Page (`/superadmin/tenants/[id]`)
**Tenant Info:**
- Name, email, member since
- Current plan
- Next payment due (with overdue warning)
- Properties list with live links

**Actions:**
1. **Change Status**
   - Active: Full access
   - Suspended: Blocks access to admin and sites
   - Cancelled: Account cancelled
   - Optional notes field

2. **Record Payment**
   - Amount (defaults to plan price)
   - Payment method (bank transfer, cash, card, other)
   - Period start and end dates (customizable)
   - Reference number (optional)
   - Notes (optional)
   - Automatically extends subscription and activates account

**Payment History:**
- Shows all recorded payments
- Period covered
- Amount and status
- Payment method
- Who recorded it

---

## 📊 Database Schema

### New Tables

**Superadmin**
- id, email, name, createdAt
- Separate from regular users
- Used for admin verification

**SubscriptionPlan**
- id, name, description
- priceMonthly, currency
- features (jsonb array)
- maxProperties
- isActive

**Payment**
- id, userId, amount, currency
- status (pending, completed, failed, refunded)
- paymentMethod, paymentDate
- periodStart, periodEnd
- referenceNumber, notes
- recordedBy (superadmin who recorded it)

### Extended Tables

**User** (new columns)
- subscriptionStatus (active/suspended/cancelled)
- subscriptionPlanId
- subscriptionStartDate
- subscriptionEndDate
- nextPaymentDue
- notes (admin notes)

---

## ⏳ Pending Features

### High Priority
1. **Middleware Blocking**: Block suspended tenants from accessing sites
   - Check user status in middleware
   - Show "Account Suspended" page
   - Prevent admin panel access

### Medium Priority
2. **Subscription Plans Management**: `/superadmin/plans`
   - Create/edit/deactivate plans
   - View active plans
   - Assign plans to tenants

3. **Tenant Filters & Search**: In `/superadmin/tenants`
   - Filter by status
   - Filter by plan
   - Filter by overdue
   - Search by email/name

### Low Priority
4. **Payment Reminders**: Automated system
   - Email reminders X days before due
   - Email alerts for overdue payments
   - Dashboard notifications

5. **Analytics Dashboard**
   - Revenue tracking
   - Churn rate
   - Popular plans
   - Growth metrics

---

## 🔒 Security Notes

- Superadmin access requires BOTH Supabase auth AND Superadmin table entry
- Suspended tenants currently can still access (middleware update needed)
- All admin actions are logged with recordedBy
- Environment variables are not committed to git
- SSL enabled for production database connections

---

## 📝 Documentation Files

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Full deployment instructions
- **[SUPERADMIN_SETUP.md](SUPERADMIN_SETUP.md)**: Superadmin system setup guide
- **[CURRENT_STATUS.md](CURRENT_STATUS.md)**: This file - current project status

---

## 🎉 Ready to Use!

Once you complete the setup steps:
1. Run migration SQL
2. Create your superadmin user
3. Create subscription plans
4. Login at `/auth/login`

You'll be automatically redirected to the superadmin dashboard where you can:
- View all tenants
- Manage subscriptions
- Record payments
- Suspend/activate accounts

---

**Last Updated**: January 2026
**Version**: 1.0 - Superadmin System Complete
**Status**: Production Ready (pending migration)