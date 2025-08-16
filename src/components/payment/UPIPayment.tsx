
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Share2, Clock, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
  amount?: number;
  onPaymentInitiated?: () => void;
  onPaymentTimeout?: () => void;
  orderId?: string;
  onCancel?: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ 
  upiId, 
  setUpiId, 
  amount = 0, 
  onPaymentInitiated,
  onPaymentTimeout,
  orderId,
  onCancel
}) => {
  const [copied, setCopied] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes = 180 seconds
  const merchantUpiId = "111burhanuddin@okicici";
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentInitiated && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time expired
            if (onPaymentTimeout) {
              onPaymentTimeout();
            }
            toast.error('Payment time expired. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [paymentInitiated, timeRemaining, onPaymentTimeout]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
  };

  const handleCancelOrder = () => {
    if (onCancel) {
      onCancel();
    }
    setPaymentInitiated(false);
    setTimeRemaining(180); // Reset timer
    toast.info('Order has been cancelled');
  };

  const openUPIApp = (app: string) => {
    const merchantName = "Payment";
    
    // Format amount properly to avoid bank limit errors
    // UPI implementations can be sensitive to amount formatting
    // Using a clean number without trailing zeros to avoid parsing issues
    const amountValue = Number(amount.toFixed(2));
    
    // Use properly formatted amount in the URL
    // Some UPI apps have issues with large numbers or specific formats
    // Using a simple number format helps avoid "bank limit exceeded" errors
    const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amountValue}&cu=INR&tr=${orderId || Date.now()}`;
    
    console.log(`Opening ${app} with URL:`, upiUrl);
    
    try {
      // Create a temporary link element and click it
      const link = document.createElement('a');
      link.href = upiUrl;
      link.click();
      
      // Mark payment as initiated
      setPaymentInitiated(true);
      
      // Call the callback to indicate payment was initiated
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }
      
      toast.success(`Opening ${app}... Complete payment within 3 minutes`);
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast.error('Could not open payment app. Please copy the UPI ID and pay manually.');
    }
  };

  const sharePaymentDetails = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Details',
        text: `Pay ₹${amount.toFixed(2)} to UPI ID: ${merchantUpiId}`
      })
      .then(() => toast.success('Payment details shared successfully'))
      .catch((error) => console.log('Error sharing payment details:', error));
    } else {
      copyUpiId();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-6 border rounded-lg p-6 bg-gray-50">
        <div className="text-center w-full">
          <p className="font-semibold text-gray-800 mb-2">Pay to: {merchantUpiId}</p>
          {amount > 0 && (
            <p className="font-bold text-lg text-green-600 mb-4">Amount: ₹{amount.toFixed(2)}</p>
          )}
          
          {paymentInitiated && timeRemaining > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <div className="flex items-center justify-center text-yellow-700 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  Time remaining: {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-xs text-yellow-600 mb-3">
                Complete your payment within this time. We are automatically checking for payment confirmation.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelOrder}
                className="w-full flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel Order
              </Button>
            </div>
          )}

          {timeRemaining === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-center justify-center text-red-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Payment time expired</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Please refresh the page and try again.
              </p>
            </div>
          )}

          {!paymentInitiated && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Instructions:</strong> Click on your preferred UPI app below to make the payment. 
                We will automatically detect when your payment is completed.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={copyUpiId}
              disabled={timeRemaining === 0}
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={sharePaymentDetails}
              disabled={timeRemaining === 0}
            >
              <Share2 className="h-4 w-4" />
              Share Details
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="bg-white border hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('Google Pay')}
              disabled={paymentInitiated || timeRemaining === 0}
            >
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-5" />
              Pay with Google Pay
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('PhonePe')}
              disabled={paymentInitiated || timeRemaining === 0}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5" />
              Pay with PhonePe
            </Button>
            
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('Paytm')}
              disabled={paymentInitiated || timeRemaining === 0}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5" />
              Pay with Paytm
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-8" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-8" />
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-8" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-8" />
      </div>
    </div>
  );
};

export default UPIPayment;
