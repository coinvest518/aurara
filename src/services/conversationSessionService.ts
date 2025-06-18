import { supabase } from '../supabaseClient';

export interface ConversationSession {
  id?: string;
  user_id: string;
  persona_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  transcript: string;
}

export async function saveConversationSession(session: ConversationSession) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .insert([session]);
  if (error) throw error;
  return data;
}

export async function getConversationSessionsByUser(userId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getConversationSessionsByPersona(userId: string, personaId: string) {
  const { data, error } = await supabase
    .from('conversation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .order('start_time', { ascending: false });
  if (error) throw error;
  return data;
}
