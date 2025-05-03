import { memo } from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import { Obstacle, ObstacleType } from '../types';
import { GROUND_HEIGHT } from '../engine/RunnerGameEngine';

interface ObstacleRendererProps {
  obstacles: Obstacle[];
  canvasHeight: number;
}

const ObstacleRenderer = ({ obstacles, canvasHeight }: ObstacleRendererProps) => {
  // Render an obstacle based on its type
  const renderObstacle = (obstacle: Obstacle) => {
    const { x, width, height, type, y } = obstacle;
    
    // For most obstacles, calculate y position based on ground level
    const obstacleY = y !== undefined ? y : canvasHeight - GROUND_HEIGHT - height/2;

    switch (type) {
      case 'cactus':
        return (
          <Group x={x} y={obstacleY}>
            {/* Main cactus trunk */}
            <Rect
              width={width * 0.3}
              height={height}
              offsetX={(width * 0.3) / 2}
              offsetY={height / 2}
              fill="#2D6A4F"
              cornerRadius={2}
            />
            
            {/* Cactus arms */}
            <Rect
              x={-width * 0.15}
              y={-height * 0.3}
              width={width * 0.5}
              height={height * 0.15}
              fill="#2D6A4F"
              cornerRadius={2}
            />
            <Rect
              x={width * 0.15}
              y={-height * 0.1}
              width={width * 0.5}
              height={height * 0.15}
              fill="#2D6A4F"
              cornerRadius={2}
            />
            
            {/* Cactus details - spikes */}
            {[...Array(3)].map((_, i) => (
              <Line
                key={`spike-${i}`}
                points={[
                  -width * 0.2, -height * 0.3 + (i * height * 0.3),
                  -width * 0.3, -height * 0.25 + (i * height * 0.3)
                ]}
                stroke="#1B4332"
                strokeWidth={1.5}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <Line
                key={`spike-right-${i}`}
                points={[
                  width * 0.2, -height * 0.2 + (i * height * 0.3),
                  width * 0.3, -height * 0.15 + (i * height * 0.3)
                ]}
                stroke="#1B4332"
                strokeWidth={1.5}
              />
            ))}
          </Group>
        );
      
      case 'rock':
        return (
          <Group x={x} y={obstacleY}>
            {/* Main rock body */}
            <Circle
              radius={width / 2}
              fill="#888888"
              stroke="#666666"
              strokeWidth={2}
            />
            
            {/* Rock details */}
            <Line
              points={[
                -width * 0.3, -height * 0.2,
                -width * 0.1, -height * 0.3,
                width * 0.2, -height * 0.1
              ]}
              stroke="#666666"
              strokeWidth={1}
            />
            <Line
              points={[
                -width * 0.1, height * 0.1,
                width * 0.1, height * 0.2
              ]}
              stroke="#666666"
              strokeWidth={1}
            />
          </Group>
        );
      
      case 'pit':
        return (
          <Group x={x} y={canvasHeight - GROUND_HEIGHT + 5}>
            {/* Pit hole */}
            <Rect
              width={width}
              height={height}
              offsetX={width / 2}
              offsetY={0}
              fill="#000000"
              cornerRadius={5}
            />
            
            {/* Pit edges - gives depth */}
            <Rect
              width={width + 6}
              height={3}
              offsetX={(width + 6) / 2}
              offsetY={3}
              fill="#A0522D"
            />
          </Group>
        );
        
      case 'bird':
        return (
          <Group x={x} y={obstacleY}>
            {/* Bird body */}
            <Circle
              radius={height * 0.5}
              fill="#FF5252"
            />
            
            {/* Bird wings */}
            <Line
              points={[
                0, 0,
                -width * 0.5, -height * 0.3,
                -width * 0.3, height * 0.1,
              ]}
              closed
              fill="#E53935"
            />
            <Line
              points={[
                0, 0,
                width * 0.5, -height * 0.3,
                width * 0.3, height * 0.1,
              ]}
              closed
              fill="#E53935"
            />
            
            {/* Bird head */}
            <Circle
              radius={height * 0.3}
              x={width * 0.3}
              y={-height * 0.1}
              fill="#FF5252"
            />
            
            {/* Bird eyes */}
            <Circle
              radius={height * 0.05}
              x={width * 0.4}
              y={-height * 0.15}
              fill="#000"
            />
            
            {/* Bird beak */}
            <Line
              points={[
                width * 0.5, -height * 0.1,
                width * 0.7, -height * 0.15,
                width * 0.5, -height * 0.2,
              ]}
              closed
              fill="#FF9800"
            />
          </Group>
        );
      
      default:
        return (
          <Rect
            x={x}
            y={obstacleY}
            width={width}
            height={height}
            offsetX={width / 2}
            offsetY={height / 2}
            fill="red"
          />
        );
    }
  };

  return (
    <>
      {obstacles.map((obstacle, i) => (
        <Group key={`obstacle-${i}-${obstacle.type}`}>
          {renderObstacle(obstacle)}
        </Group>
      ))}
    </>
  );
};

export default memo(ObstacleRenderer);