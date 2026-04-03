import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5 leading-none">
        {label && (
          <label className="text-sm font-medium text-foreground opacity-90 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-2xl border border-input bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
              error && 'border-danger focus-visible:ring-danger',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/50">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
