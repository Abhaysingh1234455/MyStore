-- Add wishlist table for users
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist table
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist
CREATE POLICY "Users can view their own wishlist" 
ON public.wishlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
ON public.wishlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" 
ON public.wishlist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add images array to products table (replacing single image_url)
ALTER TABLE public.products 
ADD COLUMN images TEXT[] DEFAULT ARRAY[image_url, image_url, image_url, image_url];

-- Update existing products to have 4 images (using variations of existing image)
UPDATE public.products 
SET images = ARRAY[
  image_url,
  CASE WHEN image_url IS NOT NULL THEN REPLACE(image_url, '.jpg', '_2.jpg') ELSE NULL END,
  CASE WHEN image_url IS NOT NULL THEN REPLACE(image_url, '.jpg', '_3.jpg') ELSE NULL END,
  CASE WHEN image_url IS NOT NULL THEN REPLACE(image_url, '.jpg', '_4.jpg') ELSE NULL END
]
WHERE image_url IS NOT NULL;