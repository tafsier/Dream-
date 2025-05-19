
    import { useLoginAction } from './authActions/useLoginAction';
    import { useSignupAction } from './authActions/useSignupAction';
    import { useLogoutAction } from './authActions/useLogoutAction';
    import { usePasswordResetActions } from './authActions/usePasswordResetActions';
    
    export function useAuthActions(setUserForContext, setProfileForContext, fetchProfileForContext) {
      const { login, isLoading: isLoginLoading, error: loginError } = useLoginAction(setUserForContext, fetchProfileForContext);
      const { signup, isLoading: isSignupLoading, error: signupError } = useSignupAction(setUserForContext, fetchProfileForContext);
      const { logout, isLoading: isLogoutLoading, error: logoutError } = useLogoutAction(setUserForContext, setProfileForContext);
      const { 
        requestPasswordReset, 
        resetPassword, 
        isLoading: isPasswordResetLoading, 
        error: passwordResetError 
      } = usePasswordResetActions();
    
      return {
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        isLoading: isLoginLoading || isSignupLoading || isLogoutLoading || isPasswordResetLoading,
        error: loginError || signupError || logoutError || passwordResetError,
      };
    }
  