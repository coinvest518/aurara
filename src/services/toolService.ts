import { TavusToolCallEvent } from '../types/tavus';

class ToolService {
  private registeredTools: Map<string, (args: any) => Promise<any>>;

  constructor() {
    this.registeredTools = new Map();
  }

  // Register a new tool
  registerTool(name: string, handler: (args: any) => Promise<any>) {
    this.registeredTools.set(name, handler);
  }

  // Handle a tool call event
  async handleToolCall(event: TavusToolCallEvent) {
    const { name, arguments: argsStr } = event.properties;
    const handler = this.registeredTools.get(name);

    if (!handler) {
      throw new Error(`No handler registered for tool: ${name}`);
    }

    try {
      const args = JSON.parse(argsStr);
      return await handler(args);
    } catch (error) {
      console.error(`Error handling tool call ${name}:`, error);
      throw error;
    }
  }
}

export const toolService = new ToolService();

// Example tool registration:
toolService.registerTool('get_current_weather', async (args) => {
  // Implementation would go here
  console.log('Weather request for:', args.location);
  return {
    temperature: 22,
    unit: args.unit || 'celsius',
    conditions: 'sunny'
  };
});
