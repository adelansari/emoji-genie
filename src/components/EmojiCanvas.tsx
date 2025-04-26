import { headModels, HeadShapeType } from "../data/headModels";

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
  color: string;
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const modelData = headModels.find(m => m.id === props.headShape);
  const SvgComponent = modelData?.SvgComponent;

  const scaleX = props.size.x / 100;
  const scaleY = props.size.y / 100;
  const containerStyle = {
    position: 'absolute' as const,
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    transform: `translate(-50%, -50%) rotate(${props.rotation}deg) scale(${scaleX}, ${scaleY})`,
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
          // Conditionally pass fill: only if not the default model
          fill={props.headShape === 'default' ? undefined : props.color}
        />
      )}
      {!SvgComponent && (
        <p style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
          Head model not found: {props.headShape}
        </p>
      )}
    </div>
  );
}