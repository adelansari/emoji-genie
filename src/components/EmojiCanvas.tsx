import { memo } from 'react';
import { headModels } from "../data/headModels";
import { eyeModels } from "../data/eyeModels";
import { mouthModels } from "../data/mouthModels";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

function EmojiCanvas() {
  const {
    positionHead, rotationHead, sizeHead,
    selectedHeadModel, color: headColor,
    positionLeftEye, rotationLeftEye, sizeLeftEye, selectedLeftEyeModel, leftEyeColor,
    positionRightEye, rotationRightEye, sizeRightEye, selectedRightEyeModel, rightEyeColor,
    positionMouth, rotationMouth, sizeMouth, selectedMouthModel, mouthColor,
  } = useEmojiCustomization();

  const canvasSize = 600;
  const headModelData = headModels.find(m => m.id === selectedHeadModel);
  const HeadSvgComponent = headModelData?.SvgComponent;

  const leftEyeModelData = eyeModels.find(m => m.id === selectedLeftEyeModel);
  const LeftEyeSvgComponent = leftEyeModelData?.SvgComponent;
  const rightEyeModelData = eyeModels.find(m => m.id === selectedRightEyeModel);
  const RightEyeSvgComponent = rightEyeModelData?.SvgComponent;
  const mouthModelData = mouthModels.find(m => m.id === selectedMouthModel);
  const MouthSvgComponent = mouthModelData?.SvgComponent;

  const headScaleX = sizeHead.x / 100;
  const headScaleY = sizeHead.y / 100;
  const headContainerStyle = {
    position: 'absolute' as const,
    left: `${positionHead.x}px`,
    top: `${positionHead.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationHead}deg) scale(${headScaleX}, ${headScaleY})`,
    transformOrigin: 'center center',
    width: '100px',
    height: '100px',
  };

  const leftEyeStyle = {
    position: 'absolute' as const,
    left: `${positionLeftEye.x}px`,
    top: `${positionLeftEye.y}px`,
    width: `${sizeLeftEye.x}px`,
    height: `${sizeLeftEye.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationLeftEye}deg)`,
    transformOrigin: 'center center',
    fill: leftEyeColor,
  };
  const rightEyeStyle = {
    position: 'absolute' as const,
    left: `${positionRightEye.x}px`,
    top: `${positionRightEye.y}px`,
    width: `${sizeRightEye.x}px`,
    height: `${sizeRightEye.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationRightEye}deg)`,
    transformOrigin: 'center center',
    fill: rightEyeColor,
  };
  const mouthStyle = {
    position: 'absolute' as const,
    left: `${positionMouth.x}px`,
    top: `${positionMouth.y}px`,
    width: `${sizeMouth.x}px`,
    height: `${sizeMouth.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationMouth}deg)`,
    transformOrigin: 'center center',
    fill: mouthColor,
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
        <LeftEyeSvgComponent style={leftEyeStyle} />
      )}

      {RightEyeSvgComponent && (
        <RightEyeSvgComponent style={rightEyeStyle} />
      )}
      {MouthSvgComponent && (
        <MouthSvgComponent style={mouthStyle} />
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