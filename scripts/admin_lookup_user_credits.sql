-- Admin Script: Look up user information and credit balance
-- Usage: Run this script to see all users and their credits
-- To search for a specific user, uncomment and modify the WHERE clause

-- View all users with their credit balance
SELECT 
  id as user_id,
  email,
  credits,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC;

-- To search for a specific user by email, use this query instead:
-- SELECT 
--   id as user_id,
--   email,
--   credits,
--   created_at,
--   updated_at
-- FROM profiles
-- WHERE email = 'machielsrobin@hotmail.com';

-- To search for users with specific credit amounts:
-- SELECT 
--   id as user_id,
--   email,
--   credits,
--   created_at,
--   updated_at
-- FROM profiles
-- WHERE credits >= 1
-- ORDER BY credits DESC;

-- To see credit transaction history for a specific user:
-- SELECT 
--   ct.*,
--   p.email
-- FROM credit_transactions ct
-- JOIN profiles p ON ct.user_id = p.id
-- WHERE p.email = 'machielsrobin@hotmail.com'
-- ORDER BY ct.created_at DESC;
