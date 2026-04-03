import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Badge } from './Badge';

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
        'group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 outline-none h-11',
        active
          ? 'bg-primary text-white shadow-md'
          : 'text-foreground/70 hover:bg-surface hover:text-foreground',
        className
      )}
      {...props}
    >
      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
        {indicator && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2',
              active ? 'ring-primary' : 'ring-background',
              {
                'bg-accent': indicator === 'online',
                'bg-danger': indicator === 'busy',
                'bg-yellow-500': indicator === 'away',
                'bg-foreground/20': indicator === 'offline',
              }
            )}
          />
        )}
      </div>
      <span className="flex-grow text-left truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <Badge
          count={count}
          variant={active ? 'default' : 'primary'}
          className={cn(active ? 'bg-white/20 text-white' : '')}
        />
      )}
    </button>
  );
};
