-- Update orders table to include more status options
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'));