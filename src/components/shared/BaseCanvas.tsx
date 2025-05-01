import { memo, useState, useEffect, ReactNode } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

// Function to calculate responsive canvas size
export const getResponsiveCanvasSize = () => {
  const padding = 32; // Corresponds to p-4 on App container
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.6; // Allow space for controls
  const maxSize = 600; // Max size on desktop
  const minSize = 300; // Min size on mobile
  
  return Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
};

// Define the children prop type that can be a ReactNode or a function
export type CanvasChildrenType = ReactNode | ((canvasSize: number) => ReactNode);

export interface BaseCanvasProps {
  containerId: string;
  backgroundColor?: string;
  children?: CanvasChildrenType;
}

/**
 * Base canvas component for rendering SVG models using Konva
 * Used by both EmojiCanvas and StickerCanvas
 */
function BaseCanvas({ 
  containerId, 
  backgroundColor = "#555",
  children 
}: BaseCanvasProps) {
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    // Initial call in case dimensions change before listener attaches
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id={containerId}
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: canvasSize, height: canvasSize }}
    >
      <Stage
        width={canvasSize}
        height={canvasSize}
      >
        {/* Canvas background */}
        <Layer>
          <Rect
            width={canvasSize}
            height={canvasSize}
            fill={backgroundColor}
          />
        </Layer>

        {/* Render children layers with proper type checking */}
        {typeof children === 'function' 
          ? (children as (canvasSize: number) => ReactNode)(canvasSize) 
          : children}
      </Stage>
    </div>
  );
}

export default memo(BaseCanvas);