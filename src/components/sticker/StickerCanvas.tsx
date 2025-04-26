import { memo } from 'react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findStickerModel } from '../../data/sticker/stickerModels';

/**
 * Canvas component specifically for rendering sticker characters
 * Can layer multiple SVG components (face, eyes, hair, etc.)
 */
function StickerCanvas() {
  const { 
    position, 
    rotation, 
    size, 
    color, 
    selectedStickerModels
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

  // Retrieve selected models for sticker mode
  const faceModel = findStickerModel('face', selectedStickerModels.face || 'shape01');
  const eyesModel = findStickerModel('eyes', selectedStickerModels.eyes || null);
  const hairModel = findStickerModel('hair', selectedStickerModels.hair || null);
  // We can add more part types in the future
  
  return (
    <div
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      {/* Canvas background - slightly darker for sticker mode */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#444'
      }}></div>

      {/* Render all selected sticker parts */}
      {faceModel && (
        <faceModel.SvgComponent
          style={containerStyle}
          fill={color}
        />
      )}
      
      {eyesModel && (
        <eyesModel.SvgComponent
          style={{...containerStyle, zIndex: 2}}
          fill="#333333"
        />
      )}
      
      {hairModel && (
        <hairModel.SvgComponent
          style={{...containerStyle, zIndex: 3}}
          fill="#663300"
        />
      )}
      
      {!faceModel && !eyesModel && !hairModel && (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px', position: 'relative', zIndex: 5 }}>
          No sticker parts selected. Choose from the gallery.
        </p>
      )}
    </div>
  );
}

export default memo(StickerCanvas);