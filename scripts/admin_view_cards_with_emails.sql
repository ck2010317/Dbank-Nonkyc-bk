-- =====================================================
-- ADMIN SCRIPT: View All Cards with Email Addresses
-- =====================================================
-- Purpose: View all cards with their last 4 digits and associated email addresses
-- Use case: Apple Pay forwarding and card-to-user mapping
-- =====================================================

-- Query #1: View all cards with user email addresses
-- This shows all cards mapped to users with their email addresses
SELECT 
  c.id as card_database_id,
  c.zeroid_card_id,
  c.title as card_title,
  c.created_at as card_created_at,
  p.id as user_id,
  p.email as user_email,
  p.credits as user_credits
FROM cards c
INNER JOIN profiles p ON c.user_id = p.id
ORDER BY c.created_at DESC;

-- =====================================================

-- Query #2: Search for cards by specific email
-- Uncomment and replace the email to find cards for a specific user
/*
SELECT 
  c.id as card_database_id,
  c.zeroid_card_id,
  c.title as card_title,
  c.created_at as card_created_at,
  p.email as user_email
FROM cards c
INNER JOIN profiles p ON c.user_id = p.id
WHERE p.email = 'user@example.com'
ORDER BY c.created_at DESC;
*/

-- =====================================================

-- Query #3: Count cards per user
-- Shows how many cards each user has
SELECT 
  p.email as user_email,
  p.id as user_id,
  COUNT(c.id) as total_cards,
  p.credits as user_credits
FROM profiles p
LEFT JOIN cards c ON c.user_id = p.id
GROUP BY p.id, p.email, p.credits
HAVING COUNT(c.id) > 0
ORDER BY total_cards DESC;

-- =====================================================

-- Query #4: View all users with their card count
-- Includes users with 0 cards
SELECT 
  p.email as user_email,
  p.id as user_id,
  p.credits as user_credits,
  COUNT(c.id) as total_cards,
  p.created_at as user_joined_at
FROM profiles p
LEFT JOIN cards c ON c.user_id = p.id
GROUP BY p.id, p.email, p.credits, p.created_at
ORDER BY p.created_at DESC;

-- =====================================================

-- Query #5: Search by ZeroID card ID
-- Uncomment and replace the card ID to find the user for a specific card
/*
SELECT 
  c.zeroid_card_id,
  c.title as card_title,
  p.email as user_email,
  p.id as user_id,
  c.created_at as card_created_at
FROM cards c
INNER JOIN profiles p ON c.user_id = p.id
WHERE c.zeroid_card_id = '0ea78f81-e2c0-4650-93cb-0e2971da9f8f'
LIMIT 1;
*/

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. The 'zeroid_card_id' is the ID from ZeroID's system
-- 2. The last 4 digits are stored in ZeroID's API, not in your database
-- 3. To get the last 4 digits, you need to:
--    - Take the zeroid_card_id from this query
--    - Match it with the card data from your application's card list
--    - The card list fetches from ZeroID API and includes last4 field
-- 4. For Apple Pay forwarding:
--    - Export this data
--    - Match zeroid_card_id with your app's card list to get last4
--    - Use email + last4 for Apple Pay opt-in forwarding
-- =====================================================
