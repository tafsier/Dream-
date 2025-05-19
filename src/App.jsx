
    import React, { useEffect, Suspense } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import { useLanguage } from '@/contexts/useLanguage';
    import SubmitDreamGuard from '@/components/guards/SubmitDreamGuard';
    import AuthRedirectGuard from '@/components/guards/AuthRedirectGuard';
    
    const Home = React.lazy(() => import('@/pages/Home'));
    const About = React.lazy(() => import('@/pages/About'));
    const SubmitDream = React.lazy(() => import('@/pages/SubmitDream'));
    const PricingPage = React.lazy(() => import('@/pages/Pricing'));
    const FAQ = React.lazy(() => import('@/pages/FAQ'));
    const Contact = React.lazy(() => import('@/pages/Contact'));
    const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
    const DreamTypes = React.lazy(() => import('@/pages/DreamTypes'));
    const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
    const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
    const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
    
    function AppLoadingFallback() {
      const { t } = useLanguage();
      return (
        <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading')}</p>
          </div>
        </div>
      );
    }
    
    function App() {
      const { language, direction, isLoadingTranslations } = useLanguage();
      
      useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = direction;
      }, [language, direction]);
    
      if (isLoadingTranslations) {
        return (
           <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
            <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading application...</p>
              </div>
            </div>
          </div>
        );
      }
    
      return (
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Suspense fallback={<AppLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/submit-dream"
                    element={
                      <SubmitDreamGuard>
                        <SubmitDream />
                      </SubmitDreamGuard>
                    }
                  />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/dashboard"
                    element={
                      <SubmitDreamGuard>
                        <Dashboard />
                      </SubmitDreamGuard>
                    }
                  />
                  <Route path="/dream-types" element={<DreamTypes />} />
                  <Route
                    path="/login"
                    element={
                      <AuthRedirectGuard>
                        <LoginPage />
                      </AuthRedirectGuard>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <AuthRedirectGuard>
                        <SignupPage />
                      </AuthRedirectGuard>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      );
    }
    
    export default App;
  