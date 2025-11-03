-- Add 'card_topup' to the allowed transaction types
ALTER TABLE public.credit_transactions 
DROP CONSTRAINT IF EXISTS credit_transactions_type_check;

ALTER TABLE public.credit_transactions 
ADD CONSTRAINT credit_transactions_type_check 
CHECK (type IN ('purchase', 'card_creation', 'card_topup', 'refund', 'admin_adjustment'));
