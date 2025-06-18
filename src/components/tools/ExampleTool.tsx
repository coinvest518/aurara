import React, { useEffect } from 'react';
import { useTavus } from '../TavusIntegration';

interface ExampleToolProps {}

export const ExampleTool: React.FC<ExampleToolProps> = () => {
  const { registerTool } = useTavus();

  useEffect(() => {
    // Register a custom tool
    registerTool('get_user_details', async (args) => {
      // Example implementation
      return {
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          language: args.language || 'en',
          timezone: 'UTC'
        }
      };
    });
  }, [registerTool]);

  return null; // This is a utility component, no UI needed
};
