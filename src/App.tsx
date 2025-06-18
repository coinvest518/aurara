import React, { useState, useEffect } from 'react';
import { VideoAgent } from './components/VideoAgent';
import { ConversationInterface } from './components/ConversationInterface';
import { StatusIndicator } from './components/StatusIndicator';
import { WebRTCProvider, useWebRTC } from './components/WebRTCManager';
import { TavusProvider, useTavus } from './components/TavusIntegration';
import { LandingPage } from './components/landing/LandingPage';
import { Settings, Bot } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import type { User } from '@supabase/supabase-js';
import { ConversationHistory } from './components/ConversationHistory';
import { MoodTracker, MoodOption } from './components/MoodTracker';
import { saveMoodToSession } from './services/moodService';
import { ExampleTool } from './components/tools/ExampleTool';
import { OpenAITool } from './components/tools/OpenAITool';

const MainApp: React.FC = () => {
  const webrtc = useWebRTC();
  const tavus = useTavus();
  const [showSettings, setShowSettings] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [customDescriptions, setCustomDescriptions] = useState<{ [personaId: string]: string }>({});
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [tempDescription, setTempDescription] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [showPickPersonaToast, setShowPickPersonaToast] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodOption['key']>('happy'); // Default to 'happy'

  // On mount, check for existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Save mood to session when selected
  useEffect(() => {
    if (selectedMood && tavus.currentConversationId && user) {
      saveMoodToSession(tavus.currentConversationId, selectedMood).catch(console.error);
    }
  }, [selectedMood, tavus.currentConversationId, user]);

  // Fetch mood history for MoodChart
  // Fetch mood history for MoodChart
    // Removed unused moodHistory effect
  const handleStartConversation = async () => {
    if (!selectedPersonaId) {
      setShowPickPersonaToast(true);
      setTimeout(() => setShowPickPersonaToast(false), 3000);
      return;
    }
    try {
      await webrtc.connect();
      await tavus.startConversation(selectedPersonaId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // Landing page only transitions to dashboard, does NOT start conversation
  if (!isDashboard) {
    return <LandingPage 
      onStartChat={async () => { setIsDashboard(true); }}
      isApiConfigured={webrtc.isApiConfigured && tavus.isApiConfigured}
    />;
  }

  const handleEndConversation = () => {
    webrtc.disconnect();
    tavus.endConversation();
    setIsDashboard(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!user) {
    return <Auth onAuthSuccess={async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">My Buddy</h1>
                <p className="text-sm text-slate-600">AI Friend & Confidant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
              >
                Logout
              </button>
              <button
                onClick={handleEndConversation}
                className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mood Tracker Section (horizontal tab, no MoodChart) */}
      <div className="max-w-2xl mx-auto mt-6 mb-2 bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">How are you feeling today?</h2>
        <MoodTracker selectedMood={selectedMood as MoodOption['key']} onSelectMood={setSelectedMood} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tools Section: Only show when dashboard is active and a conversation is started */}
        {isDashboard && tavus.currentConversationId && (
          <div className="mb-6 flex flex-col gap-4">
            <ExampleTool />
            <OpenAITool />
          </div>
        )}
        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Agent - Main Area */}
          <div className="lg:col-span-3 space-y-6">
            <VideoAgent
              isConnected={webrtc.isConnected}
              isVideoEnabled={webrtc.isVideoEnabled}
              isAudioEnabled={webrtc.isAudioEnabled}
              conversationUrl={tavus.conversationUrl ?? undefined}
              onVideoToggle={webrtc.toggleVideo}
              onAudioToggle={webrtc.toggleAudio}
              onEndCall={handleEndConversation}
              onFullscreen={handleFullscreen}
            />
            
            {/* Conversation Interface */}
            <div className="h-96">
              <ConversationInterface
                isActive={tavus.conversationState === 'active'}
                isPaused={tavus.conversationState === 'paused'}
                onPauseToggle={() => {
                  if (tavus.conversationState === 'active') {
                    tavus.pauseConversation();
                  } else if (tavus.conversationState === 'paused') {
                    tavus.resumeConversation();
                  }
                }}
                onRestart={tavus.restartConversation}
                onSessionEnd={async (transcript, start, end) => {
                  if (user && selectedPersonaId) {
                    try {
                      await tavus.saveSessionToSupabase({
                        userId: user.id,
                        personaId: selectedPersonaId,
                        startTime: start.toISOString(),
                        endTime: end.toISOString(),
                        transcript,
                      });
                    } catch (e) {
                      console.error('Failed to save session:', e);
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Persona Selection */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Persona</h3>
              <div className="space-y-2">
                {tavus.availablePersonas.map((persona) => (
                  <div key={persona.persona_id} className="mb-2">
                    <div
                      onClick={() => setSelectedPersonaId(persona.persona_id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedPersonaId === persona.persona_id
                          ? 'bg-blue-200 text-blue-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      role="button"
                      onKeyPress={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedPersonaId(persona.persona_id);
                        }
                      }}
                    >
                      <div className="font-medium flex items-center justify-between">
                        {persona.persona_name}
                        <button
                          type="button"
                          className="ml-2 text-xs text-blue-500 underline hover:text-blue-700"
                          onClick={e => {
                            e.stopPropagation();
                            setEditingPersonaId(persona.persona_id);
                            setTempDescription(customDescriptions[persona.persona_id] || '');
                          }}
                        >
                          Edit Description
                        </button>
                      </div>
                      <div className="text-xs opacity-75">
                        {customDescriptions[persona.persona_id] || (persona.context ? persona.context.slice(0, 50) + (persona.context.length > 50 ? '...' : '') : 'AI Persona')}
                      </div>
                    </div>
                    {editingPersonaId === persona.persona_id && (
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 text-xs"
                          value={tempDescription}
                          onChange={e => setTempDescription(e.target.value)}
                          placeholder="Enter your own description..."
                          maxLength={100}
                        />
                        <div className="flex gap-2">
                          <button
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => {
                              setCustomDescriptions(prev => ({ ...prev, [persona.persona_id]: tempDescription }));
                              setEditingPersonaId(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            onClick={() => setEditingPersonaId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Conversation History Tab/Section */}
                    {selectedPersonaId === persona.persona_id && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Conversation History</h4>
                        <ConversationHistory personaId={persona.persona_id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Start Conversation Button */}
            {!isDashboard && (
              <button
                onClick={handleStartConversation}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                disabled={!selectedPersonaId}
              >
                Start Conversation
              </button>
            )}
          </div>
        </div>

        {/* Toast for pick persona */}
        {showPickPersonaToast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            Please select a persona before starting the conversation.
          </div>
        )}

        {/* Settings Modal */}
        <SettingsModal open={showSettings} onClose={() => setShowSettings(false)}>
          <div className="space-y-6">
            <StatusIndicator
              connection={{
                connected: webrtc.isConnected,
                quality: webrtc.connectionQuality,
                latency: webrtc.latency,
                bandwidth: webrtc.bandwidth,
              }}
              conversation={{
                state: tavus.conversationState,
                duration: tavus.conversationDuration,
                turnCount: tavus.turnCount,
              }}
            />
            {webrtc.currentRoom && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Room Info</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">Room:</span> {webrtc.currentRoom.name}
                  </div>
                  <div>
                    <span className="font-medium">URL:</span>
                    <a href={webrtc.currentRoom.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      Join Link
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SettingsModal>
      </main>
    </div>
  );
};

// Settings Modal Component
const SettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-md relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
          onClick={onClose}
          aria-label="Close settings"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Settings</h2>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <WebRTCProvider>
      <TavusProvider>
        <MainApp />
      </TavusProvider>
    </WebRTCProvider>
  );
}

export default App;