import { create } from 'zustand';
import { FormData } from '@shared/schema';

interface FormStore {
  formData: Partial<FormData>;
  currentStep: number;
  isEnglish: boolean;
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  toggleLanguage: () => void;
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formData: {},
  currentStep: 0,
  isEnglish: false,
  
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  setCurrentStep: (step) =>
    set({ currentStep: step }),
  
  toggleLanguage: () =>
    set((state) => ({ isEnglish: !state.isEnglish })),
  
  resetForm: () =>
    set({ formData: {}, currentStep: 0 }),
}));
