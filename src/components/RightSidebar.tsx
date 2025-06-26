import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Activity, Music2, Brain, LineChart, AlertCircle } from 'lucide-react';
import { UsageStats } from './UsageStats';
import { UsageService, PLAN_LIMITS } from '../services/usageService';
import type { UserSubscription } from '../types/subscription';
import type { MoodHistoryItem } from '../services/moodService';
import { MindfulnessLibrary } from './MindfulnessLibrary';

interface RightSidebarProps {
  moodHistory: MoodHistoryItem[];
  selectedMood: 'happy' | 'motivated' | 'stressed' | 'sad' | 'tired';
  user?: { id: string } | null;
  isLoading?: boolean;
  hasError?: boolean;
}

interface SessionStats {
  totalSessions: number;
  remainingSessions: number;
  videoSessions: number;
  textSessions: number;
  plan: UserSubscription['subscription_type'];
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

const RightSidebar: React.FC<RightSidebarProps> = ({ moodHistory, selectedMood, user, isLoading = false, hasError = false }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['widgets']));
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load session stats
  useEffect(() => {
    const loadSessionStats = async () => {
      if (!user) return;
      
      try {
        setLoadingStats(true);
        setError(null);
        const currentUsage = await UsageService.getCurrentUsage(user.id);
        
        if (currentUsage) {
          setSessionStats({
            totalSessions: currentUsage.total_sessions || 0,
            remainingSessions: Math.max(0, PLAN_LIMITS.free.total_free_sessions || 15 - (currentUsage.total_sessions || 0)),
            videoSessions: currentUsage.video_sessions,
            textSessions: currentUsage.text_sessions,
            plan: 'free' // Default to free plan
          });
        }
      } catch (error) {
        console.error('Error loading session stats:', error);
        setError('Failed to load session statistics');
      } finally {
        setLoadingStats(false);
      }
    };

    loadSessionStats();
  }, [user]);

  // Track external error and loading states
  useEffect(() => {
    if (hasError) {
      setError('Failed to load mood history data');
    }
  }, [hasError]);

  const toggleSection = (key: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(key)) {
      newSections.delete(key);
    } else {
      newSections.add(key);
    }
    setExpandedSections(newSections);
  };

  // Progress calculation
  const calculateProgress = () => {
    if (!sessionStats) return 0;
    const freeLimit = PLAN_LIMITS.free.total_free_sessions || 15;
    return Math.min(100, (sessionStats.totalSessions / freeLimit) * 100);
  };

  const calculateMoodProgress = () => {
    if (!moodHistory.length) return 0;
    return Math.min(100, (moodHistory.length / 15) * 100);
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

      {/* Status section */}
      {(isLoading || loadingStats) && (
        <div className="px-4 py-3 border-b">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}
      {error && (
        <div className="px-4 py-3 border-b text-red-600 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Show usage stats if user is logged in and no errors */}
      {user && !isLoading && !loadingStats && !error && !hasError && (
        <div className="px-4 py-3 border-b">
          <UsageStats userId={user.id} />
        </div>
      )}

      {/* Collapsible widget sections */}
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

              {/* Section content */}
              {expandedSections.has(section.key) && (
                <div className="mt-2 px-3 pb-3">
                  {section.key === 'widgets' && (
                    <div className="space-y-4">
                      {/* Quick Stats */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Stats</h3>
                        {(isLoading || loadingStats) ? (
                          <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ) : sessionStats ? (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">Total Sessions: {sessionStats.totalSessions}</p>
                            <p className="text-gray-600">Video Sessions: {sessionStats.videoSessions}</p>
                            <p className="text-gray-600">Text Sessions: {sessionStats.textSessions}</p>
                            <p className="text-gray-600">Current Mood: {selectedMood}</p>
                            <p className="text-gray-600">Mood Entries: {moodHistory.length}</p>
                            {sessionStats.plan === 'free' && (
                              <div className="mt-2">
                                <p className="text-gray-600">Remaining Free Sessions: {sessionStats.remainingSessions}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className={`rounded-full h-2 ${
                                      calculateProgress() > 90 ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${calculateProgress()}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>

                      {/* Mood History */}
                      {moodHistory.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Moods</h3>
                          <div className="space-y-2">
                            {moodHistory.slice(-3).map((entry) => (
                              <div key={entry.id} className="text-sm text-gray-600 flex justify-between">
                                <span>{entry.mood}</span>
                                <span>{new Date(entry.start_time).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {section.key === 'exercises' && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Mini Mindfulness Library</h3>
                        <MindfulnessLibrary />
                      </div>
                    </div>
                  )}

                  {section.key === 'progress' && (
                    <div className="space-y-4">
                      {/* Session Progress */}
                      {!loadingStats && sessionStats && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">Session Progress</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Total Sessions Used</span>
                                <span>
                                  {sessionStats.totalSessions} / {PLAN_LIMITS.free.total_free_sessions || 15}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`rounded-full h-2 ${
                                    calculateProgress() > 90 ? 'bg-red-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${calculateProgress()}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mood Tracking Progress */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Mood Tracking Progress</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Mood Entries</span>
                              <span>{moodHistory.length} / 15</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`rounded-full h-2 ${
                                  calculateMoodProgress() > 90 ? 'bg-purple-500' : 'bg-purple-400'
                                }`}
                                style={{ width: `${calculateMoodProgress()}%` }}
                              />
                            </div>
                          </div>
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