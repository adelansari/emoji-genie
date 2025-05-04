import { useState, useEffect } from 'react';
import { getResponsiveCanvasSize } from '../config';

// Custom hook to manage responsive canvas sizing
export const useCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  
  // Set up responsive canvas
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return canvasSize;
};