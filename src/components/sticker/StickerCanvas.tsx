import { memo, useMemo } from 'react';
import { Layer, Text } from 'react-konva';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { findStickerModel } from '../../data/sticker/stickerModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';
import BaseCanvas from '../shared/BaseCanvas';
import { getAdaptiveScale } from '../../utils/canvasConfig';

/**
 * Canvas component for rendering sticker characters using Konva
 */
function StickerCanvas() {
  const { 
    getTransform,
    selectedStickerModels,
    selectedStickerPart,
    selectedStickerSubcategory
  } = useEmojiCustomization();

  // Retrieve selected models for all categories and subcategories
  const faceModel = useMemo(() => selectedStickerModels.face?.shape ? 
    findStickerModel('face', 'shape', selectedStickerModels.face.shape) : null, [selectedStickerModels.face?.shape]);
  
  const mouthModel = useMemo(() => selectedStickerModels.face?.mouth ? 
    findStickerModel('face', 'mouth', selectedStickerModels.face.mouth) : null, [selectedStickerModels.face?.mouth]);
    
  const eyeShapeModel = useMemo(() => selectedStickerModels.eyes?.eyeShape ? 
    findStickerModel('eyes', 'eyeShape', selectedStickerModels.eyes.eyeShape) : null, [selectedStickerModels.eyes?.eyeShape]);
  
  const eyebrowsModel = useMemo(() => selectedStickerModels.eyes?.eyebrows ? 
    findStickerModel('eyes', 'eyebrows', selectedStickerModels.eyes.eyebrows) : null, [selectedStickerModels.eyes?.eyebrows]);
  
  const hairModel = useMemo(() => selectedStickerModels.hair?.default ? 
    findStickerModel('hair', 'default', selectedStickerModels.hair.default) : null, [selectedStickerModels.hair?.default]);
  
  const othersModel = useMemo(() => selectedStickerModels.others?.default ? 
    findStickerModel('others', 'default', selectedStickerModels.others.default) : null, [selectedStickerModels.others?.default]);
  
  const hasAnyModels = faceModel || eyeShapeModel || eyebrowsModel || hairModel || mouthModel || othersModel;
  
  // Helper for rendering a model with adaptive scaling
  const renderModelWithTransform = (part: string, subcategory: string, model: any, canvasSize: number) => {
    if (!model) return null;
    
    // Get the transform for this part and subcategory
    const transform = getTransform('sticker', part, subcategory as any);
    
    // Convert relative position (0-1) to absolute canvas position
    const pixelX = transform.position.x * canvasSize;
    const pixelY = transform.position.y * canvasSize;

    // Calculate the adaptive scale factor based on canvas size
    const adaptiveScale = getAdaptiveScale(canvasSize);
    
    return (
      <KonvaSvgRenderer
        key={`${part}-${subcategory}-${model.id}`}
        svgComponent={model.SvgComponent}
        x={pixelX}
        y={pixelY}
        rotation={transform.rotation}
        // Apply both the user's size setting and the adaptive scale
        scaleX={(transform.size.x / 100) * adaptiveScale}
        scaleY={(transform.size.y / 100) * adaptiveScale}
        fill={transform.color}
        canvasSize={canvasSize}
      />
    );
  };
  
  return (
    <BaseCanvas containerId="sticker-canvas-container" backgroundColor="#444">
      {(canvasSize) => (
        <Layer>
          {/* Render order matters - hair behind face, face before eyes, etc. */}
          {hairModel && renderModelWithTransform('hair', 'default', hairModel, canvasSize)}
          {faceModel && renderModelWithTransform('face', 'shape', faceModel, canvasSize)}
          {mouthModel && renderModelWithTransform('face', 'mouth', mouthModel, canvasSize)}
          {eyeShapeModel && renderModelWithTransform('eyes', 'eyeShape', eyeShapeModel, canvasSize)}
          {eyebrowsModel && renderModelWithTransform('eyes', 'eyebrows', eyebrowsModel, canvasSize)}
          {othersModel && renderModelWithTransform('others', 'default', othersModel, canvasSize)}
          
          {!hasAnyModels && (
            <Text
              text="No sticker parts selected. Choose from the gallery."
              x={canvasSize / 2} // Center text
              y={50}
              width={canvasSize * 0.8} // Adjust width
              offsetX={(canvasSize * 0.8) / 2} // Center align offset
              align="center"
              fill="white"
              fontSize={16}
            />
          )}
        </Layer>
      )}
    </BaseCanvas>
  );
}

export default memo(StickerCanvas);