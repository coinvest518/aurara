import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { dailyService, DailyRoom } from '../services/dailyService';
import { validateApiKeys } from '../config/api';

interface WebRTCContextType {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number;
  bandwidth: number;
  currentRoom: DailyRoom | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isApiConfigured: boolean;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};

interface WebRTCProviderProps {
  children: React.ReactNode;
}

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [latency, setLatency] = useState(45);
  const [bandwidth, setBandwidth] = useState(2.5);
  const [currentRoom, setCurrentRoom] = useState<DailyRoom | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Check API configuration on mount
  useEffect(() => {
    const isConfigured = validateApiKeys();
    setIsApiConfigured(isConfigured);
  }, []);

  // Simulate connection quality monitoring
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Simulate varying connection metrics
      const newLatency = 20 + Math.random() * 80;
      const newBandwidth = 1 + Math.random() * 4;
      
      setLatency(Math.round(newLatency));
      setBandwidth(Math.round(newBandwidth * 10) / 10);

      // Determine quality based on metrics
      if (newLatency < 30 && newBandwidth > 3) {
        setConnectionQuality('excellent');
      } else if (newLatency < 50 && newBandwidth > 2) {
        setConnectionQuality('good');
      } else if (newLatency < 100 && newBandwidth > 1) {
        setConnectionQuality('fair');
      } else {
        setConnectionQuality('poor');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const connect = useCallback(async () => {
    if (!isApiConfigured) {
      console.error('Daily.co API key not configured');
      return;
    }

    setIsConnected(false);
    
    try {
      // Create a new room for the conversation
      const room = await dailyService.createRoom();
      setCurrentRoom(room);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      console.log('Connected to Daily.co room:', room.url);
    } catch (error) {
      console.error('Failed to connect to Daily.co:', error);
      // Fallback to mock connection for development
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
    }
  }, [isApiConfigured]);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
    
    // Clean up the room if it exists
    if (currentRoom) {
      try {
        await dailyService.deleteRoom(currentRoom.name);
        console.log('Deleted Daily.co room:', currentRoom.name);
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
      setCurrentRoom(null);
    }
  }, [currentRoom]);

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev);
    // In a real implementation, this would toggle the video track
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
    // In a real implementation, this would toggle the audio track
  }, []);

  const value: WebRTCContextType = {
    isConnected,
    isVideoEnabled,
    isAudioEnabled,
    connectionQuality,
    latency,
    bandwidth,
    currentRoom,
    connect,
    disconnect,
    toggleVideo,
    toggleAudio,
    isApiConfigured,
  };

  return (
    <WebRTCContext.Provider value={value}>
      {children}
    </WebRTCContext.Provider>
  );
};