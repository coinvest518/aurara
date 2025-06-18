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

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Container to constrain the glow effect */}
      <div className="absolute w-full h-full">
        {/* Glow effect */}
        <div className="absolute w-full h-full rounded-2xl bg-gradient-to-r from-accent-teal/20 to-purple-500/20 blur-[10px]" />
      </div>

      {/* Main avatar container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full rounded-2xl overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        
        {/* Image */}
        <div className="relative h-full w-full">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
          
          {/* Video indicator */}
          {isVideoAvatar && (
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <Video className="w-4 h-4 text-accent-teal" />
                <span className="text-xs text-white/80">AI Video</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Avatar;
