import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/currency';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  images?: string[] | null;
  stock_quantity: number | null;
}

const ProductCard = ({ id, name, price, image_url, images, stock_quantity }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const displayImage = images?.[0] || image_url;
  const inWishlist = isInWishlist(id);

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-0 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
      <CardContent className="p-0">
        <Link to={`/product/${id}`} className="block">
          <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
            <img
              src={displayImage || '/placeholder.svg'}
              alt={name}
              className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Stock badge */}
            {stock_quantity !== null && stock_quantity <= 5 && stock_quantity > 0 && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                Only {stock_quantity} left!
              </div>
            )}
            
            {stock_quantity === 0 && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </div>
            )}
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300",
                "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(id);
              }}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  inWishlist 
                    ? "fill-red-500 text-red-500 scale-110" 
                    : "text-gray-600 hover:text-red-500 hover:scale-110"
                )} 
              />
            </Button>
          </div>
        </Link>
        
        <div className="p-5">
          <Link to={`/product/${id}`} className="block group-hover:scale-[1.02] transition-transform duration-300">
            <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="product-price text-3xl font-black">
                {formatCurrency(price)}
              </span>
              {stock_quantity !== null && stock_quantity > 0 && (
                <span className="text-sm text-muted-foreground/80 mt-1 font-medium">
                  📦 {stock_quantity} in stock
                </span>
              )}
            </div>
            {stock_quantity === 0 && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800">
                <span className="text-xs font-bold">❌ Out of Stock</span>
              </div>
            )}
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              addToCart(id, 1);
            }}
            disabled={stock_quantity === 0}
            className="w-full bg-gradient-primary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group/btn disabled:opacity-50"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-12" />
            {stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;