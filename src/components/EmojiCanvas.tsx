import { headModels, HeadShapeType } from "../data/headModels";
import { EyeShapeType, eyeModels } from "../data/eyeModels";

type EmojiCanvasProps = {
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  size: {
    x: number;
    y: number;
  };
  headShape: HeadShapeType;
  leftEyeShape: EyeShapeType;
  rightEyeShape: EyeShapeType;
  headColor: string;
  leftEyeColor: string;
  rightEyeColor: string;
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const headModelData = headModels.find(m => m.id === props.headShape);
  const HeadSvgComponent = headModelData?.SvgComponent;

  const leftEyeModelData = eyeModels.find(m => m.id === props.leftEyeShape);
  const LeftEyeSvgComponent = leftEyeModelData?.SvgComponent;
  const rightEyeModelData = eyeModels.find(m => m.id === props.rightEyeShape);
  const RightEyeSvgComponent = rightEyeModelData?.SvgComponent;

  const headScaleX = props.size.x / 100;
  const headScaleY = props.size.y / 100;
  const headContainerStyle = {
    position: 'absolute' as const,
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg) scale(${headScaleX}, ${headScaleY})`,
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
    left: `${props.position.x - eyeOffsetX * headScaleX}px`,
    top: `${props.position.y + eyeOffsetY * headScaleY}px`,
    width: `${eyeBaseSize * headScaleX * eyeScale}px`,
    height: `${eyeBaseSize * headScaleY * eyeScale}px`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg)`,
    transformOrigin: 'center center',
    fill: props.leftEyeColor,
  };

  const rightEyeStyle = {
    ...leftEyeStyle,
    left: `${props.position.x + eyeOffsetX * headScaleX}px`,
    fill: props.rightEyeColor,
  };

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-xl overflow-hidden relative"
      style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#555' }}></div>

      {HeadSvgComponent && (
        <HeadSvgComponent
          style={headContainerStyle}
          fill={props.headShape === 'default' ? undefined : props.headColor}
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
          Head model not found: {props.headShape}
        </p>
      )}
    </div>
  );
}