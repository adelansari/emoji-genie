import { FC, memo } from 'react';
import { Layer, Rect, Group } from 'react-konva';

interface FlappyBackgroundProps {
  width: number;
  height: number;
}

const FlappyBackground: FC<FlappyBackgroundProps> = ({ width, height }) => {
  // Calculate ground height - 10% of canvas height
  const groundHeight = height * 0.1;
  
  return (
    <>
      {/* Sky background */}
      <Rect width={width} height={height} fill="#87CEEB" />
      
      {/* Clouds - render 3 clouds at different positions */}
      {[...Array(3)].map((_, i) => (
        <Group 
          key={`cloud-${i}`} 
          x={(width * 0.2) * i + (width * 0.1)} 
          y={(height * 0.1) * (i % 2) + (height * 0.08)}
        >
          <Rect 
            width={width * 0.15} 
            height={height * 0.07} 
            cornerRadius={width * 0.04} 
            fill="white" 
            opacity={0.9} 
          />
        </Group>
      ))}
      
      {/* Ground */}
      <Rect
        y={height - groundHeight}
        width={width}
        height={groundHeight}
        fill="#8B4513"
      />
    </>
  );
};

export default memo(FlappyBackground);