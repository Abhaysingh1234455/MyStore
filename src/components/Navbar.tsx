import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Logo } from '@/components/Logo';

const Navbar = () => {
  const { user, loading } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Logo />
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              MyStore
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/wishlist" 
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
                >
                  Wishlist
                </Link>
                <Link 
                  to="/orders" 
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
                >
                  Orders
                </Link>
                <Link 
                  to="/profile" 
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="relative group">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-pulse">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-pulse">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Desktop User menu - simplified */}
            <div className="hidden md:block">
              {!loading && !user && (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="hover-scale bg-gradient-primary">
                    Sign In
                  </Button>
                </Link>
              )}
              {user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;