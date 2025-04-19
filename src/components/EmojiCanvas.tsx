import { Layer, Rect, Stage, Circle, RegularPolygon, Ellipse } from "react-konva";
import { HeadShapeType } from "./headModels"; // Import HeadShapeType

type EmojiCanvasProps = {
  position: {
    x: number;
    y: number;
  };
  headShape: HeadShapeType; // Add prop for the selected head shape
  // Add props for size, rotation, color later
  // size: number;
  // rotation: number;
  // color: string;
};

export default function EmojiCanvas(props: EmojiCanvasProps) {
  const canvasSize = 600;
  const elementBaseSize = 100; // Base size, will be modified by size prop later
  const elementColor = "orange"; // Base color, will be modified by color prop later
  const elementRotation = 0; // Base rotation, will be modified by rotation prop later

  const renderHeadShape = () => {
    const commonProps = {
      x: props.position.x, // Konva shapes often use center X
      y: props.position.y, // Konva shapes often use center Y
      fill: elementColor,
      rotation: elementRotation,
      shadowBlur: 10,
      shadowColor: "black",
      // Note: Size/scale needs careful handling depending on shape type
    };

    switch (props.headShape) {
      case "circle":
        return (
          <Circle
            {...commonProps}
            radius={elementBaseSize / 2}
          />
        );
      case "square":
        return (
          <Rect
            {...commonProps}
            width={elementBaseSize}
            height={elementBaseSize}
            offsetX={elementBaseSize / 2} // Offset to center Rect
            offsetY={elementBaseSize / 2} // Offset to center Rect
            cornerRadius={10} // Keep cornerRadius for square/rect
          />
        );
      case "rectangle": {
        // Example: make rectangle wider
        const rectWidth = elementBaseSize * 1.5;
        const rectHeight = elementBaseSize;
        return (
          <Rect
            {...commonProps}
            width={rectWidth}
            height={rectHeight}
            offsetX={rectWidth / 2}
            offsetY={rectHeight / 2}
            cornerRadius={10}
          />
        );
      }
      case "triangle":
        // Equilateral triangle for simplicity
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={elementBaseSize / 1.5} // Adjust radius for visual size
          />
        );
      case "oval":
        // Example: make oval taller
        return (
          <Ellipse
            {...commonProps}
            radiusX={elementBaseSize / 2.5}
            radiusY={elementBaseSize / 1.8}
          />
        );
      default: // Fallback to square
        return (
          <Rect
            {...commonProps}
            width={elementBaseSize}
            height={elementBaseSize}
            offsetX={elementBaseSize / 2}
            offsetY={elementBaseSize / 2}
            cornerRadius={10}
          />
        );
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
          {/* Render the selected head shape */}
          {renderHeadShape()}
        </Layer>
      </Stage>
    </div>
  );
}
