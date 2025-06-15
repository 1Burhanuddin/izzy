
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle2, Share2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
  amount?: number;
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
    // Use the standard UPI payment URL format recommended by NPCI
    // This format is more widely supported and less likely to trigger bank limits
    const merchantName = "Merchant";
    const transactionNote = `Payment for Order`;
    
    // Use the minimal UPI URL format that's most compatible
    let upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}`;
    
    // Only add amount if it's greater than 0
    if (amount > 0) {
      upiUrl += `&am=${amount}&cu=INR`;
    }
    
    // Add transaction note
    upiUrl += `&tn=${encodeURIComponent(transactionNote)}`;
    
    console.log(`Opening ${app} with URL:`, upiUrl);
    
    try {
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = upiUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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

  const manualPaymentInstructions = () => {
    toast.info('Steps: 1) Open any UPI app 2) Select Send Money 3) Enter UPI ID: ' + merchantUpiId + ' 4) Enter amount: ₹' + amount.toFixed(2), {
      duration: 8000
    });
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
          <p className="font-semibold text-gray-800 mb-2">Pay to: {merchantUpiId}</p>
          {amount > 0 && (
            <p className="font-bold text-lg text-green-600 mb-4">Amount: ₹{amount.toFixed(2)}</p>
          )}
          
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
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={manualPaymentInstructions}
            >
              <Smartphone className="h-4 w-4" />
              Manual Steps
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
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <p className="text-sm text-blue-700">
              <strong>Having issues?</strong> Copy the UPI ID above and manually send payment through any UPI app.
              Use the "Manual Steps" button for detailed instructions.
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
