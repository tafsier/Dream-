
    import { submitDream } from '@/components/dream/SubmitDreamActions.js';
    
    export const useSubmitDreamHandler = (
      formData,
      setFormData,
      setCharCount,
      setErrors,
      setIsSubmitting,
      user,
      profile,
      fetchProfile,
      toast,
      navigate,
      validateForm,
      remainingInterpretations,
      t
    ) => {
      const handleSubmitDream = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
          toast({
            title: t('submitDream.toast.validationErrorTitle'),
            description: t('submitDream.toast.validationErrorDesc'),
            variant: 'destructive',
          });
          return;
        }
    
        if (!user || !profile) {
          toast({
            title: t('errorToastTitle'),
            description: t('submitDream.toast.notLoggedIn'),
            variant: 'destructive',
          });
          return;
        }
        
        if (typeof remainingInterpretations === 'number' && remainingInterpretations <= 0) {
            toast({
                title: t('submitDream.toast.noCreditsTitle'),
                description: t('submitDream.toast.noCreditsDesc'),
                variant: "destructive",
            });
            return;
        }
    
        setIsSubmitting(true);
        try {
          const submissionData = {
            full_name: profile.full_name || user.email.split('@')[0],
            age: parseInt(formData.age, 10),
            gender: formData.gender,
            maritalStatus: formData.marital_status,
            dreamText: formData.dream_text,
          };
          
          const result = await submitDream(submissionData, user, profile, fetchProfile, toast);
          
          if (result.success) {
            setFormData({ dream_text: '', age: '', gender: '', marital_status: '' });
            setCharCount(0);
            setErrors({});
            if (typeof fetchProfile === 'function') {
              await fetchProfile(user.id, user.email, user); 
            }
            toast({
                title: t('submitDream.toast.successTitle'),
                description: t('submitDream.toast.successDesc'),
                variant: "success",
            });
            navigate('/dashboard?tab=dreams');
          } else {
             toast({
                title: t('errorToastTitle'),
                description: result.message || t('submitDream.toast.genericError'),
                variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error in handleSubmitDream:", error);
          toast({
            title: t('errorToastTitle'),
            description: t('submitDream.toast.unexpectedError'),
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      };
    
      return { handleSubmitDream };
    };
  