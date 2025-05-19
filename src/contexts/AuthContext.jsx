
    import React, { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuthSessionManagement } from '@/hooks/useAuthSessionManagement';
    import { useProfileState }  from '@/hooks/profile/useProfileState';
    import { useFetchProfile } from '@/hooks/profile/useFetchProfile';
    import { useUpdateProfile } from '@/hooks/profile/useUpdateProfile';
    import { 
      useLoginAction, 
      useSignupAction, 
      useLogoutAction, 
      usePasswordResetActions 
    } from '@/hooks/authActions';
    import { AuthProviderLayout } from '@/contexts/AuthProviderLayout.jsx';
    
    const AuthContext = createContext(null);
    
    const fallbackSetUser = (user) => {
      console.warn("AuthContext Fallback: setUser called, but context is not fully initialized. User:", user);
    };
    const fallbackSetProfile = (profile) => {
      console.warn("AuthContext Fallback: setProfile called, but context is not fully initialized. Profile:", profile);
    };
    
    const fallbackLogin = async () => { console.error("AuthContext Fallback: login called"); return { success: false, error: "Context not initialized" }; };
    const fallbackSignup = async () => { console.error("AuthContext Fallback: signup called"); return { success: false, error: "Context not initialized" }; };
    const fallbackLogout = async () => { console.error("AuthContext Fallback: logout called"); return { success: false, error: "Context not initialized" }; };
    const fallbackFetchProfileCb = async () => { console.error("AuthContext Fallback: fetchProfile callback called"); };
    const fallbackRequestPasswordReset = async () => { console.error("AuthContext Fallback: requestPasswordReset called"); return { success: false, error: "Context not initialized" }; };
    const fallbackResetPassword = async () => { console.error("AuthContext Fallback: resetPassword called"); return { success: false, error: "Context not initialized" }; };
    const fallbackUpdateProfile = async () => { console.error("AuthContext Fallback: updateProfile called"); return false; };
    const fallbackUploadAvatar = async () => { console.error("AuthContext Fallback: uploadAvatar called"); return null; };
    
    
    const createDefaultFallbackAuthContextValue = () => ({
      user: null,
      profile: null,
      login: fallbackLogin,
      signup: fallbackSignup,
      logout: fallbackLogout,
      fetchProfile: fallbackFetchProfileCb,
      updateProfile: fallbackUpdateProfile,
      uploadAvatar: fallbackUploadAvatar,
      isLoading: true,
      error: null,
      isLoadingSession: true,
      isLoadingProfile: true,
      isAuthActionLoading: false,
      authActionError: null,
      profileError: null,
      setUser: fallbackSetUser,
      setProfile: fallbackSetProfile,
      requestPasswordReset: fallbackRequestPasswordReset,
      resetPassword: fallbackResetPassword,
      isInitialSessionLoadComplete: false,
    });
    
    
    export const AuthProvider = ({ children }) => {
      const { 
        user, 
        setUser, 
        loading: isLoadingSessionHook, 
        error: sessionError, 
        isInitialSessionLoadComplete 
      } = useAuthSessionManagement();
    
      const {
        profile,
        setProfile,
        loadingProfile: isLoadingProfileHook,
        profileError: profileErrorHook,
        setProfileError: setProfileErrorHook,
        setLoadingProfile: setLoadingProfileHook,
      } = useProfileState(user?.id, isInitialSessionLoadComplete);
    
      const { fetchProfileData } = useFetchProfile(
        supabase,
        setProfile,
        setLoadingProfileHook,
        setProfileErrorHook
      );
    
      const { updateProfileData, uploadAvatarData } = useUpdateProfile(
        supabase,
        setProfile,
        fetchProfileData 
      );
    
      useEffect(() => {
        console.log(`[AuthContext:ProfileFetchEffect] Running. isInitialSessionLoadComplete: ${isInitialSessionLoadComplete}, userId: ${user?.id}`);
        if (isInitialSessionLoadComplete) {
          if (user?.id && user?.email) {
            console.log("[AuthContext:ProfileFetchEffect] User session loaded, attempting to fetch profile.");
            if (!profile && !isLoadingProfileHook && !profileErrorHook) {
              fetchProfileData(user.id, user.email, user);
            } else if (profile && user.id !== profile.id) {
              console.log("[AuthContext:ProfileFetchEffect] User ID changed, refetching profile.");
              fetchProfileData(user.id, user.email, user);
            }
          } else if (!user?.id) {
            console.log("[AuthContext:ProfileFetchEffect] User session loaded, but no user ID. Clearing profile.");
            setProfile(null);
            setLoadingProfileHook(false);
            setProfileErrorHook(null);
          }
        } else {
          console.log("[AuthContext:ProfileFetchEffect] Initial session load not yet complete, deferring profile fetch.");
           setLoadingProfileHook(true); 
        }
      }, [user?.id, user?.email, user, isInitialSessionLoadComplete, fetchProfileData, setProfile, setLoadingProfileHook, setProfileErrorHook, profile, isLoadingProfileHook, profileErrorHook]);
    
      const { login, isLoading: isLoginLoading, error: loginError } = useLoginAction(setUser, fetchProfileData);
      const { signup, isLoading: isSignupLoading, error: signupError } = useSignupAction(setUser, fetchProfileData);
      const { logout, isLoading: isLogoutLoading, error: logoutError } = useLogoutAction(setUser, setProfile);
      const { requestPasswordReset, resetPassword, isLoading: isPasswordResetLoading, error: passwordResetError } = usePasswordResetActions();
      
      const isAuthActionLoading = isLoginLoading || isSignupLoading || isLogoutLoading || isPasswordResetLoading;
      const authActionError = loginError || signupError || logoutError || passwordResetError;
    
      const fetchProfileCb = useCallback(() => {
        if (user?.id && user?.email) {
          console.log("[AuthContext:fetchProfileCb] Manually triggering profile fetch.");
          fetchProfileData(user.id, user.email, user);
        } else {
          console.warn("[AuthContext:fetchProfileCb] Cannot fetch profile: User ID or email is missing.");
        }
      }, [user, fetchProfileData]);
    
      const updateProfileCb = useCallback(async (profileDataToUpdate) => {
        if (!user?.id) {
          console.error("[AuthContext:updateProfileCb] Cannot update profile: User ID is missing.");
          return false;
        }
        return await updateProfileData(user.id, profileDataToUpdate);
      }, [user?.id, updateProfileData]);
    
      const uploadAvatarCb = useCallback(async (avatarFile) => {
        if (!user?.id) {
          console.error("[AuthContext:uploadAvatarCb] Cannot upload avatar: User ID is missing.");
          return null;
        }
        return await uploadAvatarData(user.id, avatarFile);
      }, [user?.id, uploadAvatarData]);
        
      const overallIsLoading = useMemo(() => {
        if (isLoadingSessionHook) return true; 
        if (isInitialSessionLoadComplete && user?.id && !profile && isLoadingProfileHook && !profileErrorHook) return true;
        return false;
      }, [isLoadingSessionHook, isInitialSessionLoadComplete, user, profile, isLoadingProfileHook, profileErrorHook]);
    
      const contextValue = useMemo(() => ({
        user,
        profile,
        login,
        signup,
        logout,
        fetchProfile: fetchProfileCb,
        updateProfile: updateProfileCb,
        uploadAvatar: uploadAvatarCb,
        isLoading: overallIsLoading,
        error: sessionError || profileErrorHook || authActionError,
        isLoadingSession: isLoadingSessionHook,
        isLoadingProfile: isLoadingProfileHook,
        isAuthActionLoading,
        authActionError,
        profileError: profileErrorHook,
        setUser,
        setProfile,
        requestPasswordReset,
        resetPassword,
        isInitialSessionLoadComplete
      }), [
        user, profile, login, signup, logout, fetchProfileCb, updateProfileCb, uploadAvatarCb,
        overallIsLoading, sessionError, profileErrorHook, authActionError,
        isLoadingSessionHook, isLoadingProfileHook, isAuthActionLoading,
        setUser, setProfile, requestPasswordReset, resetPassword, isInitialSessionLoadComplete
      ]);
    
      return (
        <AuthContext.Provider value={contextValue}>
          <AuthProviderLayout isLoading={overallIsLoading}>
            {children}
          </AuthProviderLayout>
        </AuthContext.Provider>
      );
    };
    
    
    export function useAuth() {
      const context = useContext(AuthContext);
      const defaultFallbackValue = useMemo(() => createDefaultFallbackAuthContextValue(), []);
    
      if (context === undefined || context === null) {
        if (!supabase) {
           console.warn('AuthContext: Supabase client is null. Returning static fallback auth state.');
        } else {
          console.warn('useAuth must be used within an AuthProvider. Returning static fallback auth state.');
        }
        return defaultFallbackValue;
      }
      return context;
    }
  