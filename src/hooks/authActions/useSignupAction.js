
    import { useCallback, useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AUTH_ERROR_MESSAGES, handleAuthError, handleAuthSuccess } from '@/utils/authUtils';
    import { performSignup, triggerSignupWebhook } from '@/services/authService';
    
    export function useSignupAction(setUserForContext, fetchProfileForContext) {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const signup = useCallback(async (email, password, fullName) => {
        setIsLoading(true);
        setError(null);
        console.log("[SignupAction] Initiating signup...");
    
        if (!supabase) {
          return handleAuthError(toast, 'Signup', new Error(AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR), AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR_USER_FACING, setError, setIsLoading);
        }
    
        try {
          const { data, signUpError, resendError } = await performSignup(email, password, fullName);
    
          if (signUpError) {
            if (signUpError.message.toLowerCase().includes("user already registered")) {
              console.warn("[SignupAction] User already exists. Attempting to resend confirmation...");
              if (resendError) {
                console.error("[SignupAction] Failed to resend confirmation:", resendError);
                return handleAuthError(toast, 'Signup', resendError, AUTH_ERROR_MESSAGES.SIGNUP_FAILED, setError, setIsLoading); 
              } else {
                handleAuthSuccess(toast, 'Signup', AUTH_ERROR_MESSAGES.USER_EXISTS_CONFIRMATION_RESENT, 7000, setError);
                return { success: false, error: "User already exists, confirmation resent.", requiresConfirmation: true };
              }
            } else {
              return handleAuthError(toast, 'Signup', signUpError, AUTH_ERROR_MESSAGES.SIGNUP_FAILED, setError, setIsLoading);
            }
          }
          
          let successMessage = AUTH_ERROR_MESSAGES.SIGNUP_NEEDS_CONFIRMATION;
          let duration = 10000;
          let requiresConfirmation = true;
    
          if (data.user && data.session) { 
            successMessage = AUTH_ERROR_MESSAGES.SIGNUP_AUTO_LOGIN;
            duration = 3000;
            requiresConfirmation = false;
            if (typeof setUserForContext === 'function') {
              setUserForContext(data.user);
              console.log("[SignupAction] User context updated with:", JSON.parse(JSON.stringify(data.user)));
              if(typeof fetchProfileForContext === 'function') {
                console.log("[SignupAction] Triggering profile fetch after auto-login signup.");
                 await fetchProfileForContext(data.user.id, data.user.email, data.user);
              } else {
                console.warn("[SignupAction] fetchProfileForContext is not a function. Profile might not update immediately.");
              }
            } else {
              console.warn("[SignupAction] setUserForContext is not a function. User state might not update in context.");
            }
            await triggerSignupWebhook(data.user); 
          } else if (data.user && !data.session) { 
            successMessage = AUTH_ERROR_MESSAGES.CONFIRMATION_SENT;
            await triggerSignupWebhook(data.user); 
          } else {
            console.warn("[SignupAction] Signup completed with unexpected response data:", JSON.parse(JSON.stringify(data)));
          }
    
          const successResult = handleAuthSuccess(toast, 'Signup', successMessage, duration, setError);
          return { ...successResult, user: data.user, requiresConfirmation };
    
        } catch (err) {
          return handleAuthError(toast, 'Signup', err, AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
        } finally {
          setIsLoading(false);
          console.log("[SignupAction] Signup attempt concluded.");
        }
      }, [toast, setUserForContext, fetchProfileForContext]);
    
      return { signup, isLoading, error };
    }
  