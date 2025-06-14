import { API_CONFIG } from '../config/api';

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
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Tavus API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createConversation(personaId: string, replicaId?: string): Promise<TavusConversation> {
    const payload = {
      persona_id: personaId,
      replica_id: replicaId || undefined,
      conversation_name: `AI Agent Session ${Date.now()}`,
      callback_url: `${window.location.origin}/webhook/tavus`,
      properties: {
        max_duration: 1800,
        language: 'en',
        enable_recording: false
      }
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
    try {
      const response = await this.makeRequest('/personas');
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch personas from API:', error);
      // Return your specific persona as fallback
      return [{
        persona_id: 'pde7ef583431',
        persona_name: 'Empathy',
        system_prompt: 'You are an empathetic AI assistant.',
        default_replica_id: 'r9d30b0e55ac',
        context: 'Empathy persona for meaningful conversations'
      }];
    }
  }

  async getPersona(personaId: string): Promise<TavusPersona> {
    const response = await this.makeRequest(`/personas/${personaId}`);
    return response.data || response;
  }

  async getReplicas(): Promise<any[]> {
    return this.makeRequest(API_CONFIG.tavus.endpoints.replicas);
  }
}

export const tavusService = new TavusService();