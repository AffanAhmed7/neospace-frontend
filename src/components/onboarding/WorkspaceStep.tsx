import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Upload, X, Building2 } from 'lucide-react';

export const WorkspaceStep: React.FC = () => {
  const { workspace, updateWorkspace, nextStep, prevStep } = useOnboardingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(workspace.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        updateWorkspace({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setPreview(null);
    updateWorkspace({ avatar: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col space-y-8 w-full max-w-md mx-auto"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Create your workspace</h2>
        <p className="text-foreground/60 text-sm">
          Give your space a name and a personality.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-3xl bg-surface border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-all duration-200 group overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center space-y-1 text-foreground/40 group-hover:text-primary">
                <Upload className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold">Upload</span>
              </div>
            )}
          </div>
          {preview && (
            <button 
              onClick={(e) => { e.stopPropagation(); clearAvatar(); }}
              className="absolute -top-2 -right-2 p-1.5 bg-danger text-white rounded-full shadow-lg scale-90 hover:scale-100 transition-transform duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      <Input
        label="Workspace Name"
        placeholder="e.g. Acme Corp"
        value={workspace.name}
        onChange={(e) => updateWorkspace({ name: e.target.value })}
        icon={<Building2 className="w-4 h-4" />}
      />

      <div className="flex items-center gap-3 pt-4">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="flex-1 opacity-60 hover:opacity-100"
        >
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="flex-1"
          disabled={!workspace.name}
        >
          {workspace.name ? 'Continue' : 'Skip'}
        </Button>
      </div>
    </motion.div>
  );
};
