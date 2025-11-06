-- Remove fraudulent credits from duplicate transaction hash usage
-- Transaction hash: 0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5

-- Step 1: Delete the fraudulent credit transactions
DELETE FROM credit_transactions
WHERE description LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
AND type = 'purchase';

-- Step 2: Recalculate and update credit balances for affected users
-- This ensures the credits field matches the actual sum of transactions
UPDATE profiles
SET credits = (
  SELECT COALESCE(SUM(amount), 0)
  FROM credit_transactions
  WHERE credit_transactions.user_id = profiles.id
)
WHERE id IN (
  '1b9e827e-2406-468b-baec-85e5e0bbe127',
  '143ea630-138f-42f0-b6eb-f608346453f5'
);

-- Step 3: Verify the results
SELECT 
  p.id,
  p.email,
  p.credits as current_credits,
  COUNT(ct.id) as transaction_count,
  COALESCE(SUM(ct.amount), 0) as calculated_credits
FROM profiles p
LEFT JOIN credit_transactions ct ON ct.user_id = p.id
WHERE p.id IN (
  '1b9e827e-2406-468b-baec-85e5e0bbe127',
  '143ea630-138f-42f0-b6eb-f608346453f5'
)
GROUP BY p.id, p.email, p.credits;
