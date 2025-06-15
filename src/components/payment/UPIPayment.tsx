
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
  amount?: number;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ upiId, setUpiId, amount = 0 }) => {
  const [copied, setCopied] = useState(false);
  const merchantUpiId = "111burhanuddin@okicici";
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
  };

  const openUPIApp = (app: string) => {
    // Use the most basic UPI URL format to avoid limit errors
    // Remove amount parameter as it can sometimes trigger false limit errors
    const merchantName = "Payment";
    
    // Ultra-simplified UPI URL format
    const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}`;
    
    console.log(`Opening ${app} with simplified URL:`, upiUrl);
    
    try {
      // Try to open the UPI app
      window.location.href = upiUrl;
      
      toast.success(`Opening ${app}... If it doesn't open, please copy the UPI ID and pay manually`);
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast.error('Could not open payment app. Please use the UPI ID manually.');
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

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-6 border rounded-lg p-6 bg-gray-50">
        <div className="text-center w-full">
          <p className="font-semibold text-gray-800 mb-2">Pay to: {merchantUpiId}</p>
          {amount > 0 && (
            <p className="font-bold text-lg text-green-600 mb-4">Amount: ₹{amount.toFixed(2)}</p>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> If you see "limit exceeded" error, it's usually a false alert. 
              Try copying the UPI ID and paying manually through your UPI app.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={copyUpiId}
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={sharePaymentDetails}
            >
              <Share2 className="h-4 w-4" />
              Share Details
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="bg-white border hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('Google Pay')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-5" />
              Try Google Pay
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('PhonePe')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5" />
              Try PhonePe
            </Button>
            
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
              onClick={() => openUPIApp('Paytm')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5" />
              Try Paytm
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <p className="text-sm text-blue-700">
              <strong>Recommended:</strong> Copy the UPI ID above and open any UPI app manually. 
              This avoids any "limit exceeded" errors that can happen with automatic app opening.
            </p>
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
