import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Pause, Play, RotateCcw } from 'lucide-react';

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
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  isActive,
  isPaused,
  onPauseToggle,
  onRestart,
}) => {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isActive) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate agent typing response
    setIsTyping(true);
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand. Let me help you with that. This is a simulated response from the AI agent.',
        timestamp: new Date(),
        sender: 'agent'
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Conversation</h3>
              <p className="text-sm text-blue-100">
                {isActive ? (isPaused ? 'Paused' : 'Active') : 'Inactive'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onPauseToggle}
              disabled={!isActive}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onRestart}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isActive ? (isPaused ? 'Conversation paused...' : 'Type your message...') : 'Start conversation to chat...'}
            disabled={!isActive || isPaused}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isActive || isPaused || !inputMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};