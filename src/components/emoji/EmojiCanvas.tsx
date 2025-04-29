import { memo, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { findEmojiModel } from '../../data/emoji/emojiModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';

// Function to calculate responsive size
const getResponsiveCanvasSize = () => {
  const padding = 32; // Corresponds to p-4 on App container, adjust if needed
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.6; // Allow space for controls below/beside
  const maxSize = 600; // Max size on desktop
  const minSize = 300; // Min size on mobile
  
  // Use Math.min for square canvas fitting available space, respecting min/max
  return Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
};

/**
 * Canvas component for rendering emoji models using Konva
 */
function EmojiCanvas() {
  const { 
    getTransform,
    selectedEmojiModels
  } = useEmojiCustomization();

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
  
  // For emoji mode, use the head model
  const headModel = useMemo(() => findEmojiModel('head', selectedEmojiModels.head || 'default'), [selectedEmojiModels.head]);
  
  // Get transform for head - ensure position is relative to current canvas size
  // Note: getTransform might need adjustment if it assumes 600px canvas
  const headTransform = getTransform('emoji', 'head', 'default');
  
  // Adjust position based on canvas size if needed, assuming default is center
  const adjustedX = headTransform.position.x / 300 * (canvasSize / 2); // Example adjustment if default was 300,300 for 600px
  const adjustedY = headTransform.position.y / 300 * (canvasSize / 2); // Example adjustment if default was 300,300 for 600px
  // For simplicity, let's assume the context/joystick handles centering correctly for now.

  return (
    <div
      id="emoji-canvas-container"
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: canvasSize, height: canvasSize }} // Set container size
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
            fill="#555"
          />
        </Layer>

        {/* Emoji parts layer */}
        <Layer>
          {headModel ? (
            <KonvaSvgRenderer
              svgComponent={headModel.SvgComponent}
              // Use transform directly, assuming joystick updates based on current size
              x={headTransform.position.x} 
              y={headTransform.position.y}
              rotation={headTransform.rotation}
              scaleX={headTransform.size.x / 100}
              scaleY={headTransform.size.y / 100}
              fill={headModel.id === 'default' ? undefined : headTransform.color}
            />
          ) : (
            <Text
              text={`Head model not found: ${selectedEmojiModels.head}`}
              x={canvasSize / 2} // Center text based on dynamic size
              y={50}
              width={canvasSize * 0.8} // Adjust width based on dynamic size
              offsetX={(canvasSize * 0.8) / 2} // Center align offset
              align="center"
              fill="white"
              fontSize={16}
            />
          )}
          
          {/* Add other emoji parts here when implemented */}
        </Layer>
      </Stage>
    </div>
  );
}

export default memo(EmojiCanvas);