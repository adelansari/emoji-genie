import { memo } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { findStickerModel } from '../../data/sticker/stickerModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';

/**
 * Canvas component for rendering sticker characters using Konva
 */
function StickerCanvas() {
  const { 
    getTransform,
    selectedStickerModels
  } = useEmojiCustomization();

  const canvasSize = 600;
  
  // Retrieve selected models for all categories and subcategories
  const faceModel = selectedStickerModels.face?.shape ? 
    findStickerModel('face', 'shape', selectedStickerModels.face.shape) : null;
  
  const mouthModel = selectedStickerModels.face?.mouth ? 
    findStickerModel('face', 'mouth', selectedStickerModels.face.mouth) : null;
    
  const eyeShapeModel = selectedStickerModels.eyes?.eyeShape ? 
    findStickerModel('eyes', 'eyeShape', selectedStickerModels.eyes.eyeShape) : null;
  
  const eyebrowsModel = selectedStickerModels.eyes?.eyebrows ? 
    findStickerModel('eyes', 'eyebrows', selectedStickerModels.eyes.eyebrows) : null;
  
  const hairModel = selectedStickerModels.hair?.default ? 
    findStickerModel('hair', 'default', selectedStickerModels.hair.default) : null;
  
  const othersModel = selectedStickerModels.others?.default ? 
    findStickerModel('others', 'default', selectedStickerModels.others.default) : null;
  
  const hasAnyModels = faceModel || eyeShapeModel || eyebrowsModel || hairModel || mouthModel || othersModel;
  
  // Helper for rendering a model with the right transform
  const renderModelWithTransform = (part: string, subcategory: string, model: any) => {
    if (!model) return null;
    
    const transform = getTransform('sticker', part, subcategory as any);
    
    return (
      <KonvaSvgRenderer
        svgComponent={model.SvgComponent}
        x={transform.position.x}
        y={transform.position.y}
        rotation={transform.rotation}
        scaleX={transform.size.x / 100}
        scaleY={transform.size.y / 100}
        fill={part === 'face' && subcategory === 'shape' ? transform.color : 
              part === 'hair' ? '#663300' : '#333333'}
      />
    );
  };
  
  return (
    <div
      id="sticker-canvas-container"
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
            fill="#444"
          />
        </Layer>
        
        {/* Sticker parts layer */}
        <Layer>
          {faceModel && renderModelWithTransform('face', 'shape', faceModel)}
          {mouthModel && renderModelWithTransform('face', 'mouth', mouthModel)}
          {eyeShapeModel && renderModelWithTransform('eyes', 'eyeShape', eyeShapeModel)}
          {eyebrowsModel && renderModelWithTransform('eyes', 'eyebrows', eyebrowsModel)}
          {hairModel && renderModelWithTransform('hair', 'default', hairModel)}
          {othersModel && renderModelWithTransform('others', 'default', othersModel)}
          
          {!hasAnyModels && (
            <Text
              text="No sticker parts selected. Choose from the gallery."
              x={canvasSize/2}
              y={50}
              width={400}
              align="center"
              fill="white"
              fontSize={16}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default memo(StickerCanvas);