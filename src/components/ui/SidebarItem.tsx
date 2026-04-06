import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  count?: number;
  indicator?: 'online' | 'offline' | 'busy' | 'away' | null;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  count,
  indicator,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 outline-none h-9 relative overflow-hidden',
        active
          ? 'bg-primary/10 text-primary shadow-glow-sm'
          : 'text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/70',
        className
      )}
      {...props}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
      )}

      <div className={cn(
        'relative flex h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 items-center justify-center',
        active ? 'text-primary' : 'text-foreground/20 group-hover:text-primary/60'
      )}>
        {icon}
      </div>

      <span className={cn(
        'flex-grow text-left truncate transition-colors',
        active ? 'font-semibold' : ''
      )}>
        {label}
      </span>

      {count !== undefined && count > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold min-w-[18px] text-center shadow-glow-sm">
          {count}
        </span>
      )}

      {indicator && (
        <div className={cn(
          'w-1.5 h-1.5 rounded-full border border-bg-deep shrink-0',
          {
            'bg-accent': indicator === 'online',
            'bg-danger': indicator === 'busy',
            'bg-amber-500': indicator === 'away',
            'bg-white/10': indicator === 'offline',
          }
        )} />
      )}
    </button>
  );
};
