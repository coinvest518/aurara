export interface TavusToolCallEvent {
  message_type: 'conversation';
  event_type: 'conversation.tool_call';
  conversation_id: string;
  inference_id: string;
  properties: {
    name: string;
    arguments: string;
  };
}

export type TavusEvent = TavusToolCallEvent; // Add more event types as needed

export interface ToolFunction {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      required: string[];
    };
  };
}

export interface TavusLayerConfig {
  llm?: {
    model: string;
    tools: ToolFunction[];
  };
}
