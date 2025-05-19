
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion } from 'framer-motion';
    import { UserPlus, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

    function SignupPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const { signup, isLoading, error: authErrorHook } = useAuth();
      const [formError, setFormError] = useState('');
      const [signupSuccess, setSignupSuccess] = useState(false);
      const [successMessage, setSuccessMessage] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSignupSuccess(false);
        setSuccessMessage('');

        if (!email || !password || !confirmPassword) {
          setFormError("يرجى ملء جميع الحقول.");
          return;
        }
        if (password !== confirmPassword) {
          setFormError("كلمتا المرور غير متطابقتين.");
          return;
        }
        if (password.length < 6) {
          setFormError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
          return;
        }

        const result = await signup(email, password);

        if (result && result.success) {
          setSignupSuccess(true);
          if (result.requiresConfirmation) {
            setSuccessMessage("تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد (والبريد المزعج) لتفعيل حسابك.");
          } else {
            setSuccessMessage("تم إنشاء الحساب وتسجيل الدخول بنجاح! سيتم توجيهك الآن.");
            setTimeout(() => navigate('/dashboard'), 3000); // Redirect after a delay
          }
        } else if (result && result.error) {
          // Error is already handled by toast in useAuthActions
          setFormError(result.error);
        } else if (!result) {
           setFormError("فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
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
              <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                إنشاء حساب جديد
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  سجل الدخول من هنا
                </Link>
              </p>
            </motion.div>

            {formError && !signupSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ في إنشاء الحساب</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {signupSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>نجاح!</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            {!signupSuccess && (
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
                      autoComplete="new-password"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700"
                      placeholder="•••••••• (6 أحرف على الأقل)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="flex items-center text-gray-700 dark:text-gray-200">
                      <Lock className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400 dark:text-gray-500" />
                      تأكيد كلمة المرور
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
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
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      'إنشاء حساب'
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      );
    }

    export default SignupPage;
  