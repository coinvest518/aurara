import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Activity, Music2, Brain, LineChart } from 'lucide-react';
import { UsageStats } from './UsageStats';

interface RightSidebarProps {
  moodHistory: { id: string; start_time: string; mood: string }[];
  selectedMood: string;
  user?: { id: string } | null;
}

interface Section {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: {
    bg: string;
    text: string;
    hover: string;
  };
}

const SECTIONS: Section[] = [
  { 
    key: 'widgets', 
    label: 'Dashboard', 
    icon: <Activity className="w-4 h-4" />,
    color: { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-100' }
  },
  { 
    key: 'music', 
    label: 'Music Player', 
    icon: <Music2 className="w-4 h-4" />,
    color: { bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:bg-purple-100' }
  },
  { 
    key: 'exercises', 
    label: 'Exercises', 
    icon: <Brain className="w-4 h-4" />,
    color: { bg: 'bg-green-50', text: 'text-green-700', hover: 'hover:bg-green-100' }
  },
  { 
    key: 'progress', 
    label: 'Progress', 
    icon: <LineChart className="w-4 h-4" />,
    color: { bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:bg-amber-100' }
  },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ moodHistory, selectedMood, user }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['widgets']));
  
  const toggleSection = (key: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(key)) {
      newSections.delete(key);
    } else {
      newSections.add(key);
    }
    setExpandedSections(newSections);
  };

  return (
    <aside className="w-80 min-h-screen bg-white border-l flex-col shadow-lg flex overflow-hidden max-w-full">
      <div className="p-4 border-b bg-slate-50/80 backdrop-blur sticky top-0 z-10">
        <div className="font-semibold text-lg text-slate-800">Dashboard</div>
        {user && (
          <div className="text-xs text-slate-500 flex items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <span className="font-medium">User</span>
            <span className="ml-1 text-slate-400">({user.id.slice(0, 6)}...)</span>
          </div>
        )}
      </div>

      {/* Show usage stats if user is logged in */}
      {user && (
        <div className="px-4 py-3 border-b">
          <UsageStats userId={user.id} />
        </div>
      )}

      {/* Collapsible widget sections only, no tab bar */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          {SECTIONS.map(section => (
            <div key={section.key} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full px-3 py-2 flex items-center gap-2 text-sm ${section.color.text} ${section.color.hover} rounded-lg transition-colors`}
              >
                {expandedSections.has(section.key) ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
                {section.icon}
                <span className="font-medium">{section.label}</span>
              </button>

              {/* Section Content */}
              {expandedSections.has(section.key) && (
                <div className="ml-4 mt-2 space-y-3 animate-fadeIn">
                  {section.key === 'widgets' && (
                    <>
                      <div className={`${section.color.bg} rounded-lg p-3 shadow-sm`}>
                        <h4 className="font-medium text-sm mb-2">Quick Stats</h4>
                        <ul className="text-xs space-y-1.5">
                          <li className="flex justify-between">
                            <span>Total Conversations</span>
                            <span className="font-semibold">{moodHistory.length}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Current Mood</span>
                            <span className="font-semibold capitalize">{selectedMood}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        <h4 className="font-medium text-sm text-slate-800 mb-1">Daily Tip</h4>
                        <p className="text-xs text-slate-600">Track your mood patterns to gain better insights into your emotional well-being.</p>
                      </div>
                    </>
                  )}

                  {section.key === 'music' && (
                    <div className={`${section.color.bg} rounded-lg p-3 shadow-sm`}>
                      <h4 className="font-medium text-sm mb-2">Focus Music</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs p-2 bg-white/50 rounded">
                          <span>Deep Focus Mix</span>
                          <button className="px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200">
                            Play
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2 bg-white/50 rounded">
                          <span>Calm Meditation</span>
                          <button className="px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200">
                            Play
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.key === 'exercises' && (
                    <div className={`${section.color.bg} rounded-lg p-3 shadow-sm`}>
                      <h4 className="font-medium text-sm mb-2">Today's Exercises</h4>
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-white/50 rounded">
                          <div className="font-medium mb-1">Deep Breathing</div>
                          <p className="text-slate-600">5 minutes of guided breathing exercise</p>
                        </div>
                        <div className="text-xs p-2 bg-white/50 rounded">
                          <div className="font-medium mb-1">Mindfulness</div>
                          <p className="text-slate-600">10 minutes meditation session</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.key === 'progress' && (
                    <div className={`${section.color.bg} rounded-lg p-3 shadow-sm`}>
                      <h4 className="font-medium text-sm mb-3">Weekly Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Mood Check-ins</span>
                            <span>{Math.min(moodHistory.length * 10, 100)}%</span>
                          </div>
                          <div className="w-full bg-white/50 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(moodHistory.length * 10, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          {moodHistory.slice(-3).map(entry => (
                            <div key={entry.id} className="flex justify-between p-1.5 bg-white/50 rounded">
                              <span>{new Date(entry.start_time).toLocaleDateString()}</span>
                              <span className="font-medium capitalize">{entry.mood}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;