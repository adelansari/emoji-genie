import { headModels } from "../data/headModels";
import { memo } from 'react';
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

function EmojiCanvas() {
  const { position, rotation, size, selectedHeadModel, color } = useEmojiCustomization();

  const canvasSize = 600;
  const modelData = headModels.find(m => m.id === selectedHeadModel);
  const SvgComponent = modelData?.SvgComponent;

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

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#555' }}></div>

      {SvgComponent && (
        <SvgComponent
          style={containerStyle}
          fill={selectedHeadModel === 'default' ? undefined : color}
        />
      )}
      {!SvgComponent && (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
          Head model not found: {selectedHeadModel}
        </p>
      )}
    </div>
  );
}

export default memo(EmojiCanvas);