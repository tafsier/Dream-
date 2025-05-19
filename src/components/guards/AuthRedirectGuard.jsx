
    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { Loader2 } from 'lucide-react';

    // This guard redirects authenticated users away from login/signup pages
    function AuthRedirectGuard({ children }) {
      const { user, isLoadingSession } = useAuth();

      if (isLoadingSession) {
        return (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      if (user) {
        // User is authenticated, redirect to dashboard or a default page
        return <Navigate to="/dashboard" replace />;
      }

      // User is not authenticated, render the login/signup page
      return children;
    }

    export default AuthRedirectGuard;
  