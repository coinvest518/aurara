
export const API_CONFIG = {
  tavus: {
    apiKey: import.meta.env.VITE_TAVUS_API_KEY || '',
    baseUrl: 'https://tavusapi.com/v2',
    endpoints: {
      conversations: '/conversations',
      personas: '/personas',
      replicas: '/replicas'
    }
  },
  daily: {
    apiKey: import.meta.env.VITE_DAILY_API_KEY || '',
    baseUrl: 'https://api.daily.co/v1',
    endpoints: {
      rooms: '/rooms'
    }
  }
};

export const getApiConfig = () => {
  const tavusConfigured = !!API_CONFIG.tavus.apiKey;
  const dailyConfigured = !!API_CONFIG.daily.apiKey;
  
  return {
    tavus: {
      ...API_CONFIG.tavus,
      isConfigured: tavusConfigured
    },
    daily: {
      ...API_CONFIG.daily,
      isConfigured: dailyConfigured
    },
    allConfigured: tavusConfigured && dailyConfigured
  };
};

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
