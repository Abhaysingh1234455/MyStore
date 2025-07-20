import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RotateCcw,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    user_name: 'Rajesh Kumar',
    rating: 5,
    comment: 'Excellent product! Quality is amazing and delivery was super fast. Highly recommended!',
    date: '2024-07-15',
    verified: true
  },
  {
    id: '2',
    user_name: 'Priya Sharma',
    rating: 4,
    comment: 'Good value for money. The product matches the description perfectly.',
    date: '2024-07-10',
    verified: true
  },
  {
    id: '3',
    user_name: 'Amit Singh',
    rating: 5,
    comment: 'Outstanding quality and great customer service. Will definitely buy again!',
    date: '2024-07-05',
    verified: false
  },
  {
    id: '4',
    user_name: 'Neha Gupta',
    rating: 4,
    comment: 'Very satisfied with the purchase. Fast shipping and well-packaged.',
    date: '2024-06-28',
    verified: true
  }
];

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishListed, setIsWishListed] = useState(false);

  // Generate multiple product images
  const getProductImages = (baseImageUrl: string) => {
    return [
      baseImageUrl,
      baseImageUrl.replace('.jpg', '_2.jpg'),
      baseImageUrl.replace('.jpg', '_3.jpg'),
      baseImageUrl.replace('.jpg', '_4.jpg')
    ];
  };

  const calculateAverageRating = () => {
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / mockReviews.length).toFixed(1);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock_quantity === 0) return;
    
    addToCart(product.id);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const toggleWishlist = () => {
    setIsWishListed(!isWishListed);
    toast({
      title: isWishListed ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishListed 
        ? "Item removed from your wishlist" 
        : "Item added to your wishlist",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-xl"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const productImages = getProductImages(product.image_url);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-0 h-auto hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = product.image_url;
                  }}
                />
              </div>
              
              {/* Image Navigation */}
              <button
                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                disabled={selectedImageIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                disabled={selectedImageIndex === productImages.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-primary shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = product.image_url;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category.toUpperCase()}
              </Badge>
              <h1 className="text-4xl font-bold mb-4 leading-tight">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                {renderStars(Number(calculateAverageRating()))}
                <span className="font-semibold">{calculateAverageRating()}</span>
                <span className="text-muted-foreground">({mockReviews.length} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-primary currency-inr">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-muted-foreground mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ In Stock ({product.stock_quantity} available)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gradient-primary hover:opacity-90 shadow-primary text-lg py-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleWishlist}
                  className="px-6 py-6"
                >
                  <Heart className={`w-5 h-5 ${isWishListed ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button variant="outline" size="lg" className="px-6 py-6">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹500</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              Customer Reviews
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(Number(calculateAverageRating()))}
                <span className="text-xl font-bold">{calculateAverageRating()}</span>
                <span className="text-muted-foreground">out of 5</span>
              </div>
              <span className="text-muted-foreground">
                Based on {mockReviews.length} reviews
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mockReviews.map((review, index) => (
              <div
                key={review.id}
                className="animate-fade-in border-b last:border-b-0 pb-6 last:pb-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{review.user_name}</h4>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          ✓ Verified Purchase
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-6">
              <Button variant="outline" size="lg">
                Load More Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};