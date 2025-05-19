
import { supabase } from '@/lib/supabaseClient';
import { MAKE_WEBHOOK_URL } from '@/lib/constants';
import { sendToMakeWebhook } from '@/services/webhookService';

export async function submitDream(dreamData, userId) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Dream submission via Supabase is disabled.');
    
    const webhookPayloadForLocal = {
      dreamId: `local-${Date.now()}`, 
      user_id: userId,
      user_email: dreamData.user_email, 
      dream_text: dreamData.dream_text,
      full_name: dreamData.full_name,
      age: dreamData.age,
      gender: dreamData.gender,
      marital_status: dreamData.marital_status,
      status: 'pending_local_no_db',
      submission_timestamp: new Date().toISOString()
    };

    const webhookResponse = await sendToMakeWebhook(MAKE_WEBHOOK_URL, webhookPayloadForLocal);

    if (!webhookResponse.success) {
      throw new Error(`Webhook error: ${webhookResponse.error}`);
    }
    return { ...dreamData, id: `local-${Date.now()}`, status: 'pending_local_no_db', user_id: userId, webhook_response: webhookResponse.data };
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const dreamDataForSupabase = {
        user_id: userId,
        full_name: dreamData.full_name,
        age: dreamData.age,
        gender: dreamData.gender,
        marital_status: dreamData.marital_status,
        dream_text: dreamData.dream_text,
        status: 'pending',
        webhook_url: MAKE_WEBHOOK_URL 
      };

    const { data: savedDream, error: saveError } = await supabase
      .from('dream_interpretations')
      .insert([dreamDataForSupabase])
      .select()
      .single();

    if (saveError) throw saveError;

    const webhookPayload = {
      dream_id: savedDream.id,
      user_id: userId,
      user_email: dreamData.user_email, 
      dream_text: dreamData.dream_text,
      full_name: dreamData.full_name,
      age: dreamData.age,
      gender: dreamData.gender,
      marital_status: dreamData.marital_status,
      submission_timestamp: savedDream.created_at
    };
    
    const webhookResponse = await sendToMakeWebhook(MAKE_WEBHOOK_URL, webhookPayload);
    
    if (!webhookResponse.success) {
      console.warn(`Webhook call failed after saving dream ${savedDream.id}: ${webhookResponse.error}`);
    } else {
        const { error: updateError } = await supabase
        .from('dream_interpretations')
        .update({ webhook_response: webhookResponse.data })
        .eq('id', savedDream.id);

        if (updateError) {
            console.error('Error updating webhook response in Supabase:', updateError);
        }
    }
    
    return { ...savedDream, webhook_response: webhookResponse.data };
  } catch (error) {
    console.error('Error in submitDream:', error);
    throw error;
  }
}

export async function getUserDreams(userId) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Cannot fetch user dreams.');
    return [];
  }
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('dream_interpretations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user dreams:', error);
    throw error;
  }
}

export async function getDreamById(dreamId, userId) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Cannot fetch dream by ID.');
    return null;
  }
  if (!dreamId || !userId) {
    throw new Error('Dream ID and User ID are required');
  }

  try {
    const { data, error } = await supabase
      .from('dream_interpretations')
      .select('*')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching dream:', error);
    throw error;
  }
}

export async function deleteDream(dreamId, userId) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Cannot delete dream.');
    return false;
  }
  if (!dreamId || !userId) {
    throw new Error('Dream ID and User ID are required');
  }

  try {
    const { error } = await supabase
      .from('dream_interpretations')
      .delete()
      .eq('id', dreamId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting dream:', error);
    throw error;
  }
}
