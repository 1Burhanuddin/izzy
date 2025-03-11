
import React from 'react';
import { Button } from '@/components/ui/button';

interface StatusFilterProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, setSelectedStatus }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedStatus === 'all' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('all')}
        >
          All
        </Button>
        <Button 
          variant={selectedStatus === 'pending' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={selectedStatus === 'processing' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('processing')}
        >
          Processing
        </Button>
        <Button 
          variant={selectedStatus === 'shipped' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('shipped')}
        >
          Shipped
        </Button>
        <Button 
          variant={selectedStatus === 'delivered' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('delivered')}
        >
          Delivered
        </Button>
        <Button 
          variant={selectedStatus === 'cancelled' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedStatus('cancelled')}
        >
          Cancelled
        </Button>
      </div>
    </div>
  );
};

export default StatusFilter;
