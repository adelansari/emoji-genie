import { memo, useMemo } from 'react';
import { headModels } from "../data/headModels";
import { eyeModels } from "../data/eyeModels";
import { mouthModels } from "../data/mouthModels";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

function hexToHSL(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

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
  };
  const rightEyeStyle = {
    position: 'absolute' as const,
    left: `${positionRightEye.x}px`,
    top: `${positionRightEye.y}px`,
    width: `${sizeRightEye.x}px`,
    height: `${sizeRightEye.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationRightEye}deg)`,
    transformOrigin: 'center center',
  };
  const mouthStyle = {
    position: 'absolute' as const,
    left: `${positionMouth.x}px`,
    top: `${positionMouth.y}px`,
    width: `${sizeMouth.x}px`,
    height: `${sizeMouth.y}px`,
    transform: `translate(-50%, -50%) rotate(${rotationMouth}deg)`,
    transformOrigin: 'center center',
  };

  const headHueShift = useMemo(() => {
    const defaultHue = 50;
    const { h } = hexToHSL(headColor);
    return h - defaultHue;
  }, [headColor]);

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#555' }} />

      {HeadSvgComponent && (
        <HeadSvgComponent
          style={{
            ...headContainerStyle,
            filter: `hue-rotate(${headHueShift}deg)`
          }}
        />
      )}

      {LeftEyeSvgComponent && (
        <LeftEyeSvgComponent
          className="custom-fill"
          style={{ ...leftEyeStyle, '--fillColor': leftEyeColor } as React.CSSProperties}
        />
      )}

      {RightEyeSvgComponent && (
        <RightEyeSvgComponent
          className="custom-fill"
          style={{ ...rightEyeStyle, '--fillColor': rightEyeColor } as React.CSSProperties}
        />
      )}

      {MouthSvgComponent && (
        <MouthSvgComponent
          className="custom-fill"
          style={{ ...mouthStyle, '--fillColor': mouthColor } as React.CSSProperties}
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