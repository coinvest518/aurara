import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Maximize2 } from 'lucide-react';

interface VideoAgentProps {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  conversationUrl?: string;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
  onEndCall: () => void;
  onFullscreen: () => void;
}

export const VideoAgent: React.FC<VideoAgentProps> = ({
  isConnected,
  isVideoEnabled,
  isAudioEnabled,
  conversationUrl,
  onVideoToggle,
  onAudioToggle,
  onEndCall,
  onFullscreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Placeholder for WebRTC video stream setup
    if (videoRef.current && isConnected) {
      // This would be replaced with actual Daily.co stream
      videoRef.current.srcObject = null;
    }
  }, [isConnected]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreen();
  };

  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'aspect-video'
    }`}>
      {/* AI Agent Video Display */}
      <div className="relative w-full h-full">
        {isConnected && isVideoEnabled && conversationUrl ? (
          <iframe
            src={conversationUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ borderRadius: '1rem' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Video className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">AI Agent</h3>
                <p className="text-slate-300 text-sm">
                  {isConnected ? 'Video disabled' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status Overlay */}
        {!isConnected && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white font-medium">Establishing connection...</p>
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg">
            <button
              onClick={onVideoToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isVideoEnabled
                  ? 'bg-slate-700/80 hover:bg-slate-600/80 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onAudioToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? 'bg-slate-700/80 hover:bg-slate-600/80 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onEndCall}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 text-white shadow-lg"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

            <button
              onClick={handleFullscreen}
              className="p-3 rounded-full bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-200 text-white"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Status Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
            <span className="text-white text-sm font-medium">
              {isConnected ? 'Connected' : 'Connecting'}
            </span>
          </div>
          
          <button className="p-2 rounded-full bg-black/40 backdrop-blur-lg hover:bg-black/60 transition-all duration-200 text-white">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};