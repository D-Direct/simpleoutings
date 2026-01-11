-- Migration: Add Connect Section and Location fields to Property table
-- Run this in Supabase SQL Editor

-- Add Connect Section fields
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='connectTitle') THEN
        ALTER TABLE "Property" ADD COLUMN "connectTitle" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='connectDescription') THEN
        ALTER TABLE "Property" ADD COLUMN "connectDescription" text;
    END IF;
END $$;

-- Add Location fields for Google Maps
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='locationAddress') THEN
        ALTER TABLE "Property" ADD COLUMN "locationAddress" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='latitude') THEN
        ALTER TABLE "Property" ADD COLUMN "latitude" double precision;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='longitude') THEN
        ALTER TABLE "Property" ADD COLUMN "longitude" double precision;
    END IF;
END $$;

-- Set default values for existing properties (optional)
UPDATE "Property"
SET
    "connectTitle" = 'Plan Your Escape',
    "connectDescription" = 'Whether you have a specific request or just want to say hello, we''d love to hear from you.'
WHERE "connectTitle" IS NULL;

-- Done!
SELECT 'Migration completed successfully!' as status;
