import { supabase } from '../supabaseClient';

export async function saveMoodToSession(sessionId: string, mood: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .update({ mood })
    .eq('id', sessionId);
  if (error) throw error;
  return data;
}

export async function getMoodHistory(userId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('id, start_time, mood')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data;
}
