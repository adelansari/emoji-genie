import { Layer, Rect, Stage, Circle, RegularPolygon, Ellipse, Path } from "react-konva"; // Added Path
import { HeadShapeType } from "../data/headModels"; // Updated import path

type EmojiCanvasProps = {
  position: {
    x: number;
    y: number;
  };
  headShape: HeadShapeType;
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const elementBaseSize = 100;
  const elementColor = "orange";
  const elementRotation = 0;

  const renderHeadShape = () => {
    const commonProps = {
      x: props.position.x,
      y: props.position.y,
      fill: elementColor,
      rotation: elementRotation,
      shadowBlur: 10,
      shadowColor: "black",
      scaleX: elementBaseSize / 100, // Apply scaling based on base size
      scaleY: elementBaseSize / 100,
    };

    // Define base dimensions for path calculations (adjust as needed)
    const w = 100; // width
    const h = 100; // height
    const cx = 0; // center x (relative to position)
    const cy = 0; // center y (relative to position)

    switch (props.headShape) {
      case "circle":
        return <Circle {...commonProps} radius={w / 2} />;
      case "square":
        return <Rect {...commonProps} width={w} height={h} offsetX={w / 2} offsetY={h / 2} cornerRadius={10} />;
      case "rectangle": {
        const rectWidth = w * 1.5;
        const rectHeight = h;
        return <Rect {...commonProps} width={rectWidth} height={rectHeight} offsetX={rectWidth / 2} offsetY={rectHeight / 2} cornerRadius={10} />;
      }
      case "triangle": // Equilateral
        return <RegularPolygon {...commonProps} sides={3} radius={w / 1.5} />;
      case "oval":
        return <Ellipse {...commonProps} radiusX={w / 2.5} radiusY={h / 1.8} />;
      case "roundedSquare":
        return <Rect {...commonProps} width={w} height={h} offsetX={w / 2} offsetY={h / 2} cornerRadius={25} />; // Increased cornerRadius
      case "tallRectangle": {
        const tallRectW = w * 0.7;
        const tallRectH = h * 1.4;
        return <Rect {...commonProps} width={tallRectW} height={tallRectH} offsetX={tallRectW / 2} offsetY={tallRectH / 2} cornerRadius={10} />;
      }
      case "wideRectangle": {
        const wideRectW = w * 1.4;
        const wideRectH = h * 0.7;
        return <Rect {...commonProps} width={wideRectW} height={wideRectH} offsetX={wideRectW / 2} offsetY={wideRectH / 2} cornerRadius={10} />;
      }
      case "roundedRectangle":
        {
          const roundRectW = w * 1.5;
          const roundRectH = h;
          return <Rect {...commonProps} width={roundRectW} height={roundRectH} offsetX={roundRectW / 2} offsetY={roundRectH / 2} cornerRadius={roundRectH / 2} />;
        } // Fully rounded ends
      case "isoTriangleUp":
        return <RegularPolygon {...commonProps} sides={3} radius={w / 1.5} />; // Same as equilateral for now
      case "isoTriangleDown":
        return <RegularPolygon {...commonProps} sides={3} radius={w / 1.5} rotation={180} />; // Rotate
      case "rightTriangleLeft":
        // Path for right triangle (adjust points as needed)
        return <Path {...commonProps} data={`M ${cx + w / 2} ${cy - h / 2} L ${cx + w / 2} ${cy + h / 2} L ${cx - w / 2} ${cy + h / 2} Z`} offsetX={0} offsetY={0} />;
      case "rightTriangleRight":
        return <Path {...commonProps} data={`M ${cx - w / 2} ${cy - h / 2} L ${cx - w / 2} ${cy + h / 2} L ${cx + w / 2} ${cy + h / 2} Z`} offsetX={0} offsetY={0} />;
      case "tallOval":
        return <Ellipse {...commonProps} radiusX={w / 3} radiusY={h / 1.5} />;
      case "wideOval":
        return <Ellipse {...commonProps} radiusX={w / 1.5} radiusY={h / 3} />;
      case "pentagon":
        return <RegularPolygon {...commonProps} sides={5} radius={w / 1.8} />;
      case "hexagon":
        return <RegularPolygon {...commonProps} sides={6} radius={w / 2} />;
      case "octagon":
        return <RegularPolygon {...commonProps} sides={8} radius={w / 2} />;
      case "star":
        return <RegularPolygon radius={0} {...commonProps} sides={5} innerRadius={w / 5} outerRadius={w / 2} />;
      case "heart":
        // Heart shape path (simplified)
        return <Path {...commonProps} data={`M ${cx} ${cy + h / 4} C ${cx} ${cy}, ${cx - w / 2} ${cy - h / 4}, ${cx - w / 2} ${cy - h / 4} Q ${cx - w / 2} ${cy - h / 2}, ${cx - w / 4} ${cy - h / 2} C ${cx} ${cy - h / 2}, ${cx} ${cy - h / 4}, ${cx} ${cy - h / 4} C ${cx} ${cy - h / 4}, ${cx} ${cy - h / 2}, ${cx + w / 4} ${cy - h / 2} Q ${cx + w / 2} ${cy - h / 2}, ${cx + w / 2} ${cy - h / 4} C ${cx + w / 2} ${cy - h / 4}, ${cx} ${cy}, ${cx} ${cy + h / 4} Z`} offsetX={0} offsetY={0} />;
      case "egg":
        return <Path {...commonProps} data={`M ${cx} ${cy - h / 2} C ${cx + w / 2.5} ${cy - h / 2}, ${cx + w / 2} ${cy - h / 4}, ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy + h / 2}, ${cx - w / 2} ${cy + h / 2}, ${cx - w / 2} ${cy} C ${cx - w / 2} ${cy - h / 4}, ${cx - w / 2.5} ${cy - h / 2}, ${cx} ${cy - h / 2} Z`} offsetX={0} offsetY={0} />;
      case "eggUpsideDown":
        return <Path {...commonProps} data={`M ${cx} ${cy + h / 2} C ${cx + w / 2.5} ${cy + h / 2}, ${cx + w / 2} ${cy + h / 4}, ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy - h / 2}, ${cx - w / 2} ${cy - h / 2}, ${cx - w / 2} ${cy} C ${cx - w / 2} ${cy + h / 4}, ${cx - w / 2.5} ${cy + h / 2}, ${cx} ${cy + h / 2} Z`} offsetX={0} offsetY={0} />;
      case "bean":
        return <Path {...commonProps} data={`M ${cx - w / 2.5} ${cy - h / 2.5} Q ${cx - w / 2} ${cy}, ${cx - w / 2.5} ${cy + h / 2.5} C ${cx - w / 2} ${cy + h / 1.5}, ${cx + w / 2} ${cy + h / 1.5}, ${cx + w / 2.5} ${cy + h / 4} Q ${cx + w / 1.5} ${cy}, ${cx + w / 2.5} ${cy - h / 4} C ${cx + w / 2} ${cy - h / 1.5}, ${cx - w / 2} ${cy - h / 1.5}, ${cx - w / 2.5} ${cy - h / 2.5} Z`} offsetX={0} offsetY={0} />;
      case "pear":
        return <Path {...commonProps} data={`M ${cx} ${cy - h / 2} C ${cx + w / 4} ${cy - h / 2}, ${cx + w / 3} ${cy - h / 4}, ${cx + w / 3} ${cy} C ${cx + w / 3} ${cy + h / 3}, ${cx + w / 4} ${cy + h / 2}, ${cx} ${cy + h / 2} C ${cx - w / 4} ${cy + h / 2}, ${cx - w / 3} ${cy + h / 3}, ${cx - w / 3} ${cy} C ${cx - w / 3} ${cy - h / 4}, ${cx - w / 4} ${cy - h / 2}, ${cx} ${cy - h / 2} Z`} offsetX={0} offsetY={0} />;
      case "apple":
        return <Path {...commonProps} data={`M ${cx} ${cy - h / 2.5} C ${cx + w / 4} ${cy - h / 2}, ${cx + w / 2} ${cy - h / 3}, ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy + h / 2.5}, ${cx + w / 4} ${cy + h / 2}, ${cx} ${cy + h / 2} C ${cx - w / 4} ${cy + h / 2}, ${cx - w / 2} ${cy + h / 2.5}, ${cx - w / 2} ${cy} C ${cx - w / 2} ${cy - h / 3}, ${cx - w / 4} ${cy - h / 2}, ${cx} ${cy - h / 2.5} M ${cx} ${cy - h / 2.5} Q ${cx} ${cy - h / 1.8}, ${cx - w / 10} ${cy - h / 2} C ${cx - w / 8} ${cy - h / 1.5}, ${cx + w / 8} ${cy - h / 1.5}, ${cx + w / 10} ${cy - h / 2} Q ${cx} ${cy - h / 1.8}, ${cx} ${cy - h / 2.5} Z`} offsetX={0} offsetY={0} />;
      case "blob1":
        return <Path {...commonProps} data={`M ${cx - w / 2} ${cy} C ${cx - w / 2} ${cy - h / 2}, ${cx - w / 4} ${cy - h / 1.5}, ${cx} ${cy - h / 2} C ${cx + w / 2} ${cy - h / 2.5}, ${cx + w / 1.5} ${cy}, ${cx + w / 2} ${cy + h / 2} C ${cx + w / 3} ${cy + h / 1.5}, ${cx - w / 3} ${cy + h / 1.5}, ${cx - w / 2} ${cy} Z`} offsetX={0} offsetY={0} />;
      case "blob2":
        return <Path {...commonProps} data={`M ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy - h / 2}, ${cx + w / 4} ${cy - h / 1.5}, ${cx} ${cy - h / 2} C ${cx - w / 2} ${cy - h / 2.5}, ${cx - w / 1.5} ${cy}, ${cx - w / 2} ${cy + h / 2} C ${cx - w / 3} ${cy + h / 1.5}, ${cx + w / 3} ${cy + h / 1.5}, ${cx + w / 2} ${cy} Z`} offsetX={0} offsetY={0} />;
      case "roundTopFlatBottom":
        return <Path {...commonProps} data={`M ${cx - w / 2} ${cy + h / 2} L ${cx + w / 2} ${cy + h / 2} L ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy - h / 2}, ${cx - w / 2} ${cy - h / 2}, ${cx - w / 2} ${cy} Z`} offsetX={0} offsetY={0} />;
      case "flatTopRoundBottom":
        return <Path {...commonProps} data={`M ${cx - w / 2} ${cy - h / 2} L ${cx + w / 2} ${cy - h / 2} L ${cx + w / 2} ${cy} C ${cx + w / 2} ${cy + h / 2}, ${cx - w / 2} ${cy + h / 2}, ${cx - w / 2} ${cy} Z`} offsetX={0} offsetY={0} />;
      case "diamond":
        return <RegularPolygon {...commonProps} sides={4} radius={w / 1.8} />; // Rotated square
      default:
        return <Rect {...commonProps} width={w} height={h} offsetX={w / 2} offsetY={h / 2} cornerRadius={10} />;
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
        </Layer>
      </Stage>
    </div>
  );
}