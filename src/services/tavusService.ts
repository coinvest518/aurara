import { API_CONFIG } from '../config/api';
import { saveConversationSession } from './conversationSessionService';

export interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'ended';
  persona_id: string;
  replica_id?: string;
}

export interface TavusPersona {
  persona_id: string;
  persona_name: string;
  system_prompt: string;
  default_replica_id: string;
  context?: string;
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

    return response.json();
  }

  async createConversation(personaId: string, replicaId?: string): Promise<TavusConversation> {
    const payload = {
      persona_id: personaId,
      replica_id: replicaId || undefined,
      conversation_name: `AI Agent Session ${Date.now()}`,
      callback_url: `${window.location.origin}/webhook/tavus`
    };

    const response = await this.makeRequest('/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data || response;
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
}

export const tavusService = new TavusService();