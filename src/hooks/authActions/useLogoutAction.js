
    import { useCallback, useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AUTH_ERROR_MESSAGES, handleAuthError, handleAuthSuccess } from '@/utils/authUtils';
    import { performLogout } from '@/services/authService';
    
    export function useLogoutAction(setUserForContext, setProfileForContext) {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log("[LogoutAction] Initiating logout...");
    
        if (!supabase) {
          console.warn('[LogoutAction] Supabase client not initialized. Performing local logout.');
          if (typeof setUserForContext === 'function') setUserForContext(null);
          if (typeof setProfileForContext === 'function') setProfileForContext(null);
          setIsLoading(false);
          return handleAuthSuccess(toast, 'Logout', AUTH_ERROR_MESSAGES.LOGOUT_SUCCESS, 3000, setError);
        }
    
        try {
          const { sessionExists, signOutError } = await performLogout();
    
          if (!sessionExists) {
            console.warn("[LogoutAction] No active session found on server. Ensuring local state is clear.");
          } else if (signOutError) {
            if (signOutError.message.includes("Auth session missing") || signOutError.message.includes("Socket closed")) {
              console.warn("[LogoutAction] Supabase reported session missing or socket closed during logout, considering it successful locally.");
            } else {
              return handleAuthError(toast, 'Logout', signOutError, AUTH_ERROR_MESSAGES.LOGOUT_FAILED, setError, setIsLoading);
            }
          }
          
          if (typeof setUserForContext === 'function') {
            setUserForContext(null);
            console.log("[LogoutAction] User context cleared.");
          }
          if (typeof setProfileForContext === 'function') {
             setProfileForContext(null);
             console.log("[LogoutAction] Profile context cleared.");
          }
          return handleAuthSuccess(toast, 'Logout', AUTH_ERROR_MESSAGES.LOGOUT_SUCCESS, 3000, setError);
    
        } catch (err) {
          return handleAuthError(toast, 'Logout', err, AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
        } finally {
          setIsLoading(false);
          console.log("[LogoutAction] Logout attempt concluded.");
        }
      }, [toast, setUserForContext, setProfileForContext]);
    
      return { logout, isLoading, error };
    }
  