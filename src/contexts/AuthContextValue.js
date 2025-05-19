
    import React from 'react'; // Ensure React is imported for useMemo
    import { useMemo } from 'react';

    export function useCreateAuthContextValue(
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
    ) {
      const isLoading = isLoadingSession || isLoadingProfile || isAuthActionLoading;
      const error = authActionError || profileError;

      const value = useMemo(() => ({
        user,
        profile,
        login,
        signup,
        logout,
        fetchProfile,
        isLoading, 
        error,     
        isLoadingSession, 
        isLoadingProfile,
        isAuthActionLoading,
        authActionError,
        profileError,
      }), [
        user,
        profile,
        login,
        signup,
        logout,
        fetchProfile,
        isLoading, 
        error,     
        isLoadingSession,
        isLoadingProfile,
        isAuthActionLoading,
        authActionError,
        profileError,
      ]);

      return value;
    }
  