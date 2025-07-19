import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LiveChatBox } from '@/components/LiveChatBox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, Truck, MapPin, CheckCircle, X, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: any;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string;
    };
  }>;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getStatusProgress = (status: string) => {
  const statusIndex = statusSteps.findIndex(step => step.key === status);
  return statusIndex >= 0 ? ((statusIndex + 1) / statusSteps.length) * 100 : 25;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'shipped': return 'bg-blue-500';
    case 'out_for_delivery': return 'bg-orange-500';
    case 'delivered': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const canCancelOrder = (status: string) => {
  return ['pending', 'processing'].includes(status);
};

export const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatOrder, setActiveChatOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId);
    
    try {
      const { error } = await supabase.rpc('cancel_order', {
        order_id_param: orderId
      });

      if (error) throw error;

      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-2xl font-bold currency-inr text-primary">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(order.status)} text-white border-0`}
                      >
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      
                      {canCancelOrder(order.status) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={cancellingOrder === order.id}
                              className="text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this order? This action cannot be undone.
                                Order #{order.id.slice(0, 8)} for {formatCurrency(order.total_amount)} will be cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Order</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelOrder(order.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Yes, Cancel Order
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Order Status Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Order Status</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveChatOrder(activeChatOrder === order.id ? null : order.id)}
                    >
                      Need Help?
                    </Button>
                  </div>
                  
                  <Progress value={getStatusProgress(order.status)} className="h-2" />
                  
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = statusSteps.findIndex(s => s.key === order.status) >= index;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center space-y-1">
                          <div className={`p-2 rounded-full ${isActive ? getStatusColor(order.status) : 'bg-muted'}`}>
                            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <span className="text-xs text-center max-w-20">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Items</h3>
                  <div className="grid gap-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(Number(item.price))}
                          </p>
                        </div>
                        <p className="font-semibold currency-inr">
                          {formatCurrency(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Delivery Address</h3>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">{order.shipping_address?.fullName}</p>
                    <p className="text-sm text-muted-foreground">{formatAddress(order.shipping_address)}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_address?.phone}</p>
                  </div>
                </div>

                {/* Live Chat */}
                {activeChatOrder === order.id && (
                  <LiveChatBox 
                    orderId={order.id}
                    onClose={() => setActiveChatOrder(null)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};