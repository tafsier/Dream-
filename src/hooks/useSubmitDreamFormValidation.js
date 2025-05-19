
    import { useCallback } from 'react';
    
    export const useSubmitDreamFormValidation = (formData, characterLimit, t, setErrors) => {
      const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.dream_text.trim()) newErrors.dream_text = t('submitDream.validation.dreamTextRequired');
        if (formData.dream_text.length > characterLimit) newErrors.dream_text = t('submitDream.validation.dreamTextTooLong', { limit: characterLimit });
        if (!formData.age) newErrors.age = t('submitDream.validation.ageRequired');
        else if (isNaN(formData.age) || parseInt(formData.age, 10) <= 0 || parseInt(formData.age, 10) > 120) newErrors.age = t('submitDream.validation.ageInvalid');
        if (!formData.gender) newErrors.gender = t('submitDream.validation.genderRequired');
        if (!formData.marital_status) newErrors.marital_status = t('submitDream.validation.maritalStatusRequired');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }, [formData, characterLimit, t, setErrors]);
    
      return { validateForm };
    };
  