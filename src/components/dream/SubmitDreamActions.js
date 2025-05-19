
import { supabase } from '@/lib/supabaseClient';
    import { sendToMakeWebhook } from '@/services/webhookService';
    import { decrementUserInterpretations } from '@/services/subscriptionService';
    import { MAKE_WEBHOOK_URL } from '@/lib/constants';

    export const submitDream = async (formData, user, profile, fetchProfile, toast) => {
      const commonErrorReturn = (message, errorDetails = null) => {
        console.error("[SubmitDreamActions] Error:", message, errorDetails || '');
        if (typeof toast === 'function') {
          toast({ title: "خطأ", description: message, variant: "destructive" });
        }
        return { success: false, message, errorDetails };
      };

      if (typeof fetchProfile !== 'function') {
        return commonErrorReturn("خطأ داخلي: وظيفة تحديث الملف الشخصي غير متوفرة.");
      }
      if (typeof toast !== 'function') {
        console.error("[SubmitDreamActions] Toast function is not available.");
        return { success: false, message: "خطأ داخلي في نظام الإشعارات." };
      }

      if (!user || !user.id || !profile) {
        return commonErrorReturn("لم يتم العثور على بيانات المستخدم أو الملف الشخصي. يرجى إعادة المحاولة.", { userId: user?.id, profileExists: !!profile });
      }

      const dreamDataForSupabase = {
        user_id: user.id,
        full_name: formData.full_name,
        gender: formData.gender,
        age: formData.age,
        marital_status: formData.maritalStatus,
        dream_text: formData.dreamText,
        status: 'pending',
        webhook_url: MAKE_WEBHOOK_URL,
      };

      console.log("[SubmitDreamActions] Attempting to save dream:", dreamDataForSupabase);
      let savedDream = null;

      try {
        const { data, error: saveError } = await supabase
          .from('dream_interpretations')
          .insert([dreamDataForSupabase])
          .select()
          .single();

        if (saveError) {
          return commonErrorReturn(`فشل حفظ الرؤيا: ${saveError.message}`, saveError);
        }
        savedDream = data;
        console.log("[SubmitDreamActions] Dream saved successfully:", savedDream);

        if (profile.subscription_type !== 'unlimited' && profile.subscription_type !== 'premium' && profile.subscription_type !== 'enterprise') {
          console.log("[SubmitDreamActions] Attempting to decrement interpretations...");
          const decrementSuccess = await decrementUserInterpretations(user.id);
          if (!decrementSuccess) {
            console.warn("[SubmitDreamActions] Failed to decrement interpretations, but dream was saved. Proceeding with webhook.");
            toast({
                title: "تحذير",
                description: "تم حفظ رؤياك، ولكن حدث خطأ في تحديث رصيدك. يرجى الاتصال بالدعم.",
                variant: "default", 
            });
          } else {
            console.log("[SubmitDreamActions] Decrement successful. Fetching updated profile...");
            await fetchProfile(); 
          }
        } else {
            console.log("[SubmitDreamActions] Unlimited/Premium/Enterprise plan. Fetching profile (no decrement needed).");
            await fetchProfile(); 
        }

        if (savedDream && MAKE_WEBHOOK_URL) {
            const webhookPayload = { 
              dream_id: savedDream.id, 
              user_id: user.id,
              user_email: user.email, 
              full_name: formData.full_name,
              gender: formData.gender,
              age: formData.age,
              marital_status: formData.maritalStatus,
              dream_text: formData.dreamText,
              submission_timestamp: savedDream.created_at
            };
            console.log("[SubmitDreamActions] Sending data to Make webhook:", MAKE_WEBHOOK_URL, webhookPayload);
            const webhookResult = await sendToMakeWebhook(MAKE_WEBHOOK_URL, webhookPayload);

            if (!webhookResult.success) {
              console.warn("[SubmitDreamActions] Failed to send data to Make webhook, but dream was saved:", webhookResult.error);
              toast({
                  title: "ملاحظة",
                  description: "تم حفظ رؤياك، ولكن قد يكون هناك تأخير في بدء المعالجة. سيتم معالجتها.",
                  variant: "default",
              });
            } else {
                console.log("[SubmitDreamActions] Data sent to Make webhook successfully.");
                 const { error: updateError } = await supabase
                    .from('dream_interpretations')
                    .update({ webhook_response: webhookResult.data })
                    .eq('id', savedDream.id);

                if (updateError) {
                    console.error('[SubmitDreamActions] Error updating webhook response in Supabase:', updateError);
                }
            }
        } else if (!MAKE_WEBHOOK_URL) {
             console.warn("[SubmitDreamActions] Make.com webhook URL is not configured.");
             toast({ title: "ملاحظة للمطور", description: "لم يتم تكوين رابط Webhook.", variant: "default" });
        }

        toast({
            title: "نجاح!",
            description: "تم إرسال رؤياك بنجاح! سيتم تفسيرها وإعلامك قريباً.",
            variant: "success",
        });
        return { success: true, message: "تم إرسال رؤياك بنجاح!" };

      } catch (error) {
        return commonErrorReturn(`حدث خطأ غير متوقع أثناء إرسال الرؤيا: ${error.message}`, error);
      }
    };
