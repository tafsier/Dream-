
    import { useCallback, useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AUTH_ERROR_MESSAGES, handleAuthError, handleAuthSuccess } from '@/utils/authUtils';
    import { performLogin } from '@/services/authService';
    
    export function useLoginAction(setUserForContext, fetchProfileForContext) {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        console.log("[LoginAction] Initiating login...");
    
        if (!supabase) {
          return handleAuthError(toast, 'Login', new Error(AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR), AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR_USER_FACING, setError, setIsLoading);
        }
    
        try {
          const { data, signInError } = await performLogin(email, password);
    
          if (signInError) {
            return handleAuthError(toast, 'Login', signInError, AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS, setError, setIsLoading);
          }
          
          if (!data || !data.user) {
            return handleAuthError(toast, 'Login', new Error("Login successful but no user data returned."), AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
          }
          
          if (typeof setUserForContext === 'function') {
            setUserForContext(data.user);
            console.log("[LoginAction] User context updated with:", JSON.parse(JSON.stringify(data.user)));
            if(typeof fetchProfileForContext === 'function') {
              console.log("[LoginAction] Triggering profile fetch after login.");
              await fetchProfileForContext(data.user.id, data.user.email, data.user);
            } else {
              console.warn("[LoginAction] fetchProfileForContext is not a function. Profile might not update immediately.");
            }
          } else {
            console.warn("[LoginAction] setUserForContext is not a function. User state might not update in context.");
          }
    
          const successResult = handleAuthSuccess(toast, 'Login', AUTH_ERROR_MESSAGES.LOGIN_SUCCESS, 3000, setError);
          return { ...successResult, user: data.user };
    
        } catch (err) {
          return handleAuthError(toast, 'Login', err, AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
        } finally {
          setIsLoading(false);
          console.log("[LoginAction] Login attempt concluded.");
        }
      }, [toast, setUserForContext, fetchProfileForContext]);
    
      return { login, isLoading, error };
    }
  