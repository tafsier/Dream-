
import { supabase } from '@/lib/supabaseClient';

    export async function decrementUserInterpretations(userId) {
      if (!supabase) {
        console.warn('Supabase client not initialized. Cannot decrement user interpretations.');
        return true; 
      }
      if (!userId) {
        console.error('DecrementUserInterpretations: No user ID provided.');
        return false;
      }

      try {
        const { data: profileData, error: fetchError } = await supabase
          .from('profiles')
          .select('remaining_interpretations, subscription_type')
          .eq('id', userId)
          .single();

        if (fetchError) {
          console.error('Error fetching profile for decrement:', fetchError);
          return false;
        }

        if (!profileData) {
          console.error('Profile not found for user:', userId);
          return false;
        }
        
        if (profileData.subscription_type === 'unlimited' || profileData.subscription_type === 'premium' || profileData.subscription_type === 'enterprise') {
            console.log('User has unlimited/premium/enterprise plan, no decrement needed.');
            return true; 
        }

        if (profileData.remaining_interpretations <= 0) {
          console.warn('User has no interpretations left to decrement.');
          return true; 
        }

        const newCount = profileData.remaining_interpretations - 1;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ remaining_interpretations: newCount, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating interpretations count:', updateError);
          return false;
        }

        console.log('Successfully decremented interpretations for user:', userId);
        return true;
      } catch (error) {
        console.error('Unexpected error in decrementUserInterpretations:', error);
        return false;
      }
    }

    export async function getSubscriptionPlans() {
      if (!supabase) {
        console.warn('Supabase client not initialized. Returning default plans.');
        return [
          { id: 'free', name_ar: 'الباقة المجانية', name_en: 'Free Package', price_monthly: 0, interpretations_limit: 3, features_ar: ['3 تفسيرات رؤى شهرياً', 'تفسير أساسي', 'دعم عبر البريد الإلكتروني'], features_en: ['3 vision interpretations per month', 'Basic interpretation', 'Email support'], stripe_price_id: null, is_active: true, character_limit: 500 },
          { id: 'basic', name_ar: 'الباقة الأساسية', name_en: 'Basic Package', price_monthly: 12, interpretations_limit: 10, features_ar: ['10 تفسيرات رؤى شهرياً', 'تفسير مفصل', 'أولوية في الدعم', 'حفظ سجل الرؤى'], features_en: ['10 vision interpretations per month', 'Detailed interpretation', 'Priority support', 'Save vision history'], stripe_price_id: 'price_basic_placeholder', is_active: true, character_limit: 1500 },
          { id: 'premium', name_ar: 'الباقة المميزة', name_en: 'Premium Package', price_monthly: 29, interpretations_limit: 30, features_ar: ['30 تفسير رؤى شهرياً', 'تفسير شامل وعميق', 'دعم فوري ومخصص', 'تحليلات متقدمة للرموز'], features_en: ['30 vision interpretations per month', 'Comprehensive and in-depth interpretation', 'Instant and dedicated support', 'Advanced symbol analysis'], stripe_price_id: 'price_premium_placeholder', is_active: true, character_limit: 3000 },
          { id: 'enterprise', name_ar: 'باقة الأعمال', name_en: 'Enterprise Package', price_monthly: 99, interpretations_limit: 100, features_ar: ['100 تفسير رؤى شهرياً', 'كل ميزات المميزة', 'دعم مخصص للأعمال', 'تقارير متقدمة'], features_en: ['100 vision interpretations per month', 'All Premium features', 'Dedicated business support', 'Advanced reporting'], stripe_price_id: 'price_enterprise_placeholder', is_active: true, character_limit: 5000 },
        ];
      }
      
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true });

        if (error) {
          console.error('Error fetching subscription plans from Supabase:', error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Failed to get subscription plans, returning default:', error);
        return [
            { id: 'free', name_ar: 'الباقة المجانية', name_en: 'Free Package', price_monthly: 0, interpretations_limit: 3, features_ar: ['3 تفسيرات رؤى شهرياً', 'تفسير أساسي', 'دعم عبر البريد الإلكتروني'], features_en: ['3 vision interpretations per month', 'Basic interpretation', 'Email support'], stripe_price_id: null, is_active: true, character_limit: 500 },
            { id: 'basic', name_ar: 'الباقة الأساسية', name_en: 'Basic Package', price_monthly: 12, interpretations_limit: 10, features_ar: ['10 تفسيرات رؤى شهرياً', 'تفسير مفصل', 'أولوية في الدعم', 'حفظ سجل الرؤى'], features_en: ['10 vision interpretations per month', 'Detailed interpretation', 'Priority support', 'Save vision history'], stripe_price_id: 'price_basic_placeholder', is_active: true, character_limit: 1500 },
            { id: 'premium', name_ar: 'الباقة المميزة', name_en: 'Premium Package', price_monthly: 29, interpretations_limit: 30, features_ar: ['30 تفسير رؤى شهرياً', 'تفسير شامل وعميق', 'دعم فوري ومخصص', 'تحليلات متقدمة للرموز'], features_en: ['30 vision interpretations per month', 'Comprehensive and in-depth interpretation', 'Instant and dedicated support', 'Advanced symbol analysis'], stripe_price_id: 'price_premium_placeholder', is_active: true, character_limit: 3000 },
            { id: 'enterprise', name_ar: 'باقة الأعمال', name_en: 'Enterprise Package', price_monthly: 99, interpretations_limit: 100, features_ar: ['100 تفسير رؤى شهرياً', 'كل ميزات المميزة', 'دعم مخصص للأعمال', 'تقارير متقدمة'], features_en: ['100 vision interpretations per month', 'All Premium features', 'Dedicated business support', 'Advanced reporting'], stripe_price_id: 'price_enterprise_placeholder', is_active: true, character_limit: 5000 },
        ];
      }
    }
