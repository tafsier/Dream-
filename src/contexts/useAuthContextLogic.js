
    import React from 'react'; // Ensure React is imported for hooks
    import { useProfileManagement } from '@/hooks/useProfileManagement';
    import { useAuthSessionManagement } from '@/hooks/useAuthSessionManagement';
    import { useAuthActions } from '@/hooks/useAuthActions'; 
    import { useCreateAuthContextValue } from '@/contexts/AuthContextValue';

    export function useAuthContextLogic() {
      const { user, loading: isLoadingSession } = useAuthSessionManagement();
      
      const {
        profile,
        loadingProfile: isLoadingProfile, 
        profileError, 
        fetchProfile,
      } = useProfileManagement(user?.id, user?.email); // Pass user.email for profile creation

      const {
        login,
        signup,
        logout,
        isLoading: isAuthActionLoading, 
        error: authActionError, 
      } = useAuthActions();

      const contextValue = useCreateAuthContextValue(
        user,
        profile,
        login,
        signup,
        logout,
        fetchProfile,
        isLoadingSession,
        isLoadingProfile,
        isAuthActionLoading,
        authActionError,
        profileError
      );

      return contextValue;
    }
  