import { memo } from 'react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findStickerModel } from '../../data/sticker/stickerModels';

/**
 * Canvas component for rendering sticker characters
 * Uses separate transform properties for each part and subcategory
 */
function StickerCanvas() {
  const { 
    getTransform,
    selectedStickerModels
  } = useEmojiCustomization();

  const canvasSize = 600;
  
  // Retrieve selected models for all categories and subcategories
  const faceModel = selectedStickerModels.face && selectedStickerModels.face.shape ? 
    findStickerModel('face', 'shape', selectedStickerModels.face.shape) : null;
  
  const mouthModel = selectedStickerModels.face && selectedStickerModels.face.mouth ? 
    findStickerModel('face', 'mouth', selectedStickerModels.face.mouth) : null;
    
  const eyeShapeModel = selectedStickerModels.eyes && selectedStickerModels.eyes.eyeShape ? 
    findStickerModel('eyes', 'eyeShape', selectedStickerModels.eyes.eyeShape) : null;
  
  const eyebrowsModel = selectedStickerModels.eyes && selectedStickerModels.eyes.eyebrows ? 
    findStickerModel('eyes', 'eyebrows', selectedStickerModels.eyes.eyebrows) : null;
  
  const hairModel = selectedStickerModels.hair && selectedStickerModels.hair.default ? 
    findStickerModel('hair', 'default', selectedStickerModels.hair.default) : null;
  
  const othersModel = selectedStickerModels.others && selectedStickerModels.others.default ? 
    findStickerModel('others', 'default', selectedStickerModels.others.default) : null;
  
  // Helper function to create style based on transform with specific part and subcategory
  const createStyle = (part: string, subcategory: string) => {
    const transform = getTransform('sticker', part, subcategory as any);
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
          style={createStyle('face', 'shape')}
          fill={getTransform('sticker', 'face', 'shape').color}
        />
      )}
      
      {mouthModel && (
        <mouthModel.SvgComponent
          style={{...createStyle('face', 'mouth'), zIndex: 2}}
          fill="#333333"
        />
      )}
      
      {eyeShapeModel && (
        <eyeShapeModel.SvgComponent
          style={{...createStyle('eyes', 'eyeShape'), zIndex: 2}}
          fill="#333333"
        />
      )}
      
      {eyebrowsModel && (
        <eyebrowsModel.SvgComponent
          style={{...createStyle('eyes', 'eyebrows'), zIndex: 3}}
          fill="#333333"
        />
      )}
      
      {hairModel && (
        <hairModel.SvgComponent
          style={{...createStyle('hair', 'default'), zIndex: 3}}
          fill="#663300"
        />
      )}
      
      {othersModel && (
        <othersModel.SvgComponent
          style={{...createStyle('others', 'default'), zIndex: 4}}
          fill="#333333"
        />
      )}
      
      {!faceModel && !eyeShapeModel && !eyebrowsModel && !hairModel && !mouthModel && !othersModel && (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px', position: 'relative', zIndex: 5 }}>
          No sticker parts selected. Choose from the gallery.
        </p>
      )}
    </div>
  );
}

export default memo(StickerCanvas);