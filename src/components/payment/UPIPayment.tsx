
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
  amount: number;
  onPaymentComplete: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ upiId, setUpiId, amount, onPaymentComplete }) => {
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

  const openGooglePay = () => {
    // Format amount with 2 decimal places
    const formattedAmount = amount.toFixed(2);
    
    // Create Google Pay deep link with amount
    const googlePayDeepLink = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=Merchant&am=${formattedAmount}&cu=INR`;
    window.location.href = googlePayDeepLink;
    
    // Set timeout to simulate payment completion (in real app, you'd use webhook)
    setTimeout(() => {
      handlePaymentComplete();
    }, 5000);
    
    // Fallback for desktop
    toast.info('Redirecting to Google Pay, or use the UPI ID to manually pay');
  };
  
  const handlePaymentComplete = () => {
    toast.success('Payment completed successfully!');
    onPaymentComplete();
  };

  const handleManualConfirm = () => {
    toast.success('Payment confirmed manually');
    onPaymentComplete();
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
        <div className="text-center">
          <div className="bg-white p-3 rounded-lg inline-block mb-3">
            <QrCode className="h-24 w-24 text-gray-800" />
          </div>
          <p className="font-semibold text-gray-800 mb-2">Pay to: {merchantUpiId}</p>
          <p className="font-medium text-gray-800 mb-3">Amount: ₹{amount.toFixed(2)}</p>
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
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 mb-3"
            onClick={openGooglePay}
          >
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-5" />
            Pay with Google Pay
          </Button>
          <Button 
            variant="outline"
            className="w-full mb-3"
            onClick={handleManualConfirm}
          >
            I've Completed the Payment
          </Button>
          <p className="text-sm text-gray-600">
            Pay using Google Pay or scan the QR code with any UPI app
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
