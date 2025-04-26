import { memo } from 'react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findStickerModel } from '../../data/sticker/stickerModels';

/**
 * Canvas component for rendering sticker characters
 * Uses separate transform properties for each part
 */
function StickerCanvas() {
  const { 
    getTransform,
    selectedStickerModels
  } = useEmojiCustomization();

  const canvasSize = 600;
  
  // Retrieve selected models
  const faceModel = findStickerModel('face', selectedStickerModels.face || 'shape01');
  const eyesModel = findStickerModel('eyes', selectedStickerModels.eyes || null);
  const hairModel = findStickerModel('hair', selectedStickerModels.hair || null);
  
  // Helper function to create style based on transform
  const createStyle = (part: string) => {
    const transform = getTransform('sticker', part);
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
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      {/* Canvas background */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#444'
      }}></div>

      {/* Render all selected sticker parts with their individual transforms */}
      {faceModel && (
        <faceModel.SvgComponent
          style={createStyle('face')}
          fill={getTransform('sticker', 'face').color}
        />
      )}
      
      {eyesModel && (
        <eyesModel.SvgComponent
          style={{...createStyle('eyes'), zIndex: 2}}
          fill="#333333"
        />
      )}
      
      {hairModel && (
        <hairModel.SvgComponent
          style={{...createStyle('hair'), zIndex: 3}}
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