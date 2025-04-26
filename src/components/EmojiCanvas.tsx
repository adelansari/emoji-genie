import { memo } from 'react';
import { headModels } from "../data/headModels";
import { eyeModels } from "../data/eyeModels";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

function EmojiCanvas() {
  const {
    position,
    rotation,
    size,
    selectedHeadModel,
    selectedLeftEyeModel,
    selectedRightEyeModel,
    color: headColor,
    leftEyeColor,
    rightEyeColor,
  } = useEmojiCustomization();

  const canvasSize = 600;
  const headModelData = headModels.find(m => m.id === selectedHeadModel);
  const HeadSvgComponent = headModelData?.SvgComponent;

  const leftEyeModelData = eyeModels.find(m => m.id === selectedLeftEyeModel);
  const LeftEyeSvgComponent = leftEyeModelData?.SvgComponent;
  const rightEyeModelData = eyeModels.find(m => m.id === selectedRightEyeModel);
  const RightEyeSvgComponent = rightEyeModelData?.SvgComponent;

  const headScaleX = size.x / 100;
  const headScaleY = size.y / 100;
  const headContainerStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${headScaleX}, ${headScaleY})`,
    transformOrigin: 'center center',
    width: '100px',
    height: '100px',
  };

  const eyeBaseSize = 20;
  const eyeScale = 1;
  const eyeOffsetX = 19;
  const eyeOffsetY = -10;

  const leftEyeStyle = {
    position: 'absolute' as const,
    left: `${position.x - eyeOffsetX * headScaleX}px`,
    top: `${position.y + eyeOffsetY * headScaleY}px`,
    width: `${eyeBaseSize * headScaleX * eyeScale}px`,
    height: `${eyeBaseSize * headScaleY * eyeScale}px`,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    fill: leftEyeColor,
  };

  const rightEyeStyle = {
    ...leftEyeStyle,
    left: `${position.x + eyeOffsetX * headScaleX}px`,
    fill: rightEyeColor,
  };

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#555' }} />

      {HeadSvgComponent && (
        <HeadSvgComponent
          style={headContainerStyle}
          fill={selectedHeadModel === 'default' ? undefined : headColor}
        />
      )}

      {LeftEyeSvgComponent && (
        <LeftEyeSvgComponent
          style={leftEyeStyle}
        />
      )}

      {RightEyeSvgComponent && (
        <RightEyeSvgComponent
          style={rightEyeStyle}
        />
      )}

      {!HeadSvgComponent && (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
          Head model not found: {selectedHeadModel}
        </p>
      )}
    </div>
  );
}

export default memo(EmojiCanvas);