import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { User } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', isOnline, className, ...props }) => {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 22,
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5 right-0 bottom-0 ring-1 ring-bg-main',
    sm: 'h-2 w-2 right-0 bottom-0 ring-2 ring-bg-main',
    md: 'h-3 w-3 right-0 bottom-0 ring-2 ring-bg-main',
    lg: 'h-3.5 w-3.5 right-0.5 bottom-0.5 ring-2 ring-bg-main',
  };

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null;

  return (
    <div className={cn('relative inline-block rounded-2xl', className)} {...props}>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.05] text-foreground/40 font-semibold',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : initials ? (
          <span>{initials.slice(0, 2)}</span>
        ) : (
          <User size={iconSizes[size]} />
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-bg-main',
            isOnline ? 'bg-accent' : 'bg-foreground/20',
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
