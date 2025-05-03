import { FC, memo } from 'react';
import { Layer, Rect, Group, Circle, Star } from 'react-konva';
import { THEME_COLORS } from './config';
import { GameTheme } from './storageUtils';

interface FlappyBackgroundProps {
  width: number;
  height: number;
  theme: GameTheme;
}

const FlappyBackground: FC<FlappyBackgroundProps> = ({ width, height, theme }) => {
  // Calculate ground height - 10% of canvas height
  const groundHeight = height * 0.1;
  const colors = THEME_COLORS[theme];
  
  return (
    <>
      {/* Sky background */}
      <Rect width={width} height={height} fill={colors.sky} />
      
      {theme === 'night' ? (
        // Night theme elements
        <>
          {/* Stars */}
          {[...Array(20)].map((_, i) => {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.6;
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.5 + 0.3;
            
            return (
              <Circle
                key={`star-${i}`}
                x={x}
                y={y}
                radius={size}
                fill="white"
                opacity={opacity}
              />
            );
          })}
          
          {/* Moon */}
          <Group x={width * 0.8} y={height * 0.15}>
            <Circle radius={width * 0.06} fill="#E1E1E1" />
            <Circle radius={width * 0.05} x={width * 0.01} y={-width * 0.01} fill={colors.sky} opacity={0.4} />
          </Group>
        </>
      ) : theme === 'sunset' ? (
        // Sunset theme elements
        <>
          {/* Sun setting */}
          <Circle
            x={width * 0.75}
            y={height * 0.25}
            radius={width * 0.12}
            fill="#FF9900"
          />
          
          {/* Sunset clouds */}
          {[...Array(3)].map((_, i) => (
            <Group 
              key={`cloud-${i}`} 
              x={(width * 0.25) * i + (width * 0.1)} 
              y={(height * 0.12) * (i % 3) + (height * 0.06)}
            >
              <Rect 
                width={width * 0.18} 
                height={height * 0.08} 
                cornerRadius={width * 0.04} 
                fill={colors.cloud}
                opacity={0.8} 
              />
            </Group>
          ))}
          
          {/* Mountain silhouettes */}
          <Group>
            <Circle 
              x={width * 0.2} 
              y={height - groundHeight} 
              radius={height * 0.35} 
              fill="#4A3726"
            />
            <Circle 
              x={width * 0.6} 
              y={height - groundHeight} 
              radius={height * 0.25} 
              fill="#3A2A1C"
            />
            <Circle 
              x={width * 0.85} 
              y={height - groundHeight} 
              radius={height * 0.2} 
              fill="#312212"
            />
          </Group>
        </>
      ) : (
        // Day theme elements (clouds)
        [...Array(4)].map((_, i) => (
          <Group 
            key={`cloud-${i}`} 
            x={(width * 0.2) * i + (width * 0.1)} 
            y={(height * 0.1) * (i % 3) + (height * 0.08)}
          >
            <Rect 
              width={width * 0.15} 
              height={height * 0.07} 
              cornerRadius={width * 0.04} 
              fill={colors.cloud} 
              opacity={0.9} 
            />
          </Group>
        ))
      )}
      
      {/* Ground */}
      <Rect
        y={height - groundHeight}
        width={width}
        height={groundHeight}
        fill={colors.ground}
      />
      
      {/* Ground details */}
      {[...Array(8)].map((_, i) => (
        <Rect
          key={`ground-detail-${i}`}
          x={width * (i * 0.12)}
          y={height - groundHeight + (groundHeight * 0.3)}
          width={width * 0.08}
          height={groundHeight * 0.2}
          fill={theme === 'night' ? "#2D221E" : theme === 'sunset' ? "#553D30" : "#7D3E13"}
          cornerRadius={2}
        />
      ))}
    </>
  );
};

export default memo(FlappyBackground);