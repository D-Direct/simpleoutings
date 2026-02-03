-- Insert Subscription Plans for SimpleOutings
-- Run this SQL script directly in your database (Supabase SQL Editor, pgAdmin, etc.)

INSERT INTO "SubscriptionPlan" ("id", "name", "description", "priceMonthly", "currency", "features", "maxProperties", "isActive", "createdAt")
VALUES
  (
    gen_random_uuid(),
    'Free',
    'Forever free',
    0,
    'LKR',
    '["Site under subdomain", "\"Built with SimpleOutings\" badge", "Single property"]'::jsonb,
    1,
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'Starter',
    'For individual properties',
    1240,
    'LKR',
    '["Custom domain support", "No branding badge", "Single site"]'::jsonb,
    1,
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pro',
    'For growing businesses',
    2490,
    'LKR',
    '["All Starter features", "Multiple sites under one domain", "Priority support"]'::jsonb,
    999,
    true,
    NOW()
  ),
  (
    gen_random_uuid(),
    'Max',
    'For property managers',
    4990,
    'LKR',
    '["All Pro features", "Unlimited sites", "WhatsApp integration"]'::jsonb,
    999,
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the plans were inserted
SELECT * FROM "SubscriptionPlan" ORDER BY "priceMonthly";
