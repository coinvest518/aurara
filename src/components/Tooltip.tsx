import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    right: 'top-1/2 left-full -translate-y-1/2 ml-2',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'top-1/2 right-full -translate-y-1/2 -ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div className={`          absolute z-50 px-3 py-2 text-sm text-primary-900 bg-accent-teal 
          rounded-lg shadow-lg shadow-accent-teal/20 whitespace-nowrap pointer-events-none
          transform transition-all duration-200
          backdrop-blur-sm backdrop-filter
          ${positionClasses[position]}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-slate-800 transform rotate-45
            ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' :
              position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
              'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'}
          `} />
        </div>
      )}
    </div>
  );
};
