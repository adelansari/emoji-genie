import { useState, useRef, useCallback, memo } from "react";
import { Circle, Layer, Stage } from "react-konva";
import Konva from "konva";

type JoystickControllerProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: {
    x: number;
    y: number;
  };
};

function JoystickController(props: JoystickControllerProps) {
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

  const updateControlledPosition = useCallback((indicatorX: number, indicatorY: number) => {
    const dx = indicatorX - center.x;
    const dy = indicatorY - center.y;

    const canvasCenterX = canvasSize / 2;
    const canvasCenterY = canvasSize / 2;

    const targetX = canvasCenterX + (dx / controlRadius) * canvasCenterX;
    const targetY = canvasCenterY + (dy / controlRadius) * canvasCenterY;

    const clampedX = Math.max(elementSize / 2, Math.min(canvasSize - elementSize / 2, targetX));
    const clampedY = Math.max(elementSize / 2, Math.min(canvasSize - elementSize / 2, targetY));

    props.setPosition({ x: clampedX, y: clampedY });
  }, [props.setPosition, center.x, center.y, controlRadius, canvasSize, elementSize]);

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const pos = node.position();
    updateControlledPosition(pos.x, pos.y);
    setIsDragging(true);
  }, [updateControlledPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= controlRadius) {
      return pos;
    }
    const ratio = controlRadius / distance;
    return {
      x: center.x + dx * ratio,
      y: center.y + dy * ratio,
    };
  }, [center.x, center.y, controlRadius]);

  return (
    <div className="bg-gray-700/50 rounded-lg shadow-xl p-2 flex flex-col items-center">
      <Stage
        width={containerSize}
        height={containerSize}
        className="bg-gray-600 rounded-full cursor-pointer"
        ref={stageRef}
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
            draggable
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            dragBoundFunc={dragBoundFunc}
            onDragStart={() => setIsDragging(true)}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default memo(JoystickController);
