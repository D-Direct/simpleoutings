-- Safe migration script that only creates missing tables
-- Run this in Supabase SQL Editor

-- 1. Create Superadmin table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS "Superadmin" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Superadmin_email_unique" UNIQUE("email")
);

-- 2. Create SubscriptionPlan table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"priceMonthly" double precision NOT NULL,
	"currency" text DEFAULT 'LKR' NOT NULL,
	"features" jsonb,
	"maxProperties" integer DEFAULT 1 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

-- 3. Create Payment table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'LKR' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paymentMethod" text,
	"paymentDate" timestamp,
	"periodStart" timestamp NOT NULL,
	"periodEnd" timestamp NOT NULL,
	"referenceNumber" text,
	"notes" text,
	"recordedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- 4. Add new columns to User table (if they don't exist)
-- We use DO blocks to check if columns exist before adding them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='name') THEN
        ALTER TABLE "User" ADD COLUMN "name" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='phone') THEN
        ALTER TABLE "User" ADD COLUMN "phone" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='subscriptionStatus') THEN
        ALTER TABLE "User" ADD COLUMN "subscriptionStatus" text DEFAULT 'active' NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='subscriptionPlanId') THEN
        ALTER TABLE "User" ADD COLUMN "subscriptionPlanId" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='subscriptionStartDate') THEN
        ALTER TABLE "User" ADD COLUMN "subscriptionStartDate" timestamp;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='subscriptionEndDate') THEN
        ALTER TABLE "User" ADD COLUMN "subscriptionEndDate" timestamp;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='nextPaymentDue') THEN
        ALTER TABLE "User" ADD COLUMN "nextPaymentDue" timestamp;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='notes') THEN
        ALTER TABLE "User" ADD COLUMN "notes" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='updatedAt') THEN
        ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;
    END IF;
END $$;

-- 5. Add foreign keys (if they don't exist)
DO $$
BEGIN
    -- Payment -> User foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Payment_userId_User_id_fk'
    ) THEN
        ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_User_id_fk"
        FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
    END IF;

    -- Payment -> Superadmin foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Payment_recordedBy_Superadmin_id_fk'
    ) THEN
        ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedBy_Superadmin_id_fk"
        FOREIGN KEY ("recordedBy") REFERENCES "public"."Superadmin"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- User -> SubscriptionPlan foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'User_subscriptionPlanId_SubscriptionPlan_id_fk'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionPlanId_SubscriptionPlan_id_fk"
        FOREIGN KEY ("subscriptionPlanId") REFERENCES "public"."SubscriptionPlan"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;

-- Success message
SELECT 'Migration completed successfully! ✅' AS result;