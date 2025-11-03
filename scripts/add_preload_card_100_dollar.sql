-- Add $100 preload card with $67.35 balance
-- Card number: 4549240550114716
-- Expiry: 11/29
-- CVV: 982
-- Balance: $67.35
-- Price: $100 (covers card creation fee)

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
  'preload-card-100-001',
  '4549240550114716',
  'CARD HOLDER',
  '11/29',
  '982',
  67.35,
  100.00,
  'available'
)
ON CONFLICT (card_id) DO NOTHING;

-- Verify the card was added
SELECT 
  id,
  card_id,
  -- Only show last 4 digits for security
  '****' || RIGHT(card_number, 4) as card_last4,
  balance,
  price,
  status,
  created_at
FROM preload_cards
WHERE card_id = 'preload-card-100-001';
