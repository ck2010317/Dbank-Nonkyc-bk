-- Create table for tracking card top-up payment requests
CREATE TABLE IF NOT EXISTS public.card_topup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  network TEXT NOT NULL,
  transaction_hash TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_card_topup_requests_user_id ON public.card_topup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_card_topup_requests_card_id ON public.card_topup_requests(card_id);
CREATE INDEX IF NOT EXISTS idx_card_topup_requests_transaction_hash ON public.card_topup_requests(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_card_topup_requests_status ON public.card_topup_requests(status);

-- Enable Row Level Security
ALTER TABLE public.card_topup_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own top-up requests
CREATE POLICY "Users can view own topup requests"
  ON public.card_topup_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own top-up requests
CREATE POLICY "Users can create own topup requests"
  ON public.card_topup_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
