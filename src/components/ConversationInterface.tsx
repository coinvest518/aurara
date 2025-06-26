import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, History, Settings } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'agent';
}

interface ConversationInterfaceProps {
  isActive: boolean;
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  onSessionEnd?: (transcript: string, startTime: Date, endTime: Date) => void;
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  isActive,
  isPaused,
  onPauseToggle,
  onRestart,
  onSessionEnd,
}) => {
  const { canUseFeature } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI video agent. How can I help you today?',
      timestamp: new Date(),
      sender: 'agent'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  useEffect(() => {
    if (isActive && !sessionStart) {
      setSessionStart(new Date());
    }
    if (!isActive && sessionStart) {
      const endTime = new Date();
      if (onSessionEnd) {
        onSessionEnd(
          messages.map((msg) => msg.text).join('\n'),
          sessionStart,
          endTime
        );
      }
      setSessionStart(null);
    }
  }, [isActive, messages, onSessionEnd, sessionStart]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: inputMessage, sender: 'user', timestamp: new Date() }
      ]);
      setInputMessage('');
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Conversation</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            isPaused ? 'bg-yellow-500' : 'bg-green-500'
          } text-white`}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onRestart}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={onPauseToggle}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100'
              }`}
            >
              <p>{message.text}</p>
              <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && canUseFeature('sendMessage')) {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={() => {
              if (canUseFeature('sendMessage')) {
                handleSendMessage();
              } else {
                alert('Feature not available');
              }
            }}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};