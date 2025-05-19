
    import { useState, useCallback } from 'react';
    
    export const useSubmitDreamFormState = () => {
      const [formData, setFormData] = useState({
        dream_text: '',
        age: '',
        gender: '',
        marital_status: '',
      });
      const [errors, setErrors] = useState({});
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [charCount, setCharCount] = useState(0);
    
      const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'dream_text') {
          setCharCount(value.length);
        }
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      }, [errors]);
    
      const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      }, [errors]);
    
      return {
        formData,
        setFormData,
        errors,
        setErrors,
        isSubmitting,
        setIsSubmitting,
        charCount,
        setCharCount,
        handleChange,
        handleSelectChange,
      };
    };
  