-- Add the old transaction hash to the permanent blacklist
-- This will prevent it from being reused even if credits are deleted

INSERT INTO used_transaction_hashes (transaction_hash, network, first_used_by, first_used_at)
SELECT 
  '0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5' as transaction_hash,
  'base' as network,
  id as first_used_by,
  NOW() as first_used_at
FROM auth.users
LIMIT 1
ON CONFLICT (transaction_hash) DO NOTHING;

-- Verify it was added
SELECT * FROM used_transaction_hashes 
WHERE transaction_hash = '0xfde722095de5c990f9fa104064494b7927e35e37bed8efcab19dd4c7ef8827f5';
