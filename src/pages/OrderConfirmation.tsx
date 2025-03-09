
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We've received your payment and are processing your order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/" className="inline-flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button asChild className="w-full sm:w-auto">
              <Link to="/account" className="inline-flex items-center">
                <Package className="mr-2 h-4 w-4" />
                View Your Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
