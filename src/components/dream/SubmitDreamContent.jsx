
    import React, { useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast';
    import SubmitDreamForm from '@/components/dream/SubmitDreamForm.jsx';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
    import { Info, Loader2 } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    import { useNavigate } from 'react-router-dom';
    import SubmitDreamGuidelines from '@/components/dream/SubmitDreamGuidelines';
    import { useSubmitDreamFormState } from '@/hooks/useSubmitDreamFormState';
    import { useSubmitDreamFormValidation } from '@/hooks/useSubmitDreamFormValidation';
    import { useSubmitDreamHandler } from '@/hooks/useSubmitDreamHandler';
    
    const CHARACTER_LIMIT_WARNING_THRESHOLD = 0.9;
    
    const SubmitDreamContent = ({ t }) => {
      const { user, profile, isLoadingProfile, profileError, fetchProfile } = useAuth();
      const { toast } = useToast();
      const navigate = useNavigate();
    
      const {
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
      } = useSubmitDreamFormState();
    
      const characterLimit = profile?.character_limit_per_dream || 3000;
      const remainingInterpretations = profile?.remaining_interpretations;
    
      const { validateForm } = useSubmitDreamFormValidation(formData, characterLimit, t, setErrors);
      const { handleSubmitDream } = useSubmitDreamHandler(
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
      );
    
      useEffect(() => {
        if (user && !profile && !isLoadingProfile && !profileError) {
          fetchProfile(user.id, user.email, user);
        }
      }, [user, profile, isLoadingProfile, profileError, fetchProfile]);
    
      if (isLoadingProfile && !profile) {
        return (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">{t('loadingUser')}</p>
          </div>
        );
      }
    
      if (profileError) {
        return (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('submitDream.errorLoadingProfile', { error: profileError })}
            </AlertDescription>
          </Alert>
        );
      }
      
      if (!user || !profile) {
         return (
          <Alert variant="warning" className="max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('submitDream.mustBeLoggedIn1')} <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto text-amber-700 dark:text-amber-400">{t('submitDream.loginLink')}</Button> {t('submitDream.mustBeLoggedIn2')}
            </AlertDescription>
          </Alert>
        );
      }
    
      const atCharLimitWarning = charCount >= characterLimit * CHARACTER_LIMIT_WARNING_THRESHOLD;
      const overCharLimit = charCount > characterLimit;
    
      return (
        <>
          <SubmitDreamGuidelines t={t} />
          <Card className="max-w-3xl mx-auto shadow-2xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 backdrop-blur-sm mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary dark:text-sky-400">{t('submitDream.formCardTitle')}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {t('submitDream.formCardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {typeof remainingInterpretations === 'number' && remainingInterpretations <= 0 && (
                  <Alert variant="warning" className="mb-6">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                      {t('submitDream.noCreditsAlert1')} <Button variant="link" onClick={() => navigate('/pricing')} className="p-0 h-auto text-amber-700 dark:text-amber-400">{t('submitDream.upgradePlanLink')}</Button> {t('submitDream.noCreditsAlert2')}
                      </AlertDescription>
                  </Alert>
              )}
              <SubmitDreamForm
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleSubmit={handleSubmitDream}
                isSubmitting={isSubmitting}
                charCount={charCount}
                characterLimit={characterLimit}
                atCharLimitWarning={atCharLimitWarning}
                overCharLimit={overCharLimit}
                canSubmit={remainingInterpretations === null || remainingInterpretations > 0}
                t={t}
              />
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>{t('submitDream.fillRequiredFields')}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      );
    };
    
    export default SubmitDreamContent;
  