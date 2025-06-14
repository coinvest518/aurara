import React from 'react';
import { Wifi, WifiOff, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ConnectionStatus {
  connected: boolean;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number;
  bandwidth: number;
}

interface ConversationStatus {
  state: 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'error';
  duration: number;
  turnCount: number;
}

interface StatusIndicatorProps {
  connection: ConnectionStatus;
  conversation: ConversationStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  connection,
  conversation,
}) => {
  const getConnectionIcon = () => {
    if (!connection.connected) return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getConnectionColor = () => {
    if (!connection.connected) return 'text-red-500';
    switch (connection.quality) {
      case 'excellent': return 'text-emerald-500';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-amber-500';
      case 'poor': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getConversationIcon = () => {
    switch (conversation.state) {
      case 'connecting': return <Clock className="w-4 h-4 animate-spin" />;
      case 'active': return <Activity className="w-4 h-4" />;
      case 'paused': return <AlertTriangle className="w-4 h-4" />;
      case 'ended': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getConversationColor = () => {
    switch (conversation.state) {
      case 'active': return 'text-emerald-500';
      case 'connecting': return 'text-blue-500';
      case 'paused': return 'text-amber-500';
      case 'ended': return 'text-slate-500';
      case 'error': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">System Status</h3>
      
      {/* Connection Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={getConnectionColor()}>
              {getConnectionIcon()}
            </div>
            <span className="text-sm font-medium text-slate-700">Connection</span>
          </div>
          <span className={`text-sm capitalize ${getConnectionColor()}`}>
            {connection.connected ? connection.quality : 'Disconnected'}
          </span>
        </div>

        {connection.connected && (
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <span className="block font-medium">Latency</span>
              <span className="text-slate-500">{connection.latency}ms</span>
            </div>
            <div>
              <span className="block font-medium">Bandwidth</span>
              <span className="text-slate-500">{connection.bandwidth} Mbps</span>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Status */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={getConversationColor()}>
              {getConversationIcon()}
            </div>
            <span className="text-sm font-medium text-slate-700">Conversation</span>
          </div>
          <span className={`text-sm capitalize ${getConversationColor()}`}>
            {conversation.state}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <span className="block font-medium">Duration</span>
            <span className="text-slate-500">{formatDuration(conversation.duration)}</span>
          </div>
          <div>
            <span className="block font-medium">Turns</span>
            <span className="text-slate-500">{conversation.turnCount}</span>
          </div>
        </div>
      </div>

      {/* Quality Indicator */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Quality</span>
          <span className="text-xs text-slate-500">Real-time</span>
        </div>
        
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={`h-2 w-full rounded-full ${
                bar <= (connection.connected ? 
                  (connection.quality === 'excellent' ? 5 :
                   connection.quality === 'good' ? 4 :
                   connection.quality === 'fair' ? 3 : 2) : 1)
                  ? (bar <= 2 ? 'bg-red-400' : bar <= 3 ? 'bg-amber-400' : 'bg-emerald-400')
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};