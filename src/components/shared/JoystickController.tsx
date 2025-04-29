import { useState, useRef, useCallback, memo, useEffect } from "react";
import { Stage, Layer, Circle } from "react-konva";
import Konva from 'konva'; 
import { RotateCcw } from "lucide-react";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";

// Define props for the component
interface JoystickControllerProps {
  canvasSize: number; // Add canvasSize prop
}

function JoystickController({ canvasSize }: JoystickControllerProps) { 
  const { position, setPosition } = useEmojiCustomization();

  const containerSize = 200; // Keep joystick visual size fixed
  const center = { x: containerSize / 2, y: containerSize / 2 };
  const controlRadius = 80;
  const indicatorRadius = 10;

  // Convert position from relative (0-1) to pixel coordinates for UI display
  const absolutePosition = {
    x: position.x * canvasSize,
    y: position.y * canvasSize
  };

  // Calculate initial indicator position based on current position and canvasSize
  const calculateIndicatorPos = useCallback((pos: { x: number; y: number }) => {
    // First convert the position from relative (0-1) to pixels
    const pixelPos = { 
      x: pos.x * canvasSize,
      y: pos.y * canvasSize 
    };
    
    // Map canvas position (relative to center) to joystick position (relative to center)
    const canvasCenterX = canvasSize / 2;
    const canvasCenterY = canvasSize / 2;
    const relativePosX = (pixelPos.x - canvasCenterX) / canvasCenterX; // Range -1 to 1
    const relativePosY = (pixelPos.y - canvasCenterY) / canvasCenterY; // Range -1 to 1
    
    // Scale to fit within joystick control radius
    return {
      x: center.x + (relativePosX * controlRadius),
      y: center.y + (relativePosY * controlRadius),
    };
  }, [canvasSize, center.x, center.y, controlRadius]);

  const [indicatorPosition, setIndicatorPosition] = useState(calculateIndicatorPos(position));
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  // Update indicator when external position changes (e.g., reset, initial load)
  useEffect(() => {
    if (!isDragging) {
      setIndicatorPosition(calculateIndicatorPos(position));
    }
  }, [position, calculateIndicatorPos, isDragging]);

  const updateControlledPosition = useCallback((indicatorX: number, indicatorY: number) => {
    const dx = indicatorX - center.x; // Joystick delta
    const dy = indicatorY - center.y; // Joystick delta

    // Map joystick delta (-controlRadius to +controlRadius) to canvas position
    const relativeX = dx / controlRadius; // Range -1 to 1
    const relativeY = dy / controlRadius; // Range -1 to 1

    // Convert to relative position values (0-1) instead of absolute pixels
    const newPosX = 0.5 + (relativeX * 0.5); // Center is 0.5, range is 0-1
    const newPosY = 0.5 + (relativeY * 0.5); // Center is 0.5, range is 0-1

    // Clamp the values to ensure they stay within 0-1
    const clampedX = Math.max(0, Math.min(1, newPosX));
    const clampedY = Math.max(0, Math.min(1, newPosY));

    setPosition({ x: clampedX, y: clampedY });
  }, [setPosition, center.x, center.y, controlRadius]);

  // Reset handler centers the position to the relative center (0.5, 0.5)
  const handleReset = useCallback(() => {
    setPosition({ x: 0.5, y: 0.5 });
  }, [setPosition]);

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const pos = node.position();
    // Update the indicator position visually immediately
    setIndicatorPosition(pos); 
    // Calculate and set the actual element position
    updateControlledPosition(pos.x, pos.y);
    if (!isDragging) setIsDragging(true);
  }, [updateControlledPosition, isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []); 

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    // Keep the indicator within the joystick circle boundary
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

  const baseButtonClass = "p-1.5 rounded transition-colors duration-150 ease-in-out border";
  const resetButtonClass = `${baseButtonClass} bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-300 hover:text-white`;

  return (
    <div className="bg-gray-700/50 rounded-lg shadow-xl p-2 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2 px-3">
        <h3 className="text-lg font-semibold text-yellow-300">Position</h3>
        <div className="flex items-center">
          <button onClick={handleReset} className={resetButtonClass} title="Reset Position to Center">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <Stage
        width={containerSize}
        height={containerSize}
        className="bg-gray-600 rounded-full cursor-pointer"
        ref={stageRef}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={(e) => handleDragMove(e as any)}
        onTouchEnd={handleDragEnd}
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
            x={center.x}
            y={center.y}
            radius={2}
            fill="white"
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
      
      {/* Display current position values */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Position: ({(position.x * 100).toFixed(0)}%, {(position.y * 100).toFixed(0)}%)
        <br/>
        Pixels: ({Math.round(absolutePosition.x)}, {Math.round(absolutePosition.y)})
      </div>
    </div>
  );
}

export default memo(JoystickController);