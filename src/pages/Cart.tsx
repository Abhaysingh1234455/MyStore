import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/currency';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your cart</p>
        <Link to="/auth">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-primary shadow-primary">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Badge variant="secondary" className="ml-2">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden animate-fade-in card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">{item.products.name}</h3>
                    <p className="text-muted-foreground currency-inr">
                      {formatCurrency(item.products.price)} per item
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 text-center">
                      <span className="text-lg font-semibold">{item.quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[120px]">
                    <p className="text-xl font-bold currency-inr text-primary">
                      {formatCurrency(item.products.price * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-0">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium currency-inr">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Free
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary currency-inr">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <Link to="/place-order" className="block">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-all shadow-primary hover:shadow-lg hover:scale-[1.02]"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};