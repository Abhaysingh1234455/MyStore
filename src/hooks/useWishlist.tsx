import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    stock_quantity: number;
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          created_at
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Fetch product details separately
      if (data && data.length > 0) {
        const productIds = data.map(item => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, images, stock_quantity')
          .in('id', productIds);

        if (productsError) throw productsError;

        // Combine wishlist items with product details
        const wishlistWithProducts = data.map(item => ({
          ...item,
          products: products?.find(p => p.id === item.product_id) || {
            id: item.product_id,
            name: 'Unknown Product',
            price: 0,
            images: [],
            stock_quantity: 0
          }
        }));

        setWishlistItems(wishlistWithProducts);
      } else {
        setWishlistItems([]);
      }

    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) throw error;

      toast({
        title: "Added to Wishlist",
        description: "Item added to your wishlist",
      });

      fetchWishlist();
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already in Wishlist",
          description: "This item is already in your wishlist",
          variant: "destructive",
        });
      } else {
        console.error('Error adding to wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to add item to wishlist",
          variant: "destructive",
        });
      }
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Removed from Wishlist",
        description: "Item removed from your wishlist",
      });

      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    fetchWishlist,
  };
};