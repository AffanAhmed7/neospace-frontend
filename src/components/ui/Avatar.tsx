import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', isOnline, className, ...props }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const statusSizes = {
    sm: 'h-2 w-2 right-0 bottom-0 ring-2 ring-background',
    md: 'h-3 w-3 right-0 bottom-0 ring-2 ring-background',
    lg: 'h-3.5 w-3.5 right-0.5 bottom-0.5 ring-2 ring-background',
  };

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl overflow-hidden bg-primary text-white font-semibold',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{initials.slice(0, 2)}</span>
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-background',
            isOnline ? 'bg-accent' : 'bg-foreground/20',
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
