import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

interface AvatarProps {
  imageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isVideoAvatar?: boolean;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  imageUrl = '/assets/avatars/AI Interviewer.png',
  className = '',
  size = 'md',
  isVideoAvatar = true,
  alt = 'AI Avatar'
}) => {
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-64'
  };

  // Adjusted: Make blur effect slightly larger and more centered, and reduce blur intensity
  const blurSizeClasses = {
    sm: 'h-36 w-36',
    md: 'h-52 w-52',
    lg: 'h-72 w-72'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <div className={`absolute z-0 rounded-2xl bg-gradient-to-r from-accent-teal/30 to-purple-500/30 blur-sm ${blurSizeClasses[size]}`} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className={`relative z-10 rounded-2xl ${sizeClasses[size]} overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90`}>
        <div className="relative h-full w-full">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
          {isVideoAvatar && (
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <Video className="w-4 h-4 text-accent-teal" />
                <span className="text-xs text-white/80">AI Video</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Avatar;
