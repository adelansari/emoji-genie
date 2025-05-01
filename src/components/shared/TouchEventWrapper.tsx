import React, { PropsWithChildren } from 'react';

/**
 * A wrapper component that prevents page scrolling during touch interactions
 * on mobile devices. This is especially useful for controls like joysticks,
 * sliders, and other draggable UI elements.
 */
interface TouchEventWrapperProps {
  className?: string;
}

const TouchEventWrapper: React.FC<PropsWithChildren<TouchEventWrapperProps>> = ({ 
  children, 
  className = ""
}) => {
  const preventTouchScroll = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={className}
      onTouchStart={preventTouchScroll}
      onTouchMove={preventTouchScroll}
      onTouchEnd={preventTouchScroll}
    >
      {children}
    </div>
  );
};

export default TouchEventWrapper;