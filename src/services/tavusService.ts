import { API_CONFIG } from '../config/api';
import { saveConversationSession } from './conversationSessionService';

export interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error';
  persona_id: string;
  replica_id?: string;
  session_id?: string;
  participant_id?: string;
}

export interface TavusPersona {
  persona_id: string;
  persona_name: string;
  system_prompt: string;
  default_replica_id: string;
  context?: string;
}

interface ConversationOptions {
  webhook_events?: string[];
  session_id?: string;
  participant_id?: string;
  max_duration_seconds?: number;
  conversation_config?: {
    enable_interruptions?: boolean;
    enable_real_time_response?: boolean;
    enable_custom_wake_word?: boolean;
    wake_word?: string;
  };
  conversational_context?: string;
  custom_greeting?: string;
  properties?: Record<string, any>;
}

class TavusService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.tavus.apiKey;
    this.baseUrl = API_CONFIG.tavus.baseUrl;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Tavus API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Tavus API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Tavus API request failed:', error);
      throw error;
    }
  }

  async createConversation(
    personaId: string,
    replicaId?: string,
    options: ConversationOptions = {}
  ): Promise<TavusConversation> {
    // Build payload according to Tavus API docs
    const payload: any = {
      persona_id: personaId,
      conversation_name: `AI Agent Session ${new Date().toISOString()}`,
      // Only include replica_id if provided
      ...(replicaId ? { replica_id: replicaId } : {}),
      // Only include callback_url if needed
      callback_url: `${window.location.origin}/api/webhook/tavus`,
    };
    // Optionally add conversational_context, custom_greeting, properties if provided in options
    if (options['conversational_context']) {
      payload.conversational_context = options['conversational_context'];
    }
    if (options['custom_greeting']) {
      payload.custom_greeting = options['custom_greeting'];
    }
    if (options['properties']) {
      payload.properties = options['properties'];
    }
    try {
      return await this.makeRequest('/v2/conversations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<TavusConversation> {
    return this.makeRequest(`${API_CONFIG.tavus.endpoints.conversations}/${conversationId}`);
  }

  async endConversation(conversationId: string): Promise<void> {
    await this.makeRequest(`${API_CONFIG.tavus.endpoints.conversations}/${conversationId}/end`, {
      method: 'POST',
    });
  }

  async pauseConversation(conversationId: string): Promise<void> {
    await this.makeRequest(`${API_CONFIG.tavus.endpoints.conversations}/${conversationId}/pause`, {
      method: 'POST',
    });
  }

  async resumeConversation(conversationId: string): Promise<void> {
    await this.makeRequest(`${API_CONFIG.tavus.endpoints.conversations}/${conversationId}/resume`, {
      method: 'POST',
    });
  }

  async getPersonas(): Promise<TavusPersona[]> {
    // Always return only Empathy and Daniel
    return [
      {
        persona_id: 'pde7ef583431',
        persona_name: 'Empathy',
        system_prompt: 'You are Empathy, a versatile AI companion...',
        default_replica_id: 'r9d30b0e55ac',
        context: 'Empathy persona for meaningful conversations'
      },
      {
        persona_id: 'pfab762661bb',
        persona_name: 'Daniel',
        system_prompt: 'You are Daniel, a helpful and insightful AI persona.',
        default_replica_id: 'r292fa3a149f',
        context: 'Daniel persona for advice and support'
      },
      {
        persona_id: 'pd092acfe184',
        persona_name: 'Anna',
        system_prompt: 'You are Anna, a creative and energetic AI persona.',
        default_replica_id: 'r4dcf31b60e1',
        context: 'Anna persona for creative brainstorming and motivation'
      },
      {
        persona_id: 'p60bf9c1b7e7',
        persona_name: 'Rose',
        system_prompt: 'You are Rose, a thoughtful and encouraging AI persona.',
        default_replica_id: 'r90105daccb4',
        context: 'Rose persona for positive support and motivation'
      },
      {
        persona_id: 'p0066621812a',
        persona_name: 'Kiki',
        system_prompt: 'You are Kiki, a thoughtful and encouraging Homegirl.',
        default_replica_id: 'r5a93231d122',
        context: 'Rose persona for positive support and motivation'
      },
       {
        persona_id: 'pabbaa4a7bc2',
        persona_name: 'Mark',
        system_prompt: 'Im Mark you addiction specialist, I can help you with addiction recovery and support.',
        default_replica_id: 'r92debe21318',
        context: 'Mark persona for addiction recovery and support'
      }
    ];
  }

  async getPersona(personaId: string): Promise<TavusPersona> {
    const response = await this.makeRequest(`/personas/${personaId}`);
    return response.data || response;
  }

  async getReplicas(): Promise<any[]> {
    return this.makeRequest(API_CONFIG.tavus.endpoints.replicas);
  }

  // Add a method to save conversation/session to Supabase
  async saveSessionToSupabase({ userId, personaId, startTime, endTime, transcript }: {
    userId: string;
    personaId: string;
    startTime: string;
    endTime: string;
    transcript: string;
  }) {
    const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
    return saveConversationSession({
      user_id: userId,
      persona_id: personaId,
      start_time: startTime,
      end_time: endTime,
      duration,
      transcript,
    });
  }

  async getConversationStatus(conversationId: string): Promise<{
    status: TavusConversation['status'];
    metrics?: {
      duration_seconds: number;
      turn_count: number;
      speaker_switches: number;
    };
  }> {
    return this.makeRequest(`/v2/conversations/${conversationId}/status`);
  }

  async validatePersonaAndReplica(personaId: string, replicaId?: string): Promise<boolean> {
    try {
      const personas = await this.getPersonas();
      const persona = personas.find(p => p.persona_id === personaId);
      if (replicaId) {
        const matchingPersona = personas.find(p => p.persona_id === personaId);
        return !!persona && (!replicaId || matchingPersona?.default_replica_id === replicaId);
      }
      return !!persona;
    } catch {
      return false;
    }
  }
}

export const tavusService = new TavusService();