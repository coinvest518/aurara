import React, { useEffect, useState } from 'react';
import { getConversationSessionsByPersona } from '../services/conversationSessionService';
import { supabase } from '../supabaseClient';

interface ConversationHistoryProps {
  personaId: string;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ personaId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId || !personaId) return;
    setLoading(true);
    getConversationSessionsByPersona(userId, personaId)
      .then(data => setSessions(data || []))
      .finally(() => setLoading(false));
  }, [userId, personaId]);

  if (!userId) return <div className="text-sm text-slate-500">Sign in to view history.</div>;
  if (loading) return <div className="text-sm text-slate-500">Loading history...</div>;
  if (!sessions.length) return <div className="text-sm text-slate-500">No conversation history for this persona.</div>;

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <div key={session.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-blue-700">{new Date(session.start_time).toLocaleString()}</span>
            <span className="text-xs text-slate-500">Duration: {Math.round(session.duration)}s</span>
          </div>
          <div className="text-sm text-slate-700 whitespace-pre-line max-h-32 overflow-y-auto">
            {session.transcript}
          </div>
        </div>
      ))}
    </div>
  );
};
