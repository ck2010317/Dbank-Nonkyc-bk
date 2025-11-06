-- Simple script to remove credit from the fraudulent user
-- User ID: dc3e4735-b57f-45c5-b41f-f2adae98dd36

-- Delete the fraudulent credit transaction
DELETE FROM credit_transactions
WHERE user_id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36'
AND type = 'purchase'
AND description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%';

-- Set the user's credit balance to 0
UPDATE profiles
SET credits = 0
WHERE id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36';

-- Verify the result
SELECT id, email, credits 
FROM profiles 
WHERE id = 'dc3e4735-b57f-45c5-b41f-f2adae98dd36';
