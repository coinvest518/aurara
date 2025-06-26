import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, MicOff, PhoneOff, Settings, Maximize2 } from 'lucide-react';

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
    if (videoRef.current && isConnected) {
      videoRef.current.srcObject = null;
    }
  }, [isConnected]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreen();
  };

  return (
    <div className={`relative bg-[#000913] aspect-video overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
            <span className="text-white text-sm">{isConnected ? 'Connected' : 'Connecting'}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-black/20 rounded-full">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {!isConnected && (
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Establishing connection...</p>
          </div>
        )}
        {isConnected && !isVideoEnabled && (
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Video className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-lg">Video disabled</p>
          </div>
        )}
        {isConnected && isVideoEnabled && conversationUrl && (
          <iframe
            src={conversationUrl}
            className="w-full h-full"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3">
        <button
          onClick={onVideoToggle}
          className={`p-3 rounded-full ${
            isVideoEnabled ? 'bg-red-500/90' : 'bg-red-500'
          }`}
        >
          <VideoOff className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onAudioToggle}
          className={`p-3 rounded-full ${
            isAudioEnabled ? 'bg-red-500/90' : 'bg-red-500'
          }`}
        >
          <MicOff className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-500"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleFullscreen}
          className="p-3 rounded-full bg-[#1a1a1a]"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};