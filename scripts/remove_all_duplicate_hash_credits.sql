-- Remove ALL fraudulent credits from duplicate transaction hash usage
-- Transaction hash: 0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5

-- Step 1: Identify all affected users
SELECT 
  user_id,
  COUNT(*) as duplicate_count,
  SUM(amount) as total_fraudulent_credits
FROM credit_transactions
WHERE description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
AND type = 'purchase'
GROUP BY user_id;

-- Step 2: Delete ALL fraudulent credit transactions with this hash
DELETE FROM credit_transactions
WHERE description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
AND type = 'purchase';

-- Step 3: Recalculate credit balances for ALL affected users
UPDATE profiles
SET credits = (
  SELECT COALESCE(SUM(amount), 0)
  FROM credit_transactions
  WHERE credit_transactions.user_id = profiles.id
)
WHERE id IN (
  SELECT DISTINCT user_id
  FROM credit_transactions
  WHERE description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
  OR user_id IN (
    '1b9e827e-2406-468b-baec-85e5e0bbe127',
    '143ea630-138f-42f0-b6eb-f608346453f5',
    'dc3e4735-b57f-45c5-b41f-f2adae98dd36'
  )
);

-- Step 4: Verify all affected users now have correct balances
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
  '143ea630-138f-42f0-b6eb-f608346453f5',
  'dc3e4735-b57f-45c5-b41f-f2adae98dd36'
)
GROUP BY p.id, p.email, p.credits
ORDER BY p.email;
