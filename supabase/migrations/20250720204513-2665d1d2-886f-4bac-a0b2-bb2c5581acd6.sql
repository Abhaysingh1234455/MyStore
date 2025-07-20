-- Create trigger to automatically update product stock when order items are inserted
CREATE OR REPLACE FUNCTION update_product_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product stock quantity by reducing it
  UPDATE public.products 
  SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS update_stock_on_order_item_insert ON public.order_items;
CREATE TRIGGER update_stock_on_order_item_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock_on_order();