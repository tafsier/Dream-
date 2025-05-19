
import { supabase } from '@/lib/supabaseClient'; 

    export const AUTH_ERROR_MESSAGES = {
      INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.",
      SIGNUP_FAILED: "فشل إنشاء الحساب. قد يكون البريد الإلكتروني مستخدماً بالفعل أو هناك مشكلة في كلمة المرور. تأكد أن كلمة المرور لا تقل عن 6 أحرف.",
      LOGOUT_FAILED: "فشل تسجيل الخروج. يرجى المحاولة مرة أخرى أو تحديث الصفحة.",
      SESSION_MISSING: "لا توجد جلسة نشطة لتسجيل الخروج. أنت بالفعل مسجل خروجك.",
      UNEXPECTED: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
      CONFIRMATION_SENT: "تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد (والبريد المزعج) لتفعيل حسابك.",
      USER_EXISTS_CONFIRMATION_RESENT: "هذا البريد مسجل لدينا بالفعل. تم إرسال رابط تأكيد جديد إلى بريدك. يرجى التحقق.",
      SIGNUP_AUTO_LOGIN: "تم إنشاء الحساب وتسجيل الدخول بنجاح! مرحباً بك.",
      SIGNUP_NEEDS_CONFIRMATION: "اكتملت عملية التسجيل. يرجى تأكيد بريدك الإلكتروني لإكمال العملية.",
      LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح! أهلاً بعودتك.",
      LOGOUT_SUCCESS: "تم تسجيل الخروج بنجاح. نأمل رؤيتك قريباً.",
      SUPABASE_INIT_ERROR: "Internal: Supabase client not initialized. This is a developer issue.",
      SUPABASE_INIT_ERROR_USER_FACING: "نظام المصادقة غير مهيأ حاليًا. يرجى المحاولة لاحقًا أو الاتصال بالدعم.",
      NETWORK_ERROR: "مشكلة في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
    };

    const isNetworkError = (error) => {
      return error instanceof TypeError && error.message === 'Failed to fetch';
    };

    export const handleAuthError = (toast, context, errorObj, defaultMessage, setErrorState) => {
      console.error(`[AuthUtils:${context}] Error:`, errorObj);
      let message = defaultMessage;
      let toastVariant = "destructive";
      let toastTitle = "خطأ";

      if (errorObj && errorObj.message === AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR) {
        message = AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR_USER_FACING;
      } else if (isNetworkError(errorObj)) {
        message = AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      } else if (errorObj && typeof errorObj.message === 'string') {
        const supabaseMsg = errorObj.message.toLowerCase();
        if (supabaseMsg.includes("invalid login credentials")) {
          message = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
        } else if (supabaseMsg.includes("user already registered")) {
          message = AUTH_ERROR_MESSAGES.SIGNUP_FAILED;
        } else if (supabaseMsg.includes("password should be at least 6 characters")) {
          message = "كلمة المرور قصيرة جداً. يجب أن تكون 6 أحرف على الأقل.";
        } else if (supabaseMsg.includes("unable to validate email address")) {
          message = "صيغة البريد الإلكتروني غير صحيحة.";
        } else if (supabaseMsg.includes("auth session missing")) {
          message = AUTH_ERROR_MESSAGES.SESSION_MISSING;
          console.warn(`[AuthUtils:${context}] Attempted action without active session.`);
        } else {
          message = errorObj.message; 
        }
      } else if (typeof errorObj === 'string') {
        message = errorObj; 
      }

      if (typeof setErrorState === 'function') {
        setErrorState(message); 
      }

      if (typeof toast === 'function') {
        toast({
          title: toastTitle,
          description: message,
          variant: toastVariant,
          duration: 7000, 
        });
      } else {
        console.error(`[AuthUtils:${context}] Toast function is not available.`);
      }

      return { success: false, error: message, errorDetails: errorObj };
    };

    export const handleAuthSuccess = (toast, context, message, duration = 3000, setErrorState) => {
      console.log(`[AuthUtils:${context}] Success: ${message}`);
      if (typeof setErrorState === 'function') {
        setErrorState(null); 
      }

      if (typeof toast === 'function') {
        toast({
          title: "نجاح",
          description: message,
          variant: "success", 
          duration: duration,
        });
      } else {
        console.error(`[AuthUtils:${context}] Toast function is not available.`);
      }
      return { success: true };
    };

    export const checkSupabaseClient = () => {
        if (!supabase || !supabase.auth) {
            console.error("[AuthUtils] Supabase client or supabase.auth is not initialized!");
            throw new Error(AUTH_ERROR_MESSAGES.SUPABASE_INIT_ERROR);
        }
    };
