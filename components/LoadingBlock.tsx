import React from 'react';
import { IconSpiner } from '@/components/Icons';

export const LoadingBlock = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="flex items-center justify-center">
      <IconSpiner className="h-10 w-10 text-gray-500" />
    </div>
  </div>
);
