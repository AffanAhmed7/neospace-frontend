import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'circle' | 'rectangle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'rectangle', className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-foreground/10',
        {
          'rounded-full': variant === 'circle',
          'rounded-2xl': variant === 'rectangle',
          'rounded h-4 w-full': variant === 'text',
        },
        className
      )}
      {...props}
    />
  );
};

export const MessageSkeleton = () => (
  <div className="flex gap-3 px-4 py-3">
    <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center gap-2">
        <Skeleton variant="text" className="w-24 h-4" />
        <Skeleton variant="text" className="w-12 h-3" />
      </div>
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-3/4 h-4" />
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="flex flex-col gap-4 px-3 py-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 h-11 px-3">
        <Skeleton variant="circle" className="h-5 w-5 shrink-0" />
        <Skeleton variant="text" className="flex-grow h-4" />
      </div>
    ))}
  </div>
);
