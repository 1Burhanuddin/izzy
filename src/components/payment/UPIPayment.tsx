
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
  amount?: number; // Add amount as optional prop
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ upiId, setUpiId, amount = 0 }) => {
  const [copied, setCopied] = useState(false);
  const merchantUpiId = "111burhanuddin@okicici";
  
  const validateUpiId = (id: string) => {
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  useEffect(() => {
    // Set a timeout to reset the copied state after 2 seconds
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
    // Improved UPI URL format with better compatibility
    // Using a simpler format that is more widely supported
    const amountStr = amount > 0 ? `&am=${amount.toFixed(2)}` : '';
    const merchantName = encodeURIComponent("Merchant");
    
    // Standard UPI payment URL with minimal parameters
    const upiUrl = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${merchantName}&cu=INR${amountStr}`;
    
    console.log(`Opening ${app} with URL:`, upiUrl);
    
    try {
      window.location.href = upiUrl;
      toast.info(`Redirecting to ${app}. If it doesn't open automatically, use the UPI ID to manually pay`);
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
      <div className="mb-4">
        <Label htmlFor="upi-id">Your UPI ID (Optional)</Label>
        <div className="flex mt-1">
          <Input
            id="upi-id"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="flex-grow"
          />
        </div>
        {upiId && !validateUpiId(upiId) && (
          <p className="text-sm text-red-500 mt-1">
            Please enter a valid UPI ID (e.g., yourname@ybl)
          </p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mt-6 border rounded-lg p-6 bg-gray-50">
        <div className="text-center w-full">
{/*           <div className="bg-white p-3 rounded-lg inline-block mb-3">
            <QrCode className="h-24 w-24 text-gray-800" />
          </div> */}
          <p className="font-semibold text-gray-800 mb-2">Pay to: {merchantUpiId}</p>
          {amount > 0 && (
            <p className="font-bold text-lg text-green-600 mb-2">Amount: ₹{amount.toFixed(2)}</p>
          )}
          <div className="flex justify-center mb-4">
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
              className="flex items-center gap-1 ml-2"
              onClick={sharePaymentDetails}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          
          <Tabs defaultValue="gpay" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="gpay">Google Pay</TabsTrigger>
              <TabsTrigger value="phonepe">PhonePe</TabsTrigger>
              <TabsTrigger value="paytm">Paytm</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="gpay" className="mt-0">
              <Button 
                className="bg-white border hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 mb-3"
                onClick={() => openUPIApp('Google Pay')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-5" />
                Pay with Google Pay
              </Button>
            </TabsContent>
            <TabsContent value="phonepe" className="mt-0">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 mb-3"
                onClick={() => openUPIApp('PhonePe')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5" />
                Pay with PhonePe
              </Button>
            </TabsContent>
            <TabsContent value="paytm" className="mt-0">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 mb-3"
                onClick={() => openUPIApp('Paytm')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5" />
                Pay with Paytm
              </Button>
            </TabsContent>
            <TabsContent value="other" className="mt-0">
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 mb-3"
                onClick={() => openUPIApp('UPI app')}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-5" />
                Open Any UPI App
              </Button>
            </TabsContent>
          </Tabs>
          
          <p className="text-sm text-gray-600 mt-2">
            Click any button above to pay with your preferred UPI app
          </p>
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
