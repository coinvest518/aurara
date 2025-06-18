import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  async createCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    tools?: Array<{
      type: 'function';
      function: {
        name: string;
        description: string;
        parameters: Record<string, any>;
      };
    }>
  ) {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages,
        tools,
        tool_choice: 'auto'
      });

      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
