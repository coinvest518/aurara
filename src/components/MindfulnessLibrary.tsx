import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { openaiService } from '../services/openaiService';

interface MindfulnessSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'meditation' | 'breathing' | 'movement' | 'general';
  tags: string[];
  audioUrl?: string;
}

const DEFAULT_SESSIONS: MindfulnessSession[] = [
  {
    id: '1',
    title: 'Quick Grounding Exercise',
    description: 'A 5-minute practice for when you need to center yourself quickly.',
    duration: '5 min',
    type: 'breathing',
    tags: ['anxiety', 'stress', 'quick', 'grounding']
  },
  {
    id: '2',
    title: 'Walking Meditation',
    description: 'A mindful walking practice for when sitting feels challenging.',
    duration: '10 min',
    type: 'movement',
    tags: ['movement', 'restless', 'active', 'outdoor']
  },
  {
    id: '3',
    title: 'Body Scan for Anxiety',
    description: 'Gentle body awareness practice to help manage anxiety.',
    duration: '15 min',
    type: 'meditation',
    tags: ['anxiety', 'body-awareness', 'relaxation']
  }
];

export function MindfulnessLibrary() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MindfulnessSession[]>(DEFAULT_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<MindfulnessSession | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      await openaiService.createCompletion([
        {
          role: 'system',
          content: 'You are a mindfulness expert helping users find the perfect meditation or mindfulness exercise. Filter and rank the available sessions based on the user\'s needs.'
        },
        {
          role: 'user',
          content: query
        }
      ]);

      // Here you would typically process the response and update the results
      // For now, we'll just filter the default sessions based on simple matching
      const filtered = DEFAULT_SESSIONS.filter(session => 
        session.title.toLowerCase().includes(query.toLowerCase()) ||
        session.description.toLowerCase().includes(query.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setResults(filtered);
    } catch (error) {
      console.error('Error searching sessions:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What kind of mindfulness practice do you need?"
          className="w-full px-4 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </form>

      <div className="grid gap-4">
        {results.map((session) => (
          <div
            key={session.id}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => setSelectedSession(session)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{session.description}</p>
              </div>
              <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {session.duration}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {session.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">{selectedSession.title}</h2>
            <p className="text-gray-600 mb-4">{selectedSession.description}</p>
            <div className="flex justify-end gap-2">
              {selectedSession.audioUrl && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Start Session
                </button>
              )}
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
