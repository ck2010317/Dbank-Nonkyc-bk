-- Step 1: Check current state of all users with credits
SELECT 
  id,
  email,
  credits,
  created_at
FROM profiles
WHERE credits > 0
ORDER BY created_at DESC;

-- Step 2: Find all transactions with the duplicate hash
SELECT 
  ct.id,
  ct.user_id,
  p.email,
  ct.amount,
  ct.type,
  ct.description,
  ct.created_at
FROM credit_transactions ct
JOIN profiles p ON ct.user_id = p.id
WHERE ct.description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%'
ORDER BY ct.created_at;

-- Step 3: Delete all transactions with the duplicate hash
DELETE FROM credit_transactions
WHERE description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%';

-- Step 4: Recalculate credits for ALL users
UPDATE profiles
SET credits = (
  SELECT COALESCE(SUM(amount), 0)
  FROM credit_transactions
  WHERE user_id = profiles.id
)
WHERE id IN (
  SELECT DISTINCT user_id 
  FROM credit_transactions
  UNION
  SELECT id FROM profiles WHERE credits != 0
);

-- Step 5: Verify final state
SELECT 
  id,
  email,
  credits,
  created_at
FROM profiles
WHERE credits > 0 OR id IN (
  SELECT DISTINCT user_id FROM credit_transactions
)
ORDER BY created_at DESC;
