-- Add payment_method column to transactions
ALTER TABLE public.transactions 
ADD COLUMN payment_method text NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.transactions.payment_method IS 'Payment method: debito, credito, pix, dinheiro';