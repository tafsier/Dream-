
    import React, { useState } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion } from 'framer-motion';
    import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

    function LoginPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const { login, isLoading, error: authErrorHook } = useAuth(); // Use error from auth context if needed
      const [formError, setFormError] = useState(''); // Local form error
      const navigate = useNavigate();
      const location = useLocation();
      const from = location.state?.from?.pathname || "/dashboard";
      const initialMessage = location.state?.message;


      const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form errors
        if (!email || !password) {
          setFormError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
          return;
        }

        const result = await login(email, password);
        if (result && result.success) {
          navigate(from, { replace: true });
        } else if (result && result.error) {
          // Error is already handled by toast in useAuthActions, but we can set local form error if needed
          setFormError(result.error); // Display error from auth hook
        } else if (!result) {
          // This case might happen if login promise resolves with undefined or null on failure
          setFormError("فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.");
        }
      };

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4"
        >
          <div className="w-full max-w-md space-y-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center"
            >
              <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                تسجيل الدخول إلى حسابك
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                أو{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                  أنشئ حسابًا جديدًا
                </Link>
              </p>
            </motion.div>

            {initialMessage && !formError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="default" className="bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-700 dark:text-blue-300">ملاحظة</AlertTitle>
                  <AlertDescription className="text-blue-600 dark:text-blue-400">
                    {initialMessage}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {formError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ في تسجيل الدخول</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-8 space-y-6 bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-address" className="flex items-center text-gray-700 dark:text-gray-200">
                    <Mail className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400 dark:text-gray-500" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="flex items-center text-gray-700 dark:text-gray-200">
                    <Lock className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400 dark:text-gray-500" />
                    كلمة المرور
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    هل نسيت كلمة المرور؟
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      );
    }

    export default LoginPage;
  