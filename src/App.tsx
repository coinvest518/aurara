import React, { useState, useEffect } from 'react';
import { VideoAgent } from './components/VideoAgent';
import { ConversationInterface } from './components/ConversationInterface';
import { StatusIndicator } from './components/StatusIndicator';
import { WebRTCProvider, useWebRTC } from './components/WebRTCManager';
import { TavusProvider, useTavus } from './components/TavusIntegration';
import { LandingPage } from './components/landing/LandingPage';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import type { User } from '@supabase/supabase-js';
import { MoodTracker, MoodOption } from './components/MoodTracker';
import { saveMoodToSession } from './services/moodService';
import { getMoodHistory } from './services/moodService';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar'; // Import RightSidebar


const MainApp: React.FC = () => {
  const webrtc = useWebRTC();
  const tavus = useTavus();
  const [showSettings, setShowSettings] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [showPickPersonaToast, setShowPickPersonaToast] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodOption['key']>('happy'); // Default to 'happy'
  const [conversationStarted, setConversationStarted] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryItem[]>([]);
  const [showToast, setShowToast] = useState(false); // State for the toast message


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
  useEffect(() => {
    if (user) {
      getMoodHistory(user.id)
        .then((data) => setMoodHistory(data || []))
        .catch(console.error);
    }
  }, [user, selectedMood]);



  const handleStartConversation = async () => {
    if (!selectedPersonaId) {
      setShowPickPersonaToast(true);
      setTimeout(() => setShowPickPersonaToast(false), 3000);
      return;
    }
    setConversationStarted(true);
    try {
      await webrtc.connect();
      await tavus.startConversation(selectedPersonaId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setConversationStarted(false);
    }
  };

  // Landing page only transitions to dashboard, does NOT start conversation
  if (!isDashboard) {
    return <LandingPage 
      onStartChat={async () => { setIsDashboard(true); setConversationStarted(false); }}
      isApiConfigured={webrtc.isApiConfigured && tavus.isApiConfigured}
    />;
  }

  const handleEndConversation = () => {
    webrtc.disconnect();
    tavus.endConversation();
    setIsDashboard(false);
    setConversationStarted(false);
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

  const handlePersonaSelection = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex">
      {/* Left Sidebar */}
      <Sidebar
        personas={tavus.availablePersonas}
        selectedPersonaId={selectedPersonaId}
        onSelectPersona={handlePersonaSelection}
        onStartConversation={handleStartConversation}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {/* Mood summary from moodHistory */}
        {moodHistory.length > 0 && (
          <div className="mb-4 text-center text-slate-700">
            Last mood: <span className="font-semibold">{moodHistory[moodHistory.length - 1].mood}</span> on {new Date(moodHistory[moodHistory.length - 1].start_time).toLocaleDateString()}
          </div>
        )}
        <div className="w-full max-w-4xl space-y-6">
          {/* Main content area */}
          {/* MoodTracker centered above video agent */}
          <div className="flex justify-center mb-6">
            <MoodTracker selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>
          {/* Video Agent and Conversation UI always shown if persona is picked */}
          {selectedPersonaId ? (
            <>
              <VideoAgent
                isConnected={conversationStarted ? webrtc.isConnected : false}
                isVideoEnabled={conversationStarted ? webrtc.isVideoEnabled : false}
                isAudioEnabled={conversationStarted ? webrtc.isAudioEnabled : false}
                conversationUrl={conversationStarted ? tavus.conversationUrl ?? undefined : undefined}
                onVideoToggle={webrtc.toggleVideo}
                onAudioToggle={webrtc.toggleAudio}
                onEndCall={handleEndConversation}
                onFullscreen={handleFullscreen}
              />
              <div className="h-96">
                <ConversationInterface
                  isActive={conversationStarted && tavus.conversationState === 'active'}
                  isPaused={conversationStarted && tavus.conversationState === 'paused'}
                  onPauseToggle={() => {
                    if (conversationStarted && tavus.conversationState === 'active') {
                      tavus.pauseConversation();
                    } else if (conversationStarted && tavus.conversationState === 'paused') {
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-24">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Choose your AI Persona to begin</h2>
              <p className="mb-8 text-slate-600">Select a persona from the sidebar and click Start Conversation.</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar
        moodHistory={moodHistory}
        selectedMood={selectedMood}
        user={user}
      />

      {/* Inline settings modal implementation */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowSettings(false)}
            >
              &times;
            </button>
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Settings</h2>
              <p>Adjust your preferences here.</p>
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
            </div>
          </div>
        </div>
      )}

      {/* Toast message for starting conversation */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
        }}>
          Press Start Conversation
        </div>
      )}
    </div>
  );
};

interface MoodHistoryItem {
  id: string;
  start_time: string;
  mood: 'happy' | 'motivated' | 'tired' | 'stressed' | 'sad';
}

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
