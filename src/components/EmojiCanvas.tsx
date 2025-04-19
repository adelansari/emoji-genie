import { Layer, Rect, Stage } from "react-konva";

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
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const baseRectSize = 100;

  const scaleX = props.size.x / 100;
  const scaleY = props.size.y / 100;

  return (
    <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden">
      <Stage width={canvasSize} height={canvasSize}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasSize}
            height={canvasSize}
            fill="#555"
          />
          <Rect
            x={props.position.x}
            y={props.position.y}
            width={baseRectSize}
            height={baseRectSize}
            fill="orange"
            cornerRadius={10}
            shadowBlur={10}
            shadowColor="black"
            rotation={props.rotation}
            scaleX={scaleX}
            scaleY={scaleY}
            offsetX={baseRectSize / 2}
            offsetY={baseRectSize / 2}
          />
        </Layer>
      </Stage>
    </div>
  )
}
