-- Add cancel order functionality
-- Create a function to cancel orders
CREATE OR REPLACE FUNCTION public.cancel_order(order_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_status TEXT;
BEGIN
  -- Get current order status
  SELECT status INTO current_status
  FROM public.orders
  WHERE id = order_id_param AND user_id = auth.uid();
  
  -- Check if order exists and belongs to user
  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Order not found or access denied';
  END IF;
  
  -- Check if order can be cancelled
  IF current_status IN ('shipped', 'out_for_delivery', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Order cannot be cancelled. Current status: %', current_status;
  END IF;
  
  -- Update order status to cancelled
  UPDATE public.orders
  SET status = 'cancelled', updated_at = now()
  WHERE id = order_id_param AND user_id = auth.uid();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cancel_order(UUID) TO authenticated;