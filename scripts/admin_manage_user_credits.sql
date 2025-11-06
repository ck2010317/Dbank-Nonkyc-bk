-- =====================================================
-- ADMIN SCRIPT: Manage User Credits
-- =====================================================
-- This script allows you to view and manage user credits
-- Run queries individually as needed
-- =====================================================

-- =====================================================
-- 1. VIEW USER INFORMATION
-- =====================================================

-- View all users with their credits
SELECT 
  id as user_id,
  email,
  credits,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC;

-- View specific user by email
SELECT 
  id as user_id,
  email,
  credits,
  created_at,
  updated_at
FROM profiles
WHERE email = 'machielsrobin@hotmail.com';

-- =====================================================
-- 2. SET CREDITS TO ZERO
-- =====================================================

-- Set credits to 0 for specific user
UPDATE profiles
SET 
  credits = 0,
  updated_at = NOW()
WHERE email = 'machielsrobin@hotmail.com';

-- Verify the update
SELECT email, credits FROM profiles WHERE email = 'machielsrobin@hotmail.com';

-- =====================================================
-- 3. SET CREDITS TO SPECIFIC AMOUNT
-- =====================================================

-- Set credits to a specific amount (change the number as needed)
UPDATE profiles
SET 
  credits = 5,  -- Change this number to desired amount
  updated_at = NOW()
WHERE email = 'machielsrobin@hotmail.com';  -- Change email as needed

-- =====================================================
-- 4. ADD CREDITS
-- =====================================================

-- Add credits to a user (increases their current balance)
UPDATE profiles
SET 
  credits = credits + 1,  -- Change this number to add more/less
  updated_at = NOW()
WHERE email = 'machielsrobin@hotmail.com';  -- Change email as needed

-- =====================================================
-- 5. SUBTRACT CREDITS
-- =====================================================

-- Subtract credits from a user (decreases their current balance)
UPDATE profiles
SET 
  credits = GREATEST(credits - 1, 0),  -- Change the number, won't go below 0
  updated_at = NOW()
WHERE email = 'machielsrobin@hotmail.com';  -- Change email as needed

-- =====================================================
-- 6. VIEW CREDIT TRANSACTION HISTORY
-- =====================================================

-- Removed transaction_hash column that doesn't exist in the database
-- View all credit transactions for a specific user
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
WHERE p.email = 'machielsrobin@hotmail.com'  -- Change email as needed
ORDER BY ct.created_at DESC;

-- =====================================================
-- 7. BULK OPERATIONS
-- =====================================================

-- View all users with 0 credits
SELECT email, credits, created_at
FROM profiles
WHERE credits = 0
ORDER BY created_at DESC;

-- View all users with credits > 0
SELECT email, credits, created_at
FROM profiles
WHERE credits > 0
ORDER BY credits DESC;

-- Set all users to 0 credits (USE WITH CAUTION!)
-- UPDATE profiles SET credits = 0, updated_at = NOW();

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================
-- 1. To view user info: Run query #1 or #2
-- 2. To set credits to zero: Run query #3
-- 3. To set credits to specific amount: Edit and run query #4
-- 4. To add credits: Edit and run query #5
-- 5. To subtract credits: Edit and run query #6
-- 6. To view transaction history: Run query #7
-- 
-- Always verify changes by running the view query after updates!
-- =====================================================
