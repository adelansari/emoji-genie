import { memo, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { findStickerModel } from '../../data/sticker/stickerModels';
import KonvaSvgRenderer from '../shared/KonvaSvgRenderer';

// Function to calculate responsive size (same as in EmojiCanvas)
const getResponsiveCanvasSize = () => {
  const padding = 32; 
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.6; 
  const maxSize = 600; 
  const minSize = 300; 
  return Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
};

/**
 * Canvas component for rendering sticker characters using Konva
 */
function StickerCanvas() {
  const { 
    getTransform,
    selectedStickerModels
  } = useEmojiCustomization();

  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  // Helper for rendering a model with the right transform
  const renderModelWithTransform = (part: string, subcategory: string, model: any) => {
    if (!model) return null;
    
    // Assuming getTransform provides position relative to a conceptual center,
    // or the joystick updates it correctly based on the current canvas size.
    const transform = getTransform('sticker', part, subcategory as any);
    
    return (
      <KonvaSvgRenderer
        key={`${part}-${subcategory}-${model.id}`} // Add key for dynamic rendering
        svgComponent={model.SvgComponent}
        x={transform.position.x}
        y={transform.position.y}
        rotation={transform.rotation}
        scaleX={transform.size.x / 100}
        scaleY={transform.size.y / 100}
        // Adjust fill logic slightly if needed
        fill={transform.color} // Use the transform color directly for simplicity, adjust specific parts if needed
      />
    );
  };
  
  return (
    <div
      id="sticker-canvas-container"
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
            fill="#444"
          />
        </Layer>
        
        {/* Sticker parts layer */}
        <Layer>
          {/* Render order might matter, adjust if needed (e.g., hair behind face) */}
          {hairModel && renderModelWithTransform('hair', 'default', hairModel)}
          {faceModel && renderModelWithTransform('face', 'shape', faceModel)}
          {mouthModel && renderModelWithTransform('face', 'mouth', mouthModel)}
          {eyeShapeModel && renderModelWithTransform('eyes', 'eyeShape', eyeShapeModel)}
          {eyebrowsModel && renderModelWithTransform('eyes', 'eyebrows', eyebrowsModel)}
          {othersModel && renderModelWithTransform('others', 'default', othersModel)}
          
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
      </Stage>
    </div>
  );
}

export default memo(StickerCanvas);