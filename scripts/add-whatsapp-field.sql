-- Migration: Add WhatsApp number field to Property table
-- Run this in Supabase SQL Editor

-- Add WhatsApp number field
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Property' AND column_name='whatsappNumber') THEN
        ALTER TABLE "Property" ADD COLUMN "whatsappNumber" text;
    END IF;
END $$;

-- Done!
SELECT 'WhatsApp field added successfully!' as status;
