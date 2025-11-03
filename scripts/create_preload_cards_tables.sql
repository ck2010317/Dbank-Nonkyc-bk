-- Create preload cards inventory table
CREATE TABLE IF NOT EXISTS preload_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL UNIQUE,
  card_number TEXT NOT NULL,
  cardholder_name TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  balance NUMERIC(10, 2) NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create preload card purchases table
CREATE TABLE IF NOT EXISTS preload_card_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preload_card_id UUID NOT NULL REFERENCES preload_cards(id) ON DELETE CASCADE,
  buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL UNIQUE,
  amount_paid NUMERIC(10, 2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(preload_card_id, buyer_user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_preload_cards_status ON preload_cards(status);
CREATE INDEX IF NOT EXISTS idx_preload_card_purchases_buyer ON preload_card_purchases(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_preload_card_purchases_hash ON preload_card_purchases(transaction_hash);

-- Enable RLS
ALTER TABLE preload_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE preload_card_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for preload_cards
-- Anyone can view available cards (but sensitive data filtered in API)
CREATE POLICY "Anyone can view available preload cards"
ON preload_cards FOR SELECT
TO authenticated
USING (status = 'available');

-- Only service role can insert/update/delete
CREATE POLICY "Service role can manage preload cards"
ON preload_cards FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for preload_card_purchases
-- Users can only view their own purchases
CREATE POLICY "Users can view their own purchases"
ON preload_card_purchases FOR SELECT
TO authenticated
USING (buyer_user_id = auth.uid());

-- Service role can manage all purchases
CREATE POLICY "Service role can manage purchases"
ON preload_card_purchases FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add transaction hash to the blacklist when a preload card is purchased
-- This ensures the same transaction hash cannot be used for credit purchases or other preload cards
