import React, { useEffect } from 'react';
import { useTavus } from '../TavusIntegration';
import { openaiService } from '../../services/openaiService';

interface OpenAIToolProps {}

export const OpenAITool: React.FC<OpenAIToolProps> = () => {
  const { registerTool } = useTavus();

  useEffect(() => {
    // Register the OpenAI completion tool
    registerTool('get_ai_completion', async (args: { 
      prompt: string; 
      context?: string;
      systemMessage?: string;
    }) => {
      const messages = [];

      if (args.systemMessage) {
        messages.push({
          role: 'system' as const,
          content: args.systemMessage
        });
      }

      if (args.context) {
        messages.push({
          role: 'system' as const,
          content: `Context: ${args.context}`
        });
      }

      messages.push({
        role: 'user' as const,
        content: args.prompt
      });

      const response = await openaiService.createCompletion(messages);
      return {
        response: response.choices[0]?.message?.content || ''
      };
    });

  }, [registerTool]);

  return null;
};
