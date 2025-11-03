-- Add transaction_hash column to credit_transactions table for payment tracking
ALTER TABLE public.credit_transactions 
ADD COLUMN IF NOT EXISTS transaction_hash TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_credit_transactions_transaction_hash 
ON public.credit_transactions(transaction_hash);

-- Add network column to track which blockchain network was used
ALTER TABLE public.credit_transactions 
ADD COLUMN IF NOT EXISTS network TEXT;

COMMENT ON COLUMN public.credit_transactions.transaction_hash IS 'Blockchain transaction hash for payment verification';
COMMENT ON COLUMN public.credit_transactions.network IS 'Blockchain network (base, bsc, ethereum, polygon, tron)';
