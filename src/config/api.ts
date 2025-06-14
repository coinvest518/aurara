// API Configuration
export const API_CONFIG = {
  tavus: {
    apiKey: import.meta.env.VITE_TAVUS_API_KEY,
    baseUrl: import.meta.env.VITE_TAVUS_API_URL || 'https://tavusapi.com/api',
    endpoints: {
      conversations: '/v1/conversations',
      personas: '/v1/personas',
      replicas: '/v1/replicas',
    }
  },
  daily: {
    apiKey: import.meta.env.VITE_DAILY_API_KEY,
    baseUrl: import.meta.env.VITE_DAILY_API_URL || 'https://api.daily.co/v1',
    endpoints: {
      rooms: '/rooms',
      meetings: '/meetings',
    }
  }
};

// Validate API keys on startup
export const validateApiKeys = () => {
  const missingKeys = [];
  
  if (!API_CONFIG.tavus.apiKey) {
    missingKeys.push('VITE_TAVUS_API_KEY');
  }
  
  if (!API_CONFIG.daily.apiKey) {
    missingKeys.push('VITE_DAILY_API_KEY');
  }
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
    return false;
  }
  
  return true;
};