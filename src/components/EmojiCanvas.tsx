import { Layer, Rect, Stage } from "react-konva";

type EmojiCanvasProps = {
  position: {
    x: number;
    y: number;
  };
  rotation: number;
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const rectSize = 100;

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
            width={rectSize}
            height={rectSize}
            fill="orange"
            cornerRadius={10}
            shadowBlur={10}
            shadowColor="black"
            rotation={props.rotation}
            offsetX={rectSize / 2}
            offsetY={rectSize / 2}
          />
        </Layer>
      </Stage>
    </div>
  )
}
