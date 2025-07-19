import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-effect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="hover:scale-105 transition-transform duration-200">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/cart" className="relative group">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce-gentle"
                      >
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>
                
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-primary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};