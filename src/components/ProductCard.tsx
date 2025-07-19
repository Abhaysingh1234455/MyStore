import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  return (
    <div className="animate-fade-in">
      <Card className="group cursor-pointer overflow-hidden card-hover border-0 shadow-md hover:shadow-primary/20">
        <Link to={`/product/${product.id}`}>
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 left-2 animate-bounce-gentle"
                >
                  Only {product.stock_quantity} left!
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">4.5</span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-primary currency-inr">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                
                {product.stock_quantity > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {product.stock_quantity} in stock
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-primary hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            size="lg"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};