
-- First, drop the existing foreign key constraint
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;
