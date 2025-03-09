
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode } from 'lucide-react';

interface UPIPaymentProps {
  upiId: string;
  setUpiId: (value: string) => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ upiId, setUpiId }) => {
  const validateUpiId = (id: string) => {
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="upi-id">UPI ID</Label>
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

      <div className="flex items-center justify-center mt-6 border rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <div className="bg-white p-3 rounded-lg inline-block mb-3">
            <QrCode className="h-24 w-24 text-gray-800" />
          </div>
          <p className="text-sm text-gray-600">
            Scan the QR code with your UPI app or enter your UPI ID above
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
