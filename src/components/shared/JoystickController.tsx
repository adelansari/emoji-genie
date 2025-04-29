import { useState, useRef, useCallback, memo, useEffect } from "react";
import { Stage, Layer, Circle } from "react-konva";
import Konva from 'konva'; // Import Konva namespace
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

  // Element size assumption for clamping (can be made dynamic if needed)
  const elementSize = 100; 

  // Calculate initial indicator position based on current position and canvasSize
  const calculateIndicatorPos = useCallback((currentPos: { x: number; y: number }) => {
    // Map canvas position (relative to center) to joystick position (relative to center)
    const canvasCenterX = canvasSize / 2;
    const canvasCenterY = canvasSize / 2;
    const relativePosX = (currentPos.x - canvasCenterX) / canvasCenterX; // Range -1 to 1
    const relativePosY = (currentPos.y - canvasCenterY) / canvasCenterY; // Range -1 to 1
    
    // Clamp relative position in case canvas size changed drastically
    const clampedRelativeX = Math.max(-1, Math.min(1, relativePosX));
    const clampedRelativeY = Math.max(-1, Math.min(1, relativePosY));

    return {
      x: center.x + clampedRelativeX * controlRadius,
      y: center.y + clampedRelativeY * controlRadius,
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

    // Map joystick delta (-controlRadius to +controlRadius) to canvas delta
    const relativeX = dx / controlRadius; // Range -1 to 1
    const relativeY = dy / controlRadius; // Range -1 to 1

    const canvasCenterX = canvasSize / 2;
    const canvasCenterY = canvasSize / 2;

    // Calculate target position on canvas
    const targetX = canvasCenterX + relativeX * canvasCenterX;
    const targetY = canvasCenterY + relativeY * canvasCenterY;

    // Clamp position within canvas bounds (considering element size)
    // Use a small buffer or assume element center is the position
    const buffer = 0; // Or elementSize / 2 if position is top-left
    const clampedX = Math.max(buffer, Math.min(canvasSize - buffer, targetX));
    const clampedY = Math.max(buffer, Math.min(canvasSize - buffer, targetY));

    setPosition({ x: clampedX, y: clampedY });
  }, [setPosition, center.x, center.y, controlRadius, canvasSize]); // Add canvasSize dependency

  // Reset handler centers the position based on current canvasSize
  const handleReset = useCallback(() => {
    setPosition({ x: canvasSize / 2, y: canvasSize / 2 });
    // Indicator position will update via useEffect
  }, [setPosition, canvasSize]); // Add canvasSize dependency

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const pos = node.position();
    // Update the indicator position visually immediately
    setIndicatorPosition(pos); 
    // Calculate and set the actual element position
    updateControlledPosition(pos.x, pos.y);
    if (!isDragging) setIsDragging(true); // Set dragging state
  }, [updateControlledPosition, isDragging]);

  const handleDragEnd = useCallback(() => {
    // Snap indicator back based on the final position set in context
    setIndicatorPosition(calculateIndicatorPos(position)); 
    setIsDragging(false);
  }, [calculateIndicatorPos, position]); // Add position dependency

  const dragBoundFunc = useCallback((pos: { x: number; y: number }) => {
    // ... (dragBoundFunc remains the same, depends only on joystick geometry) ...
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
      {/* ... (header remains the same) ... */}
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
        // Add touch events along with mouse events
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={(e) => handleDragMove(e as any)} // Cast needed? Konva types might handle it
        onTouchEnd={handleDragEnd}
      >
        <Layer>
          {/* ... (background circle remains the same) ... */}
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
            x={indicatorPosition.x} // Use state for indicator position
            y={indicatorPosition.y} // Use state for indicator position
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
            // Konva automatically handles touch equivalents for draggable
          />
        </Layer>
      </Stage>
    </div>
  );
}

// Need to update the export if it was memoized without props
export default memo(JoystickController);