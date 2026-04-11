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
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="flex w-full flex-col gap-1 tracking-tight">
        {label && (
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <div className={cn(
            "absolute inset-0 bg-primary/5 blur-xl rounded-xl transition-opacity duration-500 pointer-events-none",
            isFocused ? "opacity-100" : "opacity-0"
          )} />
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'flex h-10 w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium placeholder:text-foreground/10 focus-visible:outline-none focus-visible:border-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
              error && 'border-rose-500/50 focus-visible:border-rose-500',
              icon && 'pl-9',
              className
            )}
            {...props}
          />
          {icon && (
            <div className={cn(
              "absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/20 transition-colors duration-300",
              isFocused && "text-primary"
            )}>
              {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 })}
            </div>
          )}
        </div>
        {error && <span className="text-[10px] font-bold text-rose-500/80 ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
