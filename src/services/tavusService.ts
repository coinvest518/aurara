import { API_CONFIG } from '../config/api';

export interface TavusConversation {
  id: string;
  status: 'idle' | 'connecting' | 'active' | 'paused' | 'ended';
  personaId: string;
  replicaId: string;
}

export interface TavusPersona {
  id: string;
  name: string;
  description: string;
  voice: string;
  personality: string;
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
      replica_id: replicaId,
      properties: {
        max_duration: 1800, // 30 minutes
        language: 'en',
      }
    };

    return this.makeRequest(API_CONFIG.tavus.endpoints.conversations, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
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
    return this.makeRequest(API_CONFIG.tavus.endpoints.personas);
  }

  async getReplicas(): Promise<any[]> {
    return this.makeRequest(API_CONFIG.tavus.endpoints.replicas);
  }
}

export const tavusService = new TavusService();