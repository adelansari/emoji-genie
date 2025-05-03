import { memo } from 'react';
import { Group, Circle, Line, Rect } from 'react-konva';
import { BackgroundElement, BackgroundElementType } from '../types';

interface BackgroundRendererProps {
  elements: BackgroundElement[];
  canvasWidth: number;
  canvasHeight: number;
  groundHeight: number;
}

const BackgroundRenderer = ({ elements, canvasWidth, canvasHeight, groundHeight }: BackgroundRendererProps) => {
  // Render a single background element based on its type
  const renderElement = (element: BackgroundElement) => {
    const { x, y, type, scale } = element;

    switch (type) {
      case 'cloud':
        return (
          <Group key={`cloud-${x}-${y}`} x={x} y={y} scaleX={scale} scaleY={scale}>
            <Circle radius={20} fill="white" opacity={0.9} />
            <Circle x={15} y={-10} radius={15} fill="white" opacity={0.9} />
            <Circle x={30} y={0} radius={20} fill="white" opacity={0.9} />
            <Circle x={15} y={10} radius={15} fill="white" opacity={0.9} />
          </Group>
        );
      
      case 'mountain':
        return (
          <Group key={`mountain-${x}-${y}`} x={x} y={y} scaleX={scale} scaleY={scale}>
            <Line
              points={[0, 0, 40, -80, 80, 0]}
              closed
              fill="#7D6B5D"
              stroke="#5D4037"
              strokeWidth={1}
            />
            <Line
              points={[30, -60, 40, -80, 50, -60]}
              fill="white"
              closed
            />
          </Group>
        );
      
      case 'hill':
        return (
          <Group key={`hill-${x}-${y}`} x={x} y={y} scaleX={scale} scaleY={scale}>
            <Circle
              radius={30}
              fill="#8BC34A"
              y={0}
            />
            <Circle
              radius={25}
              fill="#7CB342"
              x={-15}
              y={5}
            />
            <Circle
              radius={20}
              fill="#689F38"
              x={15}
              y={8}
            />
          </Group>
        );
        
      case 'bush':
        return (
          <Group key={`bush-${x}-${y}`} x={x} y={y} scaleX={scale} scaleY={scale}>
            <Circle radius={15} fill="#2E7D32" />
            <Circle x={10} y={-5} radius={12} fill="#388E3C" />
            <Circle x={-10} y={-2} radius={10} fill="#43A047" />
          </Group>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sky background with gradient */}
      <Rect
        width={canvasWidth}
        height={canvasHeight}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: canvasHeight }}
        fillLinearGradientColorStops={[0, '#87CEEB', 1, '#ADD8E6']}
      />
      
      {/* Background elements (clouds, mountains, hills) */}
      {elements.map((element, i) => (
        <Group key={`bg-${i}-${element.type}`}>
          {renderElement(element)}
        </Group>
      ))}
      
      {/* Ground */}
      <Rect
        y={canvasHeight - groundHeight}
        width={canvasWidth}
        height={groundHeight}
        fill="#8B4513"
      />
      
      {/* Ground details - top line */}
      <Rect
        y={canvasHeight - groundHeight}
        width={canvasWidth}
        height={3}
        fill="#A0522D"
      />
      
      {/* Ground texture - dots */}
      {[...Array(Math.ceil(canvasWidth / 50))].map((_, i) => (
        <Rect
          key={`ground-detail-${i}`}
          x={i * 50 + Math.random() * 20}
          y={canvasHeight - groundHeight + 10 + Math.random() * (groundHeight - 15)}
          width={2 + Math.random() * 3}
          height={2 + Math.random() * 3}
          fill="#A0522D"
        />
      ))}
    </>
  );
};

export default memo(BackgroundRenderer);