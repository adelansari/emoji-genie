import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Circle, Layer, Stage, Line } from "react-konva";
import Konva from "konva";

type RotationJoystickProps = {
  value: number; // Rotation value in degrees (0-360)
  onChange: (value: number) => void;
};

const RotationJoystickComponent = ({ value, onChange }: RotationJoystickProps) => {
  const containerSize = 200;
  const center = { x: containerSize / 2, y: containerSize / 2 };
  const trackRadius = 80;
  const handleRadius = 15;

  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  const calculateHandlePosition = useCallback((angleDegrees: number) => {
    // Convert degrees to radians, adjusting so 0 degrees is 'up'
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180;
    return {
      x: center.x + trackRadius * Math.cos(angleRadians),
      y: center.y + trackRadius * Math.sin(angleRadians),
    };
  }, [center.x, center.y, trackRadius]);

  const [handlePosition, setHandlePosition] = useState(calculateHandlePosition(value));

  useEffect(() => {
    // Only update handle position based on external value if NOT dragging
    if (!isDragging) {
      setHandlePosition(calculateHandlePosition(value));
    }
  }, [value, calculateHandlePosition, isDragging]);

  const calculateAngleFromPosition = useCallback((x: number, y: number) => {
    const dx = x - center.x;
    const dy = y - center.y;
    const angleRadians = Math.atan2(dy, dx);
    let angleDegrees = (angleRadians * 180) / Math.PI + 90;
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
    return Math.round(angleDegrees) % 360;
  }, [center.x, center.y]);

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const pos = node.position();
    const newRotation = calculateAngleFromPosition(pos.x, pos.y);
    onChange(newRotation);
    // Konva updates position automatically, no need for setHandlePosition here during drag
    setIsDragging(true); // Keep track for visual feedback
  }, [onChange, calculateAngleFromPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Ensure final position matches the value after drag ends
    setHandlePosition(calculateHandlePosition(value));
  }, [value, calculateHandlePosition]);

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const angleRadians = Math.atan2(dy, dx);
    return {
      x: center.x + trackRadius * Math.cos(angleRadians),
      y: center.y + trackRadius * Math.sin(angleRadians),
    };
  }, [center.x, center.y, trackRadius]);

  return (
    <div className="p-2 bg-gray-700/50 rounded-lg flex flex-col items-center">
      <Stage
        width={containerSize}
        height={containerSize}
        ref={stageRef}
        className="cursor-pointer"
      >
        <Layer>
          <Circle
            x={center.x}
            y={center.y}
            radius={trackRadius}
            stroke="#4A5568"
            strokeWidth={10}
            listening={false}
          />
          <Circle
            x={center.x}
            y={center.y}
            radius={5}
            fill="#718096"
            listening={false}
          />
          <Line
            points={[center.x, center.y, handlePosition.x, handlePosition.y]}
            stroke={isDragging ? "rgb(251 191 36 / 0.8)" : "rgb(252 211 77 / 0.6)"}
            strokeWidth={3}
            listening={false}
          />
          <Circle
            x={handlePosition.x}
            y={handlePosition.y}
            radius={handleRadius}
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
};

export default memo(RotationJoystickComponent);
