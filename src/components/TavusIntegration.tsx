import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tavusService, TavusConversation, TavusPersona } from '../services/tavusService';
import { validateApiKeys } from '../config/api';

interface TavusContextType {
  conversationState: 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error';
  conversationDuration: number;
  turnCount: number;
  currentPersona: string;
  availablePersonas: TavusPersona[];
  currentConversationId: string | null;
  conversationUrl: string | null;
  startConversation: (personaId?: string) => Promise<void>;
  pauseConversation: () => Promise<void>;
  resumeConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  restartConversation: () => Promise<void>;
  setPersona: (personaId: string) => void;
  isApiConfigured: boolean;
}

const TavusContext = createContext<TavusContextType | null>(null);

export const useTavus = () => {
  const context = useContext(TavusContext);
  if (!context) {
    throw new Error('useTavus must be used within a TavusProvider');
  }
  return context;
};

interface TavusProviderProps {
  children: React.ReactNode;
}

export const TavusProvider: React.FC<TavusProviderProps> = ({ children }) => {
  const [conversationState, setConversationState] = useState<'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error'>('idle');
  const [conversationDuration, setConversationDuration] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [currentPersona, setCurrentPersona] = useState('pde7ef583431');
  const [availablePersonas, setAvailablePersonas] = useState<TavusPersona[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Check API configuration on mount
  useEffect(() => {
    const isConfigured = validateApiKeys();
    setIsApiConfigured(isConfigured);
    
    if (isConfigured) {
      loadPersonas();
    }
  }, []);

  // Load available personas from Tavus API
  const loadPersonas = async () => {
    try {
      const personas = await tavusService.getPersonas();
      setAvailablePersonas(personas);
      
      // Set default persona if available
      if (personas.length > 0) {
        setCurrentPersona(personas[0].id);
      }
    } catch (error) {
      console.error('Failed to load personas:', error);
      // Fallback to mock personas if API fails
      setAvailablePersonas([
        { id: 'default', name: 'Default', description: 'Default AI persona', voice: 'neutral', personality: 'professional' },
        { id: 'professional', name: 'Professional', description: 'Business-focused persona', voice: 'formal', personality: 'professional' },
        { id: 'friendly', name: 'Friendly', description: 'Casual and approachable', voice: 'warm', personality: 'friendly' },
        { id: 'expert', name: 'Expert', description: 'Technical specialist', voice: 'confident', personality: 'expert' },
        { id: 'casual', name: 'Casual', description: 'Relaxed conversation style', voice: 'casual', personality: 'casual' }
      ]);
    }
  };

  // Timer for conversation duration
  useEffect(() => {
    if (conversationState === 'active') {
      const id = setInterval(() => {
        setConversationDuration(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [conversationState]);

  const startConversation = useCallback(async (personaId?: string) => {
    if (!isApiConfigured) {
      console.error('API keys not configured');
      setConversationState('error');
      return;
    }

    setConversationState('connecting');
    
    const selectedPersona = personaId || currentPersona;
    if (personaId) {
      setCurrentPersona(personaId);
    }

    try {
      const conversation = await tavusService.createConversation(selectedPersona);
      setCurrentConversationId(conversation.conversation_id);
      setConversationUrl(conversation.conversation_url);
      setConversationState('active');
      setConversationDuration(0);
      setTurnCount(0);
      console.log('Tavus conversation started:', conversation.conversation_url);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setConversationState('error');
    }
  }, [currentPersona, isApiConfigured]);

  const pauseConversation = useCallback(async () => {
    if (!currentConversationId || conversationState !== 'active') return;

    try {
      await tavusService.pauseConversation(currentConversationId);
      setConversationState('paused');
    } catch (error) {
      console.error('Failed to pause conversation:', error);
    }
  }, [currentConversationId, conversationState]);

  const resumeConversation = useCallback(async () => {
    if (!currentConversationId || conversationState !== 'paused') return;

    try {
      await tavusService.resumeConversation(currentConversationId);
      setConversationState('active');
    } catch (error) {
      console.error('Failed to resume conversation:', error);
    }
  }, [currentConversationId, conversationState]);

  const endConversation = useCallback(async () => {
    if (currentConversationId) {
      try {
        await tavusService.endConversation(currentConversationId);
      } catch (error) {
        console.error('Failed to end conversation:', error);
      }
    }

    setConversationState('ended');
    setCurrentConversationId(null);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [currentConversationId, intervalId]);

  const restartConversation = useCallback(async () => {
    if (currentConversationId) {
      await endConversation();
    }
    
    setConversationState('idle');
    setConversationDuration(0);
    setTurnCount(0);
    setCurrentConversationId(null);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [currentConversationId, endConversation, intervalId]);

  const setPersona = useCallback((personaId: string) => {
    setCurrentPersona(personaId);
  }, []);

  const value: TavusContextType = {
    conversationState,
    conversationDuration,
    turnCount,
    currentPersona,
    availablePersonas,
    currentConversationId,
    conversationUrl,
    startConversation,
    pauseConversation,
    resumeConversation,
    endConversation,
    restartConversation,
    setPersona,
    isApiConfigured,
  };

  return (
    <TavusContext.Provider value={value}>
      {children}
    </TavusContext.Provider>
  );
};