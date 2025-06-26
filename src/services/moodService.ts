import { supabase } from '../supabaseClient';

type MoodType = 'happy' | 'motivated' | 'stressed' | 'sad' | 'tired';

export async function saveMoodToSession(sessionId: string, mood: MoodType) {
  try {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .update({ mood })
      .eq('id', sessionId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving mood:', error);
    // Return empty data instead of throwing to prevent UI errors
    return null;
  }
}

export interface MoodHistoryItem {
  id: string;
  start_time: string;
  mood: MoodType;
}

export async function getMoodHistory(userId: string, options?: { signal?: AbortSignal }) {
  if (!userId) {
    console.warn('getMoodHistory called without userId');
    return [];
  }
  
  try {
    // Add a small delay to prevent hammering the server on failures
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const query = supabase
      .from('conversation_sessions')
      .select('id, start_time, mood')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
      
    // Only add abort signal if provided
    if (options?.signal) {
      query.abortSignal(options.signal);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    return data as MoodHistoryItem[];
  } catch (error: any) {
    // Check if this is an abort error (user navigated away)
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Mood history fetch aborted');
      return [];
    }
    
    // Check for the "Failed to fetch" error that indicates network issues
    if (error.message === 'TypeError: Failed to fetch' || 
        (error.details && error.details.includes('Failed to fetch'))) {
      console.warn('Network error when fetching mood history - not retrying', error);
      // Return empty array to prevent retries
      return [];
    }
    
    console.error('Error fetching mood history:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}
