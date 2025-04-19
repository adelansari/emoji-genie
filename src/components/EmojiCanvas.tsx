import { Layer, Rect, Stage } from "react-konva";

type EmojiCanvasProps = {
  position: {
    x: number;
    y: number;
  };
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
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
            x={props.position.x - 50}
            y={props.position.y - 50}
            width={100}
            height={100}
            fill="orange"
            cornerRadius={10}
            shadowBlur={10}
            shadowColor="black"
          />
        </Layer>
      </Stage>
    </div>
  )
}
