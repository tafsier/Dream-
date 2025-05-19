
    import { useState, useEffect, useRef } from 'react';
    
    export function useProfileState(userId, isSessionLoadComplete) {
      const [profile, setProfileInternal] = useState(null);
      const [loadingProfile, setLoadingProfile] = useState(true);
      const [profileError, setProfileError] = useState(null);
      const isMountedRef = useRef(true);
    
      useEffect(() => {
        isMountedRef.current = true;
        console.log(`[useProfileState:Effect] Mounted/Deps Changed. userId: ${userId}, isSessionLoadComplete: ${isSessionLoadComplete}`);
        
        if (!isSessionLoadComplete) {
          console.log("[useProfileState:Effect] Session not yet loaded, ensuring loadingProfile is true.");
          if(isMountedRef.current && !loadingProfile) setLoadingProfile(true);
        } else {
          if (!userId) {
            console.log("[useProfileState:Effect] Session loaded but no userId. Clearing profile, stopping loading.");
            if(isMountedRef.current) {
              setProfileInternal(null);
              setLoadingProfile(false);
              setProfileError(null);
            }
          } else {
             console.log(`[useProfileState:Effect] Session loaded with userId: ${userId}. Profile fetch should be handled by AuthContext.`);
             if (isMountedRef.current && !profile && !profileError) {
                setLoadingProfile(true); 
             }
          }
        }
        
        return () => {
          isMountedRef.current = false;
          console.log("[useProfileState:Effect] Unmounted.");
        };
      }, [userId, isSessionLoadComplete]);
    
      const setProfile = (newProfile) => {
        if (isMountedRef.current) {
          setProfileInternal(newProfile);
           if (newProfile === null) {
            console.log("[useProfileState:setProfile] Profile explicitly set to null in state.");
          } else {
            console.log("[useProfileState:setProfile] Profile updated in state:", JSON.parse(JSON.stringify(newProfile)));
          }
        } else {
          console.warn("[useProfileState:setProfile] setProfile called after unmount, state not updated.");
        }
      };
    
      return {
        profile,
        setProfile,
        loadingProfile,
        setLoadingProfile,
        profileError,
        setProfileError,
      };
    }
  