import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[] | null;
  category: string;
  stock_quantity: number;
}

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(p => p.category) || [])];
      setCategories(uniqueCategories);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <Logo size="lg" className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
              Welcome to MyStore
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                4.8+ Rating
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                10k+ Happy Customers
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Find Your Perfect Product</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-primary hover:text-primary-hover"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked items just for you</p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-xl mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-muted h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or browse our categories
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-primary"
              >
                Browse All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image_url={product.image_url}
                    images={product.images}
                    stock_quantity={product.stock_quantity}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};