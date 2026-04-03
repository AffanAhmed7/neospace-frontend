import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'danger' | 'accent' | 'primary';
  count?: number;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', count, className, children, ...props }) => {
  const variants = {
    default: 'bg-surface text-foreground',
    outline: 'border border-border text-foreground',
    danger: 'bg-danger text-white',
    accent: 'bg-accent text-white',
    primary: 'bg-primary text-white',
  };

  const displayCount = count !== undefined && count > 99 ? '99+' : count;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-200',
        count !== undefined && 'h-5 min-w-5 shrink-0 px-1',
        variants[variant],
        className
      )}
      {...props}
    >
      {count !== undefined ? displayCount : children}
    </span>
  );
};
