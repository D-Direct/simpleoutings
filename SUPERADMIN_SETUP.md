# Superadmin Setup Guide

## How Superadmin Authentication Works

The superadmin system uses **Supabase authentication** (same as tenants) but with an additional verification step:

1. Superadmins must have a Supabase account (email + password)
2. Their email must be registered in the `Superadmin` table
3. When logging in at `/superadmin/login`, the system:
   - Authenticates with Supabase
   - Checks if the email exists in the `Superadmin` table
   - Grants access only if both conditions are met

This approach provides:
- ✅ Secure password management via Supabase
- ✅ Separation between tenant owners and superadmins
- ✅ Easy to add/remove superadmin access

---

## Step 1: Create Your First Superadmin

You need to do two things:

### A. Create a Supabase Account

1. Go to: `https://app.simpleoutings.com/auth/signup`
2. Sign up with your admin email (e.g., `admin@simpleoutings.com`)
3. Complete the signup process

### B. Add Your Email to Superadmin Table

You have two options:

**Option 1: Using Supabase Dashboard**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor"
4. Run this query:

```sql
INSERT INTO "Superadmin" (id, email, name, "createdAt")
VALUES (
    gen_random_uuid(),
    'your-email@example.com',  -- Replace with your email
    'Admin Name',               -- Replace with your name
    NOW()
);
```

**Option 2: Using Drizzle Studio**
1. Run locally: `npm run db:studio`
2. Navigate to the `Superadmin` table
3. Click "Add Row"
4. Fill in:
   - `email`: Your admin email (must match Supabase account)
   - `name`: Your display name
5. Save

---

## Step 2: Access the Superadmin Panel

1. Go to: `https://app.simpleoutings.com/superadmin/login`
2. Enter your email and password
3. You'll be verified and redirected to the superadmin dashboard

If you see "Access denied. Superadmin credentials required" it means:
- ✅ Your Supabase account works
- ❌ Your email is not in the Superadmin table

---

## Step 3: Create Subscription Plans

Before you can assign plans to tenants, you need to create subscription plans:

**Option 1: Run the Seed Script** (Recommended)

The script creates 3 default plans:
- **Basic**: 2,500 LKR/month - 1 property
- **Pro**: 5,000 LKR/month - 3 properties
- **Enterprise**: 10,000 LKR/month - Unlimited properties

```bash
npx tsx scripts/seed-subscription-plans.ts
```

**Option 2: Use Supabase SQL Editor**

```sql
INSERT INTO "SubscriptionPlan" (id, name, description, "priceMonthly", currency, features, "maxProperties", "isActive", "createdAt")
VALUES
(
    gen_random_uuid(),
    'Basic',
    'Perfect for small homestays getting started',
    2500,
    'LKR',
    '["1 Property Website","Unlimited Rooms","Booking Management","Contact Forms","Email Notifications","Image Gallery","Mobile Responsive"]'::jsonb,
    1,
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Pro',
    'For growing businesses with multiple properties',
    5000,
    'LKR',
    '["Up to 3 Property Websites","Unlimited Rooms","Priority Support","Custom Domain Support","Advanced Analytics","Custom Branding","All Basic Features"]'::jsonb,
    3,
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Enterprise',
    'For large hotel chains and property managers',
    10000,
    'LKR',
    '["Unlimited Properties","Dedicated Account Manager","White Label Solution","API Access","Custom Integrations","24/7 Premium Support","All Pro Features"]'::jsonb,
    999,
    true,
    NOW()
);
```

---

## Superadmin Features

Once logged in, you can:

### Dashboard (`/superadmin`)
- View statistics (total tenants, active subscriptions, properties)
- See overdue payment alerts
- Monitor recent tenant activity

### Tenant Management (`/superadmin/tenants`)
- View all registered tenants
- Click "Manage" on any tenant to:
  - Change subscription status (Active/Suspended/Cancelled)
  - Record payments
  - View payment history
  - See their properties
  - Add admin notes

### Status Controls
- **Active**: Tenant has full access to admin panel and their sites
- **Suspended**: Blocks access to admin panel and tenant sites (useful for non-payment)
- **Cancelled**: Tenant account is cancelled

### Recording Payments
When you record a payment:
- Automatically extends subscription by 1 month
- Updates next payment due date
- Marks tenant as "active" (unsuspends if needed)
- Tracks payment method, reference number, and notes

---

## Common Tasks

### Add a New Superadmin
```sql
INSERT INTO "Superadmin" (id, email, name, "createdAt")
VALUES (gen_random_uuid(), 'new-admin@email.com', 'New Admin Name', NOW());
```
(They still need to create a Supabase account first)

### Remove Superadmin Access
```sql
DELETE FROM "Superadmin" WHERE email = 'admin@email.com';
```

### View All Superadmins
```sql
SELECT * FROM "Superadmin" ORDER BY "createdAt" DESC;
```

### Manually Suspend a Tenant
```sql
UPDATE "User"
SET "subscriptionStatus" = 'suspended',
    "updatedAt" = NOW()
WHERE email = 'tenant@email.com';
```

### Check Overdue Payments
```sql
SELECT email, "nextPaymentDue", "subscriptionStatus"
FROM "User"
WHERE "nextPaymentDue" < NOW()
  AND "subscriptionStatus" = 'active'
ORDER BY "nextPaymentDue" ASC;
```

---

## Security Notes

- Superadmin emails are stored separately from tenant emails
- Superadmins should use strong passwords in Supabase
- Never share superadmin credentials
- Regularly review the Superadmin table for unauthorized access
- Consider enabling 2FA in Supabase for superadmin accounts

---

## Troubleshooting

### "Access denied. Superadmin credentials required"
- Verify your email exists in the Superadmin table
- Check that the email matches exactly (including uppercase/lowercase)

### "Invalid login credentials"
- Your Supabase account password is incorrect
- Reset password at `/auth/login`

### Can't access `/superadmin/login`
- Ensure domains are configured in Vercel
- Check that middleware is deployed (latest version)
- Verify you're accessing `https://app.simpleoutings.com/superadmin/login`

### Subscription plans not showing
- Run the seed script or manually insert plans
- Check Supabase SQL Editor for existing plans

---

## Next Steps

After setting up:
1. Log in to superadmin panel
2. Create subscription plans (if not already done)
3. Existing tenants will appear in the tenant list
4. You can now manage their subscriptions and payments!