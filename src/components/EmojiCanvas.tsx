import { Layer, Rect, Stage, Path } from "react-konva";
import { HeadShapeType, headModels } from "../data/headModels";

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
  const scaleX = props.size.x / 100;
  const scaleY = props.size.y / 100;

  const renderHeadShape = () => {
    const modelData = headModels.find(m => m.id === props.headShape);

    const commonProps = {
      x: props.position.x,
      y: props.position.y,
      fill: props.color,
      rotation: props.rotation,
      shadowBlur: 10,
      shadowColor: "black",
      scaleX: scaleX,
      scaleY: scaleY,
      offsetX: 0,
      offsetY: 0,
    };

    if (modelData?.konvaData) {
      return <Path {...commonProps} data={modelData.konvaData} />;
    } else {
      console.warn(`Konva data not found for head shape: ${props.headShape}. Rendering default circle.`);
      const defaultModel = headModels.find(m => m.id === 'circle');
      if (defaultModel?.konvaData) {
        return <Path {...commonProps} data={defaultModel.konvaData} />;
      }
      return null;
    }
  };

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
          {renderHeadShape()}
        </Layer >
      </Stage >
    </div >
  );
}