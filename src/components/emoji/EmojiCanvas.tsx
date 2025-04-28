import { memo } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findEmojiModel } from '../../data/emoji/emojiModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';

/**
 * Canvas component for rendering emoji models using Konva
 */
function EmojiCanvas() {
  const { 
    getTransform,
    selectedEmojiModels
  } = useEmojiCustomization();

  const canvasSize = 600;
  
  // For emoji mode, use the head model
  const headModel = findEmojiModel('head', selectedEmojiModels.head || 'default');
  
  // Get transform for head
  const headTransform = getTransform('emoji', 'head', 'default');
  
  return (
    <div
      id="emoji-canvas-container"
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
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
              x={canvasSize/2}
              y={50}
              width={300}
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