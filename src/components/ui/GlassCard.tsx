
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  intensity = 'medium',
}) => {
  const intensityStyles = {
    light: 'bg-white/10 backdrop-blur-sm',
    medium: 'bg-white/20 backdrop-blur-md',
    heavy: 'bg-white/30 backdrop-blur-lg',
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:shadow-xl',
        intensityStyles[intensity],
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
