import { API_CONFIG } from '../config/api';

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: {
    max_participants?: number;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
  };
}

export interface DailyMeeting {
  id: string;
  room: string;
  start_time: string;
  duration: number;
  participants: any[];
}

class DailyService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.daily.apiKey;
    this.baseUrl = API_CONFIG.daily.baseUrl;
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
      throw new Error(`Daily.co API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createRoom(name?: string): Promise<DailyRoom> {
    const payload = {
      name: name || `ai-agent-room-${Date.now()}`,
      properties: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: false,
        enable_recording: false,
        eject_at_room_exp: true,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // 2 hours from now
      }
    };

    return this.makeRequest(API_CONFIG.daily.endpoints.rooms, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getRoom(roomName: string): Promise<DailyRoom> {
    return this.makeRequest(`${API_CONFIG.daily.endpoints.rooms}/${roomName}`);
  }

  async deleteRoom(roomName: string): Promise<void> {
    await this.makeRequest(`${API_CONFIG.daily.endpoints.rooms}/${roomName}`, {
      method: 'DELETE',
    });
  }

  async getRooms(): Promise<DailyRoom[]> {
    const response = await this.makeRequest(API_CONFIG.daily.endpoints.rooms);
    return response.data || [];
  }

  async getMeetings(roomName?: string): Promise<DailyMeeting[]> {
    const endpoint = roomName 
      ? `${API_CONFIG.daily.endpoints.meetings}?room=${roomName}`
      : API_CONFIG.daily.endpoints.meetings;
    
    const response = await this.makeRequest(endpoint);
    return response.data || [];
  }
}

export const dailyService = new DailyService();