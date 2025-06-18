import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tavusService, TavusConversation, TavusPersona } from '../services/tavusService';
import { validateApiKeys } from '../config/api';
import { TavusToolCallEvent } from '../types/tavus';
import { toolService } from '../services/toolService';

interface TavusContextType {
  conversationState: 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error';
  conversationDuration: number;
  turnCount: number;
  currentPersona: string;
  availablePersonas: TavusPersona[];
  currentConversationId: string | null;
  conversationUrl: string | null;
  currentConversation: TavusConversation | null;
  startConversation: (personaId?: string) => Promise<void>;
  pauseConversation: () => Promise<void>;
  resumeConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  restartConversation: () => Promise<void>;
  setPersona: (personaId: string) => void;
  isApiConfigured: boolean;
  handleToolCall: (event: TavusToolCallEvent) => Promise<any>;
  registerTool: (name: string, handler: (args: any) => Promise<any>) => void;
  saveSessionToSupabase: (params: {
    userId: string;
    personaId: string;
    startTime: string;
    endTime: string;
    transcript: string;
  }) => Promise<any>;
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
  const [currentPersona, setCurrentPersona] = useState('pde7ef583431'); // Default to Empathy persona
  const [availablePersonas, setAvailablePersonas] = useState<TavusPersona[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<TavusConversation | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Check API configuration on mount
  useEffect(() => {
    const isConfigured = validateApiKeys();
    setIsApiConfigured(isConfigured);
    
    if (isConfigured) {
      // Load personas
      const loadPersonas = async () => {
        try {
          const personas = await tavusService.getPersonas();
          setAvailablePersonas(personas);
          
          // Set Empathy persona as default, or first available if not found
          const empathyPersona = personas.find((p: TavusPersona) => p.persona_id === 'pde7ef583431');
          if (empathyPersona) {
            setCurrentPersona('pde7ef583431');
          } else if (personas.length > 0) {
            setCurrentPersona(personas[0].persona_id);
          }
        } catch (error) {
          console.error('Failed to fetch personas from API:', error);
          // Set fallback Empathy and Daniel personas
          setAvailablePersonas([
            {
              persona_id: 'pde7ef583431',
              persona_name: 'Empathy',
              system_prompt: 'You are Empathy, a versatile AI companion acting as both a trusted friend and a professional psychologist...',
              default_replica_id: 'r9d30b0e55ac',
              context: 'Empathy persona for meaningful conversations'
            },
            {
              persona_id: 'pfab762661bb',
              persona_name: 'Daniel',
              system_prompt: 'You are Daniel, a helpful and insightful AI persona.',
              default_replica_id: 'r292fa3a149f',
              context: 'Daniel persona for advice and support'
            }
          ]);
        }
      };
      
      loadPersonas();
    }
  }, []);

  // Timer for conversation duration
  useEffect(() => {
    if (conversationState === 'active') {
      const timer = setInterval(() => {
        setConversationDuration(prev => prev + 1);
      }, 1000);
      setIntervalId(timer);
      return () => clearInterval(timer);
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
      setCurrentConversation(conversation);
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
      if (currentConversation) {
        setCurrentConversation({
          ...currentConversation,
          status: 'paused'
        });
      }
      setConversationState('paused');
    } catch (error) {
      console.error('Failed to pause conversation:', error);
    }
  }, [currentConversationId, conversationState, currentConversation]);

  const resumeConversation = useCallback(async () => {
    if (!currentConversationId || conversationState !== 'paused') return;

    try {
      await tavusService.resumeConversation(currentConversationId);
      if (currentConversation) {
        setCurrentConversation({
          ...currentConversation,
          status: 'active'
        });
      }
      setConversationState('active');
    } catch (error) {
      console.error('Failed to resume conversation:', error);
    }
  }, [currentConversationId, conversationState, currentConversation]);

  const endConversation = useCallback(async () => {
    if (currentConversationId) {
      try {
        await tavusService.endConversation(currentConversationId);
        if (currentConversation) {
          setCurrentConversation({
            ...currentConversation,
            status: 'ended'
          });
        }
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
  }, [currentConversationId, intervalId, currentConversation]);

  const restartConversation = useCallback(async () => {
    if (currentConversationId) {
      await endConversation();
    }
    
    setConversationState('idle');
    setConversationDuration(0);
    setTurnCount(0);
    setCurrentConversationId(null);
    setCurrentConversation(null);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [currentConversationId, endConversation, intervalId]);

  const setPersona = useCallback((personaId: string) => {
    setCurrentPersona(personaId);
  }, []);

  // Add tool handling
  const handleToolCall = useCallback(async (event: TavusToolCallEvent) => {
    if (!isApiConfigured || !currentConversationId) {
      throw new Error('Not configured or no active conversation');
    }

    try {
      return await toolService.handleToolCall(event);
    } catch (error) {
      console.error('Error handling tool call:', error);
      throw error;
    }
  }, [isApiConfigured, currentConversationId]);

  const registerTool = useCallback((name: string, handler: (args: any) => Promise<any>) => {
    toolService.registerTool(name, handler);
  }, []);

  // Add this method to the context value
  const value: TavusContextType & { saveSessionToSupabase: typeof tavusService.saveSessionToSupabase } = {
    ...{
      conversationState,
      conversationDuration,
      turnCount,
      currentPersona,
      availablePersonas,
      currentConversationId,
      currentConversation,
      conversationUrl,
      startConversation,
      pauseConversation,
      resumeConversation,
      endConversation,
      restartConversation,
      setPersona,
      isApiConfigured,
      handleToolCall,
      registerTool,
    },
    saveSessionToSupabase: tavusService.saveSessionToSupabase.bind(tavusService),
  };

  return (
    <TavusContext.Provider value={value}>
      {children}
    </TavusContext.Provider>
  );
};