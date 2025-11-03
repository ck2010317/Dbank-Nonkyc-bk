-- Create payment_transactions table to track USDT/USDC payments
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_hash TEXT UNIQUE NOT NULL, -- Prevents duplicate submissions
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL, -- 'USDT' or 'USDC'
  network TEXT NOT NULL, -- 'ETH', 'BSC', 'POLYGON', etc.
  credits_added INTEGER NOT NULL,
  status TEXT DEFAULT 'verified', -- 'pending', 'verified', 'rejected'
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own payment transactions
CREATE POLICY "Users can read own payment transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_hash ON public.payment_transactions(transaction_hash);

-- Add comment
COMMENT ON TABLE public.payment_transactions IS 'Tracks USDT/USDC payment transactions with duplicate prevention';
