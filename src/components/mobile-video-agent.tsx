import React, { useEffect, useState } from "react";
import {
  Video,
  VideoOff,
  MicOff,
  Mic,
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
  MoreVertical,
  MessageCircle,
  Users,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface MobileVideoAgentProps {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  conversationUrl?: string;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
  onEndCall: () => void;
  onShowChat?: () => void;
  onShowParticipants?: () => void;
  participantCount?: number;
  connectionQuality?: "excellent" | "good" | "fair" | "poor";
}

export const MobileVideoAgent: React.FC<MobileVideoAgentProps> = ({
  isConnected,
  isVideoEnabled,
  isAudioEnabled,
  conversationUrl,
  onVideoToggle,
  onAudioToggle,
  onEndCall,
  onShowChat,
  onShowParticipants,
  participantCount = 2,
  connectionQuality = "good",
}) => {
  // Removed unused videoRef
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (showControls && isConnected) {
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [showControls, isConnected]);

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-blue-500";
      case "fair":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "relative bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "w-full h-screen md:h-[70vh] md:rounded-lg"
      )}
    >
      {/* Video Content */}
      <div className="relative w-full h-full flex items-center justify-center" onClick={handleScreenTap}>
        {!isConnected && (
          <div className="text-center text-white z-10">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl font-medium">Connecting...</p>
            <p className="text-sm text-gray-400 mt-2">Establishing secure connection</p>
          </div>
        )}

        {isConnected && !isVideoEnabled && (
          <div className="text-center text-white z-10">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl font-medium">Camera Off</p>
            <p className="text-sm text-gray-400 mt-2">Tap to show controls</p>
          </div>
        )}

        {isConnected && isVideoEnabled && conversationUrl && (
          <iframe
            src={conversationUrl}
            className="w-full h-full object-cover"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ border: "none" }}
          />
        )}
      </div>

      {/* Top Status Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
            <div className={cn("w-2 h-2 rounded-full mr-2", getConnectionColor())}></div>
            <span className="text-white text-sm font-medium">{isConnected ? "Connected" : "Connecting"}</span>
          </div>
          {participantCount > 1 && (
            <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
              <Users className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-sm">{participantCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="text-white hover:bg-white/20 p-2 h-auto"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 h-auto">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Secondary Controls */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          {onShowChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowChat}
              className="text-white hover:bg-white/20 p-3 h-auto rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          )}
          {onShowParticipants && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowParticipants}
              className="text-white hover:bg-white/20 p-3 h-auto rounded-full"
            >
              <Users className="w-5 h-5" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-3 h-auto rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Primary Controls */}
        <div className="flex justify-center items-center space-x-6">
          <Button
            onClick={onVideoToggle}
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full p-0 transition-all duration-200",
              isVideoEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={onAudioToggle}
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full p-0 transition-all duration-200",
              isAudioEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={onEndCall}
            size="lg"
            className="w-16 h-16 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
      </div>

      {/* Swipe indicator for controls */}
      {!showControls && isConnected && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
            <ChevronUp className="w-4 h-4 text-white animate-bounce" />
            <span className="text-white text-sm">Tap for controls</span>
          </div>
        </div>
      )}
    </div>
  );
};
