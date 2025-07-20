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
    <Card className="group hover-scale overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-soft transition-all duration-300 hover:shadow-elegant">
      <CardContent className="p-0">
        <Link to={`/product/${id}`} className="block">
          <div className="relative overflow-hidden">
            <img
              src={displayImage || '/placeholder.svg'}
              alt={name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200",
                "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(id);
              }}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  inWishlist ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
                )} 
              />
            </Button>
          </div>
        </Link>
        
        <div className="p-4">
          <Link to={`/product/${id}`} className="story-link">
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[3rem]">
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {formatCurrency(price)}
            </span>
            {stock_quantity === 0 && (
              <span className="text-sm text-destructive font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <Button
            onClick={() => addToCart(id, 1)}
            disabled={stock_quantity === 0}
            className="w-full group/btn"
          >
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
            {stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;