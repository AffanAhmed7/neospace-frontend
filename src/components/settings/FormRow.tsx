import React from 'react';
import { clsx } from 'clsx';

interface FormRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  align?: 'top' | 'center';
}

export const FormRow: React.FC<FormRowProps> = ({ 
  label, 
  description, 
  children, 
  align = 'center' 
}) => {
  return (
    <div className={clsx(
      "flex flex-col gap-1 md:flex-row md:items-start md:gap-6 min-h-[32px]",
      align === 'center' ? "md:items-center" : "md:items-start"
    )}>
      <div className="flex-1 space-y-0.5">
        <label className="text-[13px] font-bold text-foreground tracking-tight">{label}</label>
        {description && (
          <p className="text-[11px] text-foreground/30 leading-relaxed max-w-xs">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 w-full md:w-auto min-w-[200px]">
        {children}
      </div>
    </div>
  );
};
