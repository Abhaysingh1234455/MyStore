import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/currency';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your wishlist
        </p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Start adding items you love to your wishlist
        </p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Heart className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <span className="ml-2 text-muted-foreground">
          ({wishlistItems.length} items)
        </span>
      </div>

      <div className="grid gap-4 md:gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="hover-scale transition-all duration-300 hover:shadow-elegant">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.products.images?.[0] || '/placeholder.svg'}
                    alt={item.products.name}
                    className="w-full md:w-24 h-48 md:h-24 object-cover rounded-lg bg-gradient-subtle"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${item.products.id}`}
                    className="story-link"
                  >
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {item.products.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {formatCurrency(item.products.price)}
                    </span>
                    {item.products.stock_quantity === 0 && (
                      <span className="text-sm text-destructive font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => addToCart(item.products.id, 1)}
                      disabled={item.products.stock_quantity === 0}
                      className="flex-1 sm:flex-none"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.products.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link to="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Wishlist;