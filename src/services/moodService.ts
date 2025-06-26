import { supabase } from '../supabaseClient';

type MoodType = 'happy' | 'motivated' | 'stressed' | 'sad' | 'tired';

export async function saveMoodToSession(sessionId: string, mood: MoodType) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .update({ mood })
    .eq('id', sessionId);
  if (error) throw error;
  return data;
}

export interface MoodHistoryItem {
  id: string;
  start_time: string;
  mood: MoodType;
}

export async function getMoodHistory(userId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('id, start_time, mood')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data as MoodHistoryItem[];
}
