-- Migration: Add customer interest fields to leads table
-- This script adds the new customer interest boolean fields to replace the removed lead value and score fields

-- Add the new customer interest columns
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS interested_in_fiber BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS interested_in_wireless BOOLEAN DEFAULT FALSE;

-- Optional: Remove the old value and lead_score columns if they exist
-- Uncomment the lines below if you want to remove the old fields
-- ALTER TABLE leads DROP COLUMN IF EXISTS value;
-- ALTER TABLE leads DROP COLUMN IF EXISTS lead_score;

-- Update any existing leads to have default values for customer interests
UPDATE leads 
SET 
    interested_in_fiber = FALSE,
    interested_in_wireless = FALSE
WHERE 
    interested_in_fiber IS NULL 
    OR interested_in_wireless IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('interested_in_fiber', 'interested_in_wireless')
ORDER BY column_name;
