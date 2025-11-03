-- Remove fraudulent credits from users who reused transaction hash 0xfde722...

-- First, let's see the fraudulent transactions
-- Transaction hash: 0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5

-- Delete credit transactions with the duplicate hash
DELETE FROM credit_transactions
WHERE description LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
AND type = 'purchase';

-- Update user balances (deduct 1 credit from each user who got it)
-- User 1: 1b9e827e-2406-468b-baec-85e5e0bbe127
-- User 2: 143ea630-138f-42f0-b6eb-f608346453f5

UPDATE profiles
SET credits = GREATEST(credits - 1, 0)
WHERE id IN (
  '1b9e827e-2406-468b-baec-85e5e0bbe127',
  '143ea630-138f-42f0-b6eb-f608346453f5'
);

-- Verify the cleanup
SELECT id, email, credits FROM profiles
WHERE id IN (
  '1b9e827e-2406-468b-baec-85e5e0bbe127',
  '143ea630-138f-42f0-b6eb-f608346453f5'
);
