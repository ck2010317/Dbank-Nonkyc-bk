-- Remove fraudulent credit from user d0d175d0-1317-4ccc-8351-6e78fd8ae294
-- This user reused transaction hash 0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5

-- Delete the fraudulent credit transaction
DELETE FROM credit_transactions
WHERE user_id = 'd0d175d0-1317-4ccc-8351-6e78fd8ae294'
AND type = 'purchase'
AND description::text LIKE '%0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5%';

-- Reset the user's credit balance to 0
UPDATE profiles
SET credits = 0
WHERE id = 'd0d175d0-1317-4ccc-8351-6e78fd8ae294';

-- Verify the results
SELECT 
  id,
  email,
  credits,
  created_at
FROM profiles
WHERE id = 'd0d175d0-1317-4ccc-8351-6e78fd8ae294';
