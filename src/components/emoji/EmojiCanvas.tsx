import { memo } from 'react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findEmojiModel } from '../../data/emoji/emojiModels';

/**
 * Canvas component specifically for rendering emoji models
 * Uses SVG components for rendering the selected emoji parts
 */
function EmojiCanvas() {
  const { 
    position, 
    rotation, 
    size, 
    color, 
    selectedEmojiModels
  } = useEmojiCustomization();

  const canvasSize = 600;
  const scaleX = size.x / 100;
  const scaleY = size.y / 100;
  
  const containerStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
    transformOrigin: 'center center',
    width: '100px',
    height: '100px'
  };

  const headModel = findEmojiModel('head', selectedEmojiModels.head || 'default');
  // In the future, we could render other parts like hats, eyes, mouth, etc.
  
  return (
    <div
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
          style={containerStyle}
          fill={headModel.id === 'default' ? undefined : color}
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