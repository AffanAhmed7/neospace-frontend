import { create } from 'zustand';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface WorkspaceData {
  name: string;
  avatar: string | null;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  workspace: WorkspaceData;
  invitedEmails: string[];
  theme: 'light' | 'dark';

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateWorkspace: (data: Partial<WorkspaceData>) => void;
  addEmail: (email: string) => void;
  removeEmail: (email: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as OnboardingStep,
  workspace: {
    name: '',
    avatar: null,
  },
  invitedEmails: [],
  theme: 'dark' as const,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 5) as OnboardingStep 
  })),

  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) as OnboardingStep 
  })),

  updateWorkspace: (data) => set((state) => ({
    workspace: { ...state.workspace, ...data }
  })),

  addEmail: (email) => set((state) => {
    if (state.invitedEmails.includes(email)) return state;
    return { invitedEmails: [...state.invitedEmails, email] };
  }),

  removeEmail: (email) => set((state) => ({
    invitedEmails: state.invitedEmails.filter((e) => e !== email)
  })),

  setTheme: (theme) => set({ theme }),

  reset: () => set(initialState),
}));
