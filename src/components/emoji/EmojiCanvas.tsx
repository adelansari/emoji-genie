import { memo } from 'react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findEmojiModel } from '../../data/emoji/emojiModels';

/**
 * Canvas component for rendering emoji models
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
  
  // Helper function to create style based on transform
  const createStyle = (part: string) => {
    const transform = getTransform('emoji', part, 'default');
    const { position, rotation, size } = transform;
    const scaleX = size.x / 100;
    const scaleY = size.y / 100;
    
    return {
      position: 'absolute' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
      transformOrigin: 'center center',
      width: '100px',
      height: '100px'
    };
  };
  
  return (
    <div
      id="emoji-canvas-container"
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      {/* Canvas background */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#555'
      }}></div>

      {headModel ? (
        <headModel.SvgComponent
          style={createStyle('head')}
          fill={headModel.id === 'default' ? undefined : headTransform.color}
        />
      ) : (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
          Head model not found: {selectedEmojiModels.head}
        </p>
      )}
    </div>
  );
}

export default memo(EmojiCanvas);