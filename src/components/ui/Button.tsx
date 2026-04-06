import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:opacity-90 shadow-glow-sm border border-white/10 active:scale-[0.98]',
      secondary: 'bg-white/[0.03] text-white hover:bg-white/[0.08] shadow-sm border border-white/[0.05] active:scale-[0.98]',
      ghost: 'bg-transparent text-foreground/40 hover:text-primary hover:bg-white/[0.03] active:scale-[0.98]',
      danger: 'bg-rose-500/[0.05] text-rose-500 border border-rose-500/10 hover:bg-rose-500/[0.1] active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg',
      md: 'px-4 py-2 text-[13px] font-bold tracking-tight rounded-xl',
      lg: 'px-6 py-2.5 text-[15px] font-serif italic tracking-tight rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed selection:bg-transparent',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
