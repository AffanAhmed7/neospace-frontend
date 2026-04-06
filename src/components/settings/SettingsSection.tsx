import React from 'react';
import { motion } from 'framer-motion';

interface SettingsSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  id, 
  title, 
  description, 
  children 
}) => {
  return (
    <motion.section
      key={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl w-full p-8 space-y-8"
    >
      <header className="space-y-1">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        {description && <p className="text-foreground/50 text-sm">{description}</p>}
      </header>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
};
