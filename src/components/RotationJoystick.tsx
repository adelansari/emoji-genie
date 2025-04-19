import { useState, useRef, useEffect, useCallback } from "react";
import { Circle, Layer, Stage, Line } from "react-konva";
import Konva from "konva";

type RotationJoystickProps = {
  value: number; // Rotation value in degrees (0-360)
  onChange: (value: number) => void;
};

const RotationJoystick = ({ value, onChange }: RotationJoystickProps) => {
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
    setHandlePosition(calculateHandlePosition(value));
  }, [value, calculateHandlePosition]);

  const updateRotationFromPointer = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const dx = pointerPosition.x - center.x;
    const dy = pointerPosition.y - center.y;

    // Calculate angle in radians, atan2 gives angle relative to positive x-axis
    const angleRadians = Math.atan2(dy, dx);

    // Convert radians to degrees (0-360), adjusting so 0 degrees is 'up'
    let angleDegrees = (angleRadians * 180) / Math.PI + 90;
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }

    const newRotation = Math.round(angleDegrees) % 360;

    onChange(newRotation);

    setHandlePosition(calculateHandlePosition(newRotation));
  };

  const handleInteractionStart = () => {
    setIsDragging(true);
    updateRotationFromPointer();
  };

  const handleInteractionMove = () => {
    if (!isDragging) return;
    updateRotationFromPointer();
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-2 bg-gray-700/50 rounded-lg flex flex-col items-center">
      <Stage
        width={containerSize}
        height={containerSize}
        ref={stageRef}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
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
          {/* Line from center to handle */}
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
            listening={false}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default RotationJoystick;
