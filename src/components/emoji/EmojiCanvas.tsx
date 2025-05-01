import { memo, useMemo } from 'react';
import { Layer, Text } from 'react-konva';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { findEmojiModel } from '../../data/emoji/emojiModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';
import BaseCanvas from '../shared/BaseCanvas';
import { getAdaptiveScale } from '../../utils/canvasConfig';

/**
 * Canvas component for rendering emoji models using Konva
 */
function EmojiCanvas() {
  const { 
    getTransform,
    selectedEmojiModels
  } = useEmojiCustomization();
  
  // For emoji mode, use the head model
  const headModel = useMemo(() => findEmojiModel('head', selectedEmojiModels.head || 'default'), [selectedEmojiModels.head]);
  
  // Get transform for head
  const headTransform = getTransform('emoji', 'head', 'default');

  return (
    <BaseCanvas containerId="emoji-canvas-container" backgroundColor="#555">
      {(canvasSize) => {
        // Calculate the adaptive scale factor based on canvas size
        const adaptiveScale = getAdaptiveScale(canvasSize);
        
        return (
          <Layer>
            {headModel ? (
              <KonvaSvgRenderer
                svgComponent={headModel.SvgComponent}
                x={headTransform.position.x * canvasSize}
                y={headTransform.position.y * canvasSize}
                rotation={headTransform.rotation}
                // Apply both the user's size setting and the adaptive scale
                scaleX={(headTransform.size.x / 100) * adaptiveScale}
                scaleY={(headTransform.size.y / 100) * adaptiveScale}
                fill={headModel.id === 'default' ? undefined : headTransform.color}
                canvasSize={canvasSize}
              />
            ) : (
              <Text
                text={`Head model not found: ${selectedEmojiModels.head}`}
                x={canvasSize / 2}
                y={50}
                width={canvasSize * 0.8}
                offsetX={(canvasSize * 0.8) / 2}
                align="center"
                fill="white"
                fontSize={16}
              />
            )}
            
            {/* Add other emoji parts here when implemented */}
          </Layer>
        );
      }}
    </BaseCanvas>
  );
}

export default memo(EmojiCanvas);