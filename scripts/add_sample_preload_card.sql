-- Add the sample preload card to inventory
-- This card will be publicly visible (except CVV) until purchased

-- Updated column names to match SQL schema: card_holder -> cardholder_name, price_usd -> price, zeroid_card_id -> card_id
INSERT INTO preload_cards (
  card_id,
  card_number,
  cardholder_name,
  expiry_date,
  cvv,
  balance,
  price,
  status
) VALUES (
  'sample-card-001', -- Placeholder ZeroID card ID
  '5258470485928918', -- Card number (no spaces for storage)
  'SP1760873669534',
  '09/27',
  '669',
  13.55,
  30.00,
  'available'
)
ON CONFLICT (card_id) DO NOTHING;

-- Verify the card was added
SELECT 
  id,
  card_number,
  cardholder_name,
  balance,
  price,
  status,
  created_at
FROM preload_cards
WHERE status = 'available';
