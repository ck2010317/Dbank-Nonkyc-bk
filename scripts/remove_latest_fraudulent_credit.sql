-- Remove fraudulent credit from user who reused transaction hash
-- Transaction hash: 0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5

-- Step 1: Find and delete the fraudulent transaction
DELETE FROM credit_transactions
WHERE type = 'purchase'
  AND description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
  AND user_id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36';

-- Step 2: Recalculate and update the user's credit balance
UPDATE profiles
SET credits = COALESCE((
  SELECT SUM(amount)
  FROM credit_transactions
  WHERE user_id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36'
), 0)
WHERE id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36';

-- Step 3: Verify the removal
SELECT 
  id,
  credits,
  email
FROM profiles
WHERE id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36';
