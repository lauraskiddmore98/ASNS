import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFormStore } from './use-form-store';
import { supabase } from '@/lib/supabase';
import { FormData } from '@shared/schema';

export const useFormSync = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formData, updateFormData } = useFormStore();

  // Sync form data to URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          // Handle array values (like accountTypes or missingData)
          value.forEach(v => params.append(key + '[]', v));
        } else if (typeof value === 'boolean') {
          // Handle boolean values
          params.set(key, value.toString());
        } else {
          // Handle string values
          params.set(key, value as string);
        }
      }
    });
    
    // Update URL without triggering navigation
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', newUrl);
  }, [formData]);

  // Load form data from URL parameters on initial load
  useEffect(() => {
    const formDataFromUrl: Partial<FormData> = {};
    
    searchParams.forEach((value, key) => {
      const arrayMatch = key.match(/^(.+)\[\]$/);
      if (arrayMatch) {
        // Handle array parameters
        const actualKey = arrayMatch[1] as keyof FormData;
        if (!formDataFromUrl[actualKey]) {
          formDataFromUrl[actualKey] = [];
        }
        (formDataFromUrl[actualKey] as string[]).push(value);
      } else {
        // Handle regular parameters
        formDataFromUrl[key as keyof FormData] = 
          value === 'true' ? true :
          value === 'false' ? false :
          value;
      }
    });

    if (Object.keys(formDataFromUrl).length > 0) {
      updateFormData(formDataFromUrl);
    }
  }, []);

  // Save form data to Supabase
  const saveToSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('reidentification_submissions')
        .insert([
          {
            submissionData: formData,
            emailSent: 'false'
          }
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving form data:', error);
      throw error;
    }
  };

  return { saveToSupabase };
};