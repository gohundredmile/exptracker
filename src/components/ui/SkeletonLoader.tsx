import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', rounded = false }) => (
  <div
    className={`
      animate-pulse bg-gray-200 dark:bg-gray-700
      ${rounded ? 'rounded-full' : 'rounded-lg'}
      ${className}
    `}
  />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-32" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const SkeletonTransactionItem: React.FC = () => (
  <div className="flex items-center gap-3 p-3">
    <Skeleton className="w-11 h-11" rounded />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-1">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonTransactionItem key={i} />
    ))}
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="h-48 bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
    <Skeleton className="h-4 w-28 mb-4" />
    <div className="flex items-end gap-2 h-32">
      {[80, 45, 65, 30, 75, 50, 90].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-t-lg"
          style={{ height: `${h}%` } as React.CSSProperties}
        />
      ))}
    </div>
  </div>
);

export const SkeletonBudgetItem: React.FC = () => (
  <div className="space-y-2 p-3">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8" rounded />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);
