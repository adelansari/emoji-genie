import { useState, useRef } from "react";
import { Circle, Layer, Stage } from "react-konva";
import Konva from "konva";

type JoystickControllerProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: {
    x: number;
    y: number;
  };
};

export default function JoystickController(props: JoystickControllerProps) {
  const containerSize = 200;
  const center = { x: containerSize / 2, y: containerSize / 2 };
  const controlRadius = 80;
  const indicatorRadius = 10;

  const canvasSize = 600;
  const elementSize = 100;
  const initialIndicatorX = center.x + ((props.position.x - canvasSize / 2) / (canvasSize / 2)) * controlRadius;
  const initialIndicatorY = center.y + ((props.position.y - canvasSize / 2) / (canvasSize / 2)) * controlRadius;

  const [indicatorPosition, setIndicatorPosition] = useState({ x: initialIndicatorX, y: initialIndicatorY });
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  const updateControlledPosition = (indicatorX: number, indicatorY: number) => {
    const dx = indicatorX - center.x;
    const dy = indicatorY - center.y;

    const canvasCenterX = canvasSize / 2;
    const canvasCenterY = canvasSize / 2;

    const targetX = canvasCenterX + (dx / controlRadius) * canvasCenterX;
    const targetY = canvasCenterY + (dy / controlRadius) * canvasCenterY;

    const clampedX = Math.max(elementSize / 2, Math.min(canvasSize - elementSize / 2, targetX));
    const clampedY = Math.max(elementSize / 2, Math.min(canvasSize - elementSize / 2, targetY));

    props.setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerInteraction = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const dx = pointerPosition.x - center.x;
    const dy = pointerPosition.y - center.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    let newX = pointerPosition.x;
    let newY = pointerPosition.y;

    if (distance > controlRadius) {
      const ratio = controlRadius / distance;
      newX = center.x + dx * ratio;
      newY = center.y + dy * ratio;
      distance = controlRadius;
    }

    setIndicatorPosition({ x: newX, y: newY });
    updateControlledPosition(newX, newY);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    handlePointerInteraction();
  };

  const handleMouseMove = () => {
    if (!isDragging) return;
    handlePointerInteraction();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-xl p-4 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Position Control</h3>
      <Stage
        width={containerSize}
        height={containerSize}
        className="bg-gray-600 rounded-full cursor-pointer"
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <Circle
            x={center.x}
            y={center.y}
            radius={controlRadius}
            fill="#4A5568"
            stroke="#718096"
            strokeWidth={2}
            listening={false}
          />
          <Circle
            x={indicatorPosition.x}
            y={indicatorPosition.y}
            radius={indicatorRadius}
            fill={isDragging ? "rgb(251 191 36 / 0.8)" : "rgb(252 211 77 / 0.6)"}
            stroke="white"
            strokeWidth={1}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.5}
            listening={false}
          />
        </Layer>
      </Stage>
    </div>
  );
}
