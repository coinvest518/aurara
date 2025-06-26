import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { VideoAgent } from './VideoAgent';
import { MobileVideoAgent } from './mobile-video-agent';

interface ResponsiveVideoProps {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  conversationUrl?: string;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
  onEndCall: () => void;
  onFullscreen: () => void;
  onShowChat?: () => void;
  onShowParticipants?: () => void;
  participantCount?: number;
  connectionQuality?: "excellent" | "good" | "fair" | "poor";
}

export const ResponsiveVideo: React.FC<ResponsiveVideoProps> = (props) => {
  // Check if screen is mobile sized
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Use MobileVideoAgent for mobile screens, VideoAgent for larger screens
  return isMobile ? (
    <MobileVideoAgent 
      isConnected={props.isConnected}
      isVideoEnabled={props.isVideoEnabled}
      isAudioEnabled={props.isAudioEnabled}
      conversationUrl={props.conversationUrl}
      onVideoToggle={props.onVideoToggle}
      onAudioToggle={props.onAudioToggle}
      onEndCall={props.onEndCall}
      onShowChat={props.onShowChat}
      onShowParticipants={props.onShowParticipants}
      participantCount={props.participantCount}
      connectionQuality={props.connectionQuality}
    />
  ) : (
    <VideoAgent 
      isConnected={props.isConnected}
      isVideoEnabled={props.isVideoEnabled}
      isAudioEnabled={props.isAudioEnabled}
      conversationUrl={props.conversationUrl}
      onVideoToggle={props.onVideoToggle}
      onAudioToggle={props.onAudioToggle}
      onEndCall={props.onEndCall}
      onFullscreen={props.onFullscreen}
    />
  );
}
