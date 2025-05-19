
import { supabase } from '@/lib/supabaseClient';
import { checkSupabaseClient } from '@/utils/authUtils';
import { DEFAULT_FREE_INTERPRETATIONS, DEFAULT_FREE_CHAR_LIMIT, MAKE_WEBHOOK_URL, SUBSCRIPTION_TYPES } from '@/lib/constants';
import { sendToMakeWebhook } from '@/services/webhookService';

export async function performLogin(email, password) {
  checkSupabaseClient();
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, signInError };
}

export async function performSignup(email, password) {
  checkSupabaseClient();
  let resendError = null;
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: email.split('@')[0], 
        subscription_type: SUBSCRIPTION_TYPES.FREE,
        remaining_interpretations: DEFAULT_FREE_INTERPRETATIONS,
        character_limit_per_dream: DEFAULT_FREE_CHAR_LIMIT, 
        subscription_start_date: new Date().toISOString(),
        subscription_package_id: SUBSCRIPTION_TYPES.FREE 
      }
    }
  });

  if (signUpError && signUpError.message.toLowerCase().includes("user already registered")) {
    const { error } = await performResendConfirmation(email);
    resendError = error;
  }

  return { data, signUpError, resendError };
}

export async function performResendConfirmation(email) {
    checkSupabaseClient();
    return await supabase.auth.resend({ type: 'signup', email: email });
}

export async function performLogout() {
  checkSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { sessionExists: false, signOutError: null };
  }
  const { error: signOutError } = await supabase.auth.signOut();
  return { sessionExists: true, signOutError };
}

export async function triggerSignupWebhook(userData) {
  if (!MAKE_WEBHOOK_URL) {
    console.warn('[AuthService:Webhook] Make.com Webhook URL not configured. Skipping webhook.');
    return;
  }
  try {
    const webhookPayload = {
      event: 'new_user_signup',
      userId: userData.id,
      email: userData.email,
      signup_timestamp: new Date().toISOString(),
      full_name: userData.user_metadata?.full_name || userData.email?.split('@')[0],
      initial_subscription_type: userData.user_metadata?.subscription_type || SUBSCRIPTION_TYPES.FREE,
      initial_interpretations: userData.user_metadata?.remaining_interpretations || DEFAULT_FREE_INTERPRETATIONS,
      initial_char_limit: userData.user_metadata?.character_limit_per_dream || DEFAULT_FREE_CHAR_LIMIT,
    };
    console.log("[AuthService:Webhook] Sending data to Make.com:", webhookPayload);
    const webhookResult = await sendToMakeWebhook(MAKE_WEBHOOK_URL, webhookPayload);
    if (webhookResult.success) {
      console.log("[AuthService:Webhook] Successfully sent data to Make.com.");
    } else {
      console.error("[AuthService:Webhook] Failed to send data to Make.com:", webhookResult.error);
    }
  } catch (error) {
    console.error("[AuthService:Webhook] Error triggering signup webhook:", error);
  }
}

export async function sendPasswordResetEmail(email) {
  checkSupabaseClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`, 
  });
  return { data, error };
}

export async function updateUserPassword(newPassword) {
  checkSupabaseClient();
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}
