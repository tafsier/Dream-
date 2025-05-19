
    import { useCallback, useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AUTH_ERROR_MESSAGES, handleAuthError, handleAuthSuccess } from '@/utils/authUtils';
    import { sendPasswordResetEmail, updateUserPassword } from '@/services/authService';
    
    export function usePasswordResetActions() {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const requestPasswordReset = useCallback(async (email) => {
        setIsLoading(true);
        setError(null);
        console.log("[PasswordResetActions] Initiating password reset for email:", email);
    
        if (!supabase) {
          return handleAuthError(toast, 'PasswordReset', new Error(AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR), AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR_USER_FACING, setError, setIsLoading);
        }
        try {
          const { error: resetError } = await sendPasswordResetEmail(email);
          if (resetError) {
            return handleAuthError(toast, 'PasswordReset', resetError, AUTH_ERROR_MESSAGES.PASSWORD_RESET_FAILED, setError, setIsLoading);
          }
          return handleAuthSuccess(toast, 'PasswordReset', AUTH_ERROR_MESSAGES.PASSWORD_RESET_SENT, 7000, setError);
        } catch (err) {
          return handleAuthError(toast, 'PasswordReset', err, AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
        } finally {
          setIsLoading(false);
        }
      }, [toast]);
    
      const resetPassword = useCallback(async (newPassword) => {
        setIsLoading(true);
        setError(null);
        console.log("[PasswordResetActions] Attempting to update user password.");
        if (!supabase) {
          return handleAuthError(toast, 'ResetPassword', new Error(AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR), AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR_USER_FACING, setError, setIsLoading);
        }
        try {
          const { error: updateError } = await updateUserPassword(newPassword);
          if (updateError) {
             return handleAuthError(toast, 'ResetPassword', updateError, AUTH_ERROR_MESSAGES.PASSWORD_UPDATE_FAILED, setError, setIsLoading);
          }
          return handleAuthSuccess(toast, 'ResetPassword', AUTH_ERROR_MESSAGES.PASSWORD_UPDATE_SUCCESS, 5000, setError);
        } catch (err) {
          return handleAuthError(toast, 'ResetPassword', err, AUTH_ERROR_MESSAGES.UNEXPECTED, setError, setIsLoading);
        } finally {
          setIsLoading(false);
        }
      }, [toast]);
    
      return { requestPasswordReset, resetPassword, isLoading, error };
    }
  