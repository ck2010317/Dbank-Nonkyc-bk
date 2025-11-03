-- Create permanent blacklist table for used transaction hashes
-- This table should NEVER have rows deleted, even when removing fraudulent credits

CREATE TABLE IF NOT EXISTS used_transaction_hashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_hash TEXT NOT NULL UNIQUE,
  network TEXT NOT NULL,
  first_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_used_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_used_transaction_hashes_hash 
ON used_transaction_hashes(transaction_hash);

-- Enable RLS
ALTER TABLE used_transaction_hashes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (to check for duplicates)
CREATE POLICY "Anyone can read used hashes"
ON used_transaction_hashes FOR SELECT
TO authenticated
USING (true);

-- Policy: Only service role can insert
CREATE POLICY "Service role can insert used hashes"
ON used_transaction_hashes FOR INSERT
TO service_role
WITH CHECK (true);

-- Migrate existing transaction hashes from credit_transactions
INSERT INTO used_transaction_hashes (transaction_hash, network, first_used_by, first_used_at)
SELECT DISTINCT
  (description::jsonb->>'transactionHash')::text as transaction_hash,
  COALESCE((description::jsonb->>'network')::text, 'base') as network,
  user_id as first_used_by,
  created_at as first_used_at
FROM credit_transactions
WHERE type = 'purchase'
  AND description IS NOT NULL
  AND description::jsonb->>'transactionHash' IS NOT NULL
ON CONFLICT (transaction_hash) DO NOTHING;

-- Verify migration
SELECT 
  COUNT(*) as total_blacklisted_hashes,
  COUNT(DISTINCT network) as networks_count
FROM used_transaction_hashes;
