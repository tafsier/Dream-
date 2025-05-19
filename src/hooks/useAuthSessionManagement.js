
    import { useState, useEffect, useRef, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    
    export function useAuthSessionManagement() {
      const [user, setUserState] = useState(null);
      const [loading, setLoading] = useState(true); 
      const [isInitialSessionLoadComplete, setIsInitialSessionLoadComplete] = useState(false);
      const isMountedRef = useRef(true);
      const authListenerRef = useRef(null);
    
      const setUser = useCallback((newUser) => {
        if (isMountedRef.current) {
          setUserState(prevUser => {
            const prevUserId = prevUser?.id;
            const newUserId = newUser?.id;
            const hasUserChanged = prevUserId !== newUserId || 
                                   (prevUser?.email !== newUser?.email) ||
                                   (!prevUser && newUser) || (prevUser && !newUser);
    
            if (hasUserChanged) {
              console.log(`[AuthSession:SetUser] User state changed: ${newUser ? `${newUser.id} (${newUser.email})` : 'null'}`);
              return newUser;
            }
            return prevUser;
          });
        }
      }, []);
    
      useEffect(() => {
        isMountedRef.current = true;
        console.log("[AuthSession:Effect] Initializing session management...");
    
        if (!supabase) {
          console.warn('[AuthSession:Effect] Supabase client not initialized. Auth session management is disabled. User will remain null.');
          if (isMountedRef.current) {
            setUser(null);
            setLoading(false);
            setIsInitialSessionLoadComplete(true);
          }
          return;
        }
        
        let initialCheckDone = false;
    
        const updateSessionState = (session, contextMessage = "") => {
          if (!isMountedRef.current) {
            console.log(`[AuthSession${contextMessage}] Update ignored: Component unmounted.`);
            return;
          }
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          if (!initialCheckDone) {
             console.warn(`[AuthSession${contextMessage}] updateSessionState called before initialCheckDone. This should not happen.`);
             initialCheckDone = true; 
          }
    
          if (isMountedRef.current) {
            if (loading) { 
               setLoading(false);
               console.log(`[AuthSession${contextMessage}] Loading state resolved.`);
            }
            if (!isInitialSessionLoadComplete) {
              setIsInitialSessionLoadComplete(true);
              console.log(`[AuthSession${contextMessage}] Initial session load marked as complete.`);
            }
          }
        };
        
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          initialCheckDone = true; 
          if (error) {
            console.error("[AuthSession:GetSession] Error getting initial session:", error);
            updateSessionState(null, ":GetSessionError");
          } else {
            console.log("[AuthSession:GetSession] Initial session retrieved:", session ? session.user.id : 'No session');
            updateSessionState(session, ":GetSessionSuccess");
          }
    
          if (isMountedRef.current && !authListenerRef.current) {
            const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
              console.log("[AuthSession:OnAuthStateChange] Auth state changed event:", _event, session ? `User: ${session.user.id} (${session.user.email})` : "No session");
              
              if (!initialCheckDone) {
                  console.warn(`[AuthSession:OnAuthStateChange] Event '${_event}' received before initial getSession() completed. This may lead to race conditions.`);
                  initialCheckDone = true; 
              }
    
              if (_event === "SIGNED_OUT" || (_event === "TOKEN_REFRESHED" && !session) || _event === "USER_DELETED") {
                updateSessionState(null, `:${_event}`);
              } else if (_event === "INITIAL_SESSION" && !session){
                updateSessionState(null, `:${_event}_NoUser`);
              }
              else {
                updateSessionState(session, `:${_event}`);
              }
            });
            authListenerRef.current = listener; 
            console.log("[AuthSession:Effect] Auth state change listener attached.");
          }
        }).catch(criticalError => {
          initialCheckDone = true; 
          console.error("[AuthSession:GetSession] Critical error during getSession():", criticalError);
          updateSessionState(null, ":GetSessionCriticalError");
        });
    
        return () => {
          isMountedRef.current = false;
          if (authListenerRef.current && authListenerRef.current.subscription) {
            authListenerRef.current.subscription.unsubscribe();
            authListenerRef.current = null; 
            console.log("[AuthSession:EffectUnmount] Auth listener unsubscribed.");
          } else if (supabase) { 
            console.warn("[AuthSession:EffectUnmount] Could not unsubscribe listener on unmount (already null or no subscription).");
          }
          console.log("[AuthSession:EffectUnmount] Session management unmounted.");
        };
      }, [setUser]); 
    
      return { user, setUser, loading, isInitialSessionLoadComplete }; 
    }
  