import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Circle, Layer, Stage, Line } from "react-konva";
import { RotateCcw } from 'lucide-react';
import Konva from "konva";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import TouchEventWrapper from "./TouchEventWrapper";

const RotationJoystickComponent = () => {
  const { rotation, setRotation } = useEmojiCustomization();

  const containerSize = 200;
  const center = { x: containerSize / 2, y: containerSize / 2 };
  const trackRadius = 80;
  const handleRadius = 15;

  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  const calculateHandlePosition = useCallback((angleDegrees: number) => {
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180;
    return {
      x: center.x + trackRadius * Math.cos(angleRadians),
      y: center.y + trackRadius * Math.sin(angleRadians),
    };
  }, [center.x, center.y, trackRadius]);

  const [handlePosition, setHandlePosition] = useState(calculateHandlePosition(rotation));

  // Add reset handler to reset rotation to 0 degrees
  const handleReset = useCallback(() => {
    setRotation(0);
  }, [setRotation]);

  useEffect(() => {
    if (!isDragging) {
      setHandlePosition(calculateHandlePosition(rotation));
    }
  }, [rotation, calculateHandlePosition, isDragging]);

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
    
    // Update both the rotation and the handle position simultaneously
    setRotation(newRotation);
    setHandlePosition(pos);
    setIsDragging(true);
  }, [setRotation, calculateAngleFromPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setHandlePosition(calculateHandlePosition(rotation));
  }, [rotation, calculateHandlePosition]);

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const angleRadians = Math.atan2(dy, dx);
    return {
      x: center.x + trackRadius * Math.cos(angleRadians),
      y: center.y + trackRadius * Math.sin(angleRadians),
    };
  }, [center.x, center.y, trackRadius]);

  const baseButtonClass = "p-1.5 rounded transition-colors duration-150 ease-in-out border";
  const resetButtonClass = `${baseButtonClass} bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-300 hover:text-white`;

  return (
    <div className="p-2 bg-gray-700/50 rounded-lg flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2 px-3">
        <h3 className="text-lg font-semibold text-yellow-300">Rotation</h3>
        <div className="flex items-center">
          <button onClick={handleReset} className={resetButtonClass} title="Reset Rotation to 0°">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    
      <TouchEventWrapper>
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
      </TouchEventWrapper>
      <p className="text-center text-gray-300 mt-2">{rotation}°</p>
    </div>
  );
};

export default memo(RotationJoystickComponent);