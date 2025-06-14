import React, { useState, useEffect } from 'react';
import { VideoAgent } from './components/VideoAgent';
import { ConversationInterface } from './components/ConversationInterface';
import { StatusIndicator } from './components/StatusIndicator';
import { WebRTCProvider, useWebRTC } from './components/WebRTCManager';
import { TavusProvider, useTavus } from './components/TavusIntegration';
import { Play, Settings, User, Bot, AlertTriangle } from 'lucide-react';

const MainApp: React.FC = () => {
  const webrtc = useWebRTC();
  const tavus = useTavus();
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleStartConversation = async () => {
    try {
      await webrtc.connect();
      await tavus.startConversation();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleEndConversation = () => {
    webrtc.disconnect();
    tavus.endConversation();
    setIsInitialized(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Check if APIs are configured
  const isApiConfigured = webrtc.isApiConfigured && tavus.isApiConfigured;

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
                <h1 className="text-xl font-bold text-slate-800">AI Video Agent</h1>
                <p className="text-sm text-slate-600">Conversational AI Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isApiConfigured && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>API Keys Required</span>
                </div>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>Guest User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isInitialized ? (
          /* Welcome Screen */
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <div className="text-center space-y-8 max-w-2xl">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-800">
                  Welcome to AI Video Agent
                </h2>
                <p className="text-xl text-slate-600">
                  Start a conversation with our advanced AI agent powered by Tavus CVI technology
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isApiConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                    <span>Real-time Video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${tavus.isApiConfigured ? 'bg-blue-400' : 'bg-amber-400'}`}></div>
                    <span>Natural Conversation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${webrtc.isApiConfigured ? 'bg-teal-400' : 'bg-amber-400'}`}></div>
                    <span>WebRTC Powered</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStartConversation}
                disabled={webrtc.isConnected || !isApiConfigured}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className="w-6 h-6" />
                <span>{isApiConfigured ? 'Start Conversation' : 'Configure API Keys'}</span>
              </button>

              {!isApiConfigured && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-left">
                  <h3 className="font-semibold text-amber-800 mb-2">API Configuration Required</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    To use the AI Video Agent, you need to configure your API keys in the environment file.
                  </p>
                  <div className="space-y-2 text-sm text-amber-700">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${tavus.isApiConfigured ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <span>Tavus API Key: {tavus.isApiConfigured ? 'Configured' : 'Missing'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${webrtc.isApiConfigured ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <span>Daily.co API Key: {webrtc.isApiConfigured ? 'Configured' : 'Missing'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">Advanced AI</h3>
                  <p className="text-sm text-slate-600">Powered by Tavus Phoenix-3 and Raven-0 models for natural interactions</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">Real-time Video</h3>
                  <p className="text-sm text-slate-600">WebRTC technology ensures low-latency, high-quality video communication</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">Smart Conversations</h3>
                  <p className="text-sm text-slate-600">Context-aware responses with natural turn-taking and conversation flow</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Interface */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Video Agent - Main Area */}
            <div className="lg:col-span-3 space-y-6">
              <VideoAgent
                isConnected={webrtc.isConnected}
                isVideoEnabled={webrtc.isVideoEnabled}
                isAudioEnabled={webrtc.isAudioEnabled}
                conversationUrl={tavus.conversationUrl}
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
                />
              </div>
            </div>

            {/* Sidebar */}
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

              {/* Persona Selection */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Persona</h3>
                <div className="space-y-2">
                  {tavus.availablePersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => tavus.setPersona(persona.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        tavus.currentPersona === persona.id
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="font-medium">{persona.name}</div>
                      <div className="text-xs opacity-75">{persona.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Information */}
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
          </div>
        )}
      </main>
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