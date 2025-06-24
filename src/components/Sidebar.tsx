import React from 'react';
import type { TavusPersona } from '../services/tavusService';

// Local mapping for persona images and descriptions
const personaMeta: Record<string, { image: string; description: string }> = {
  pde7ef583431: {
    image: '/assets/avatars/Empathy.png',
    description: 'A versatile AI companion acting as both a trusted friend and a professional psychologist.'
  },
  pfab762661bb: {
    image: '/assets/avatars/Daniel.png',
    description: 'A helpful and insightful AI persona for advice and support.'
  },
  pd092acfe184: {
    image: '/assets/avatars/Anna.png',
    description: 'A creative and energetic AI persona for brainstorming and motivation.'
  },
  p60bf9c1b7e7: {
    image: '/assets/avatars/Rose.png',
    description: 'A thoughtful and encouraging AI persona for positive support.'
  },
  p0066621812a: {
    image: '/assets/avatars/Kiki.png',
    description: 'A playful and supportive child psychologist for children and teens.'
  },
  pabbaa4a7bc2: {
    image: '/assets/avatars/Mark.png',
    description: 'Mark, an addiction specialist for recovery and support.'
  },
};

interface SidebarProps {
  personas: TavusPersona[];
  selectedPersonaId: string | null;
  onSelectPersona: (personaId: string) => void;
  onStartConversation: () => void; // Added prop for Start Conversation button
}

const Sidebar: React.FC<SidebarProps> = ({ personas, selectedPersonaId, onSelectPersona, onStartConversation }) => (
  <aside className="w-64 h-screen bg-white border-r shadow-lg flex flex-col fixed left-0 z-40
    max-w-full sm:w-64 sm:static sm:h-auto sm:shadow-lg sm:flex sm:flex-col
    w-full h-full sm:max-w-xs sm:w-64
    hidden sm:flex
    ">
    {/* Fixed header */}
    <div className="p-6 font-bold text-xl text-blue-700 border-b shrink-0 text-center sm:text-left">
      Aurora AI
    </div>
    {/* Start Conversation Button */}
    <div className="p-4">
      <button
        onClick={onStartConversation}
        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        disabled={!selectedPersonaId}
      >
        Start Conversation
      </button>
    </div>
    {/* Persona list */}
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4">
      <div className="mb-4 text-slate-600 text-xs uppercase tracking-wide">Personas</div>
      <ul className="space-y-3">
        {personas.length === 0 && (
          <li className="text-slate-400 text-sm">No personas available</li>
        )}
        {personas.map((persona) => {
          const meta = personaMeta[persona.persona_id] || { image: '/assets/avatars/Empathy.png', description: persona.context || '' };
          return (
            <li key={persona.persona_id}>
              <button
                className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition font-medium border border-transparent hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 ${selectedPersonaId === persona.persona_id ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-slate-700'}`}
                onClick={() => onSelectPersona(persona.persona_id)}
              >
                <img
                  src={meta.image}
                  alt={persona.persona_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                />
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-base">{persona.persona_name}</span>
                  <span className="text-xs text-slate-500 line-clamp-2 max-w-[140px]">{meta.description}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
    {/* Instructional Text */}
    <div className="p-4 text-sm text-slate-500 text-center">
      Select a persona and click <span className="font-semibold">Start Conversation</span> to connect.
    </div>
    {/* Fixed footer */}
    <div className="p-4 border-t text-xs text-slate-500 shrink-0 text-center sm:text-left">
      © {new Date().getFullYear()} Aurora
    </div>
    {/* Custom scrollbar styling */}
    <style>
      {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}
    </style>
  </aside>
);

export default Sidebar;
