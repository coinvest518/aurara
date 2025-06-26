import React, { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import { MoodTracker } from './MoodTracker';
import { ConversationInterface } from './ConversationInterface';
import { useWebRTC } from './WebRTCManager';
import { useTavus } from './TavusIntegration';
import { supabase } from '../supabaseClient';
import { getMoodHistory, type MoodHistoryItem } from '../services/moodService';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { User } from '@supabase/supabase-js';
import { ResponsiveVideo } from './ResponsiveVideo';

type MoodType = 'happy' | 'motivated' | 'stressed' | 'sad' | 'tired';

const Dashboard: React.FC = () => {
  const webrtc = useWebRTC();
  const tavus = useTavus();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [showPickPersonaToast, setShowPickPersonaToast] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryItem[]>([]);
  const [isMoodHistoryLoading, setIsMoodHistoryLoading] = useState(false);
  const [moodHistoryFetchFailed, setMoodHistoryFetchFailed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Split the auth and mood history fetching into separate useEffects
  useEffect(() => {
    // Only get auth session once when component mounts
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch(error => {
        console.error("Supabase auth error in Dashboard:", error);
        // Continue with null user
        setUser(null);
      });
  }, []);

  // Separate useEffect for mood history to avoid frequent retries
  useEffect(() => {
    // Only fetch mood history if we have a logged-in user
    if (user?.id) {
      // Create an AbortController to cancel fetch if component unmounts
      const controller = new AbortController();
      let isMounted = true;
      
      const fetchMoodHistory = async () => {
        try {
          // Only fetch if user has an ID and we're not already loading
          if (!user.id) return;
          
          // Don't fetch again if we already have mood history data
          if (moodHistory.length > 0) return;
          
          // Don't retry if previous attempt failed with network error
          if (moodHistoryFetchFailed) return;
          
          // Set loading state
          setIsMoodHistoryLoading(true);
          setMoodHistoryFetchFailed(false);
          
          const data = await getMoodHistory(user.id, { signal: controller.signal });
          // Only update state if component is still mounted
          if (isMounted) {
            setMoodHistory(data || []);
            setIsMoodHistoryLoading(false);
          }
        } catch (error: any) {
          // Only log once, not in a loop
          if (isMounted) {
            console.warn("Error fetching mood history, will not retry", error);
            // Set empty array to prevent repeated retries
            setMoodHistory([]);
            setIsMoodHistoryLoading(false);
            
            // Mark as failed if it's a network error
            if (error.message === 'TypeError: Failed to fetch' || 
                (error.details && error.details.includes('Failed to fetch'))) {
              setMoodHistoryFetchFailed(true);
            }
          }
        }
      };
      
      fetchMoodHistory();
      
      // Clean up function
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
  }, [user?.id]); // Only re-run if user ID changes

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

  const handleEndConversation = () => {
    webrtc.disconnect();
    tavus.endConversation();
    setConversationStarted(false);
  };

  const handlePersonaSelection = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col lg:flex-row relative">
      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden fixed bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => document.getElementById('leftSidebar')?.classList.toggle('-translate-x-full')}
          className="bg-white p-2 rounded-full shadow-lg text-blue-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={() => document.getElementById('rightSidebar')?.classList.toggle('translate-x-full')}
          className="bg-white p-2 rounded-full shadow-lg text-blue-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Left Sidebar */}
      <div
        id="leftSidebar"
        className="fixed lg:static inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative lg:flex w-80 max-w-full z-30"
      >
        <Sidebar
          personas={tavus.availablePersonas}
          selectedPersonaId={selectedPersonaId}
          onSelectPersona={handlePersonaSelection}
          onStartConversation={handleStartConversation}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 lg:px-8 min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mood summary - only show if user has mood history */}
          {moodHistory && moodHistory.length > 0 && (
            <div className="mb-4 text-center text-slate-700">
              Last mood: <span className="font-semibold">{moodHistory[moodHistory.length - 1]?.mood || 'No mood recorded'}</span>
            </div>
          )}

          {/* MoodTracker - show for all users */}
          <div className="flex justify-center mb-6">
            <MoodTracker selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>

          {/* Video Agent and Conversation UI */}
          {selectedPersonaId ? (
            <div className="flex flex-col space-y-4">
              {/* Mobile-adapted Video Agent */}
              <ResponsiveVideo
                isConnected={webrtc.isConnected}
                isVideoEnabled={webrtc.isVideoEnabled}
                isAudioEnabled={webrtc.isAudioEnabled}
                conversationUrl={tavus.conversationUrl || undefined}
                onVideoToggle={webrtc.toggleVideo}
                onAudioToggle={webrtc.toggleAudio}
                onEndCall={handleEndConversation}
                onFullscreen={() => {}} // Add empty handler for the onFullscreen prop
                participantCount={2}
                connectionQuality="good"
              />

              <div className="w-full h-[400px] bg-white rounded-lg shadow-lg">
                <ConversationInterface
                  isActive={conversationStarted}
                  isPaused={false}
                  onPauseToggle={() => {}}
                  onRestart={handleStartConversation}
                />
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-black/80 rounded-lg text-white">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                  <Video className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Choose your AI Persona</h2>
                <p className="text-gray-400 mb-8">Select a persona from the sidebar and click Start Conversation to begin your session.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <div
        id="rightSidebar"
        className="fixed lg:static inset-y-0 right-0 transform translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative lg:flex w-80 max-w-full z-30"
      >      <RightSidebar
        moodHistory={moodHistory}
        selectedMood={selectedMood}
        user={user}
        isLoading={isMoodHistoryLoading}
        hasError={moodHistoryFetchFailed}
      />
      </div>

      {/* Toast Messages */}
      {showPickPersonaToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Please select a persona first
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Persona selected successfully
        </div>
      )}
    </div>
  );
};

export default Dashboard;
