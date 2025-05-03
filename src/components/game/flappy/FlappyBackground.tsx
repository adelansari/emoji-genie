import { FC, memo, useRef, useState, useEffect } from 'react';
import { Layer, Rect, Group, Circle, Star } from 'react-konva';
import { THEME_COLORS } from './config';
import { GameTheme } from './storageUtils';

interface FlappyBackgroundProps {
  width: number;
  height: number;
  theme: GameTheme;
  isPlaying: boolean;
  gameSpeed: number;
}

const FlappyBackground: FC<FlappyBackgroundProps> = ({ width, height, theme, isPlaying, gameSpeed }) => {
  // Calculate ground height - 10% of canvas height
  const groundHeight = height * 0.1;
  const colors = THEME_COLORS[theme];
  
  // Ground scrolling state
  const [groundOffset, setGroundOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Ground pattern settings
  const segmentWidth = width * 0.2; // Width of a single ground segment
  const numSegments = Math.ceil(width / segmentWidth) + 1; // Number of segments needed to fill screen plus one extra
  
  // Ground animation effect
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animateGround = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Move ground based on game speed and elapsed time
      // This keeps ground movement in sync with pipe movement
      setGroundOffset((prevOffset) => {
        // Calculate new offset based on game speed
        let newOffset = prevOffset + (gameSpeed * (elapsed / 16.667));
        
        // Reset when a full segment has scrolled out of view
        if (newOffset >= segmentWidth) {
          newOffset = newOffset % segmentWidth;
        }
        
        return newOffset;
      });
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animateGround);
    };
    
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animateGround);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, gameSpeed, segmentWidth]);
  
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
      
      {/* Scrolling Ground - Using multiple segments that move */}
      <Group y={height - groundHeight}>
        {/* Main ground pieces that repeat */}
        {[...Array(numSegments)].map((_, i) => (
          <Group key={`ground-segment-${i}`} x={i * segmentWidth - groundOffset}>
            {/* Ground base */}
            <Rect
              width={segmentWidth}
              height={groundHeight}
              fill={colors.ground}
            />
            
            {/* Ground details - bumps and texture */}
            {[...Array(3)].map((_, j) => (
              <Rect
                key={`ground-detail-${i}-${j}`}
                x={segmentWidth * (j * 0.25 + 0.1)}
                y={groundHeight * 0.3}
                width={segmentWidth * 0.15}
                height={groundHeight * 0.2}
                fill={theme === 'night' ? "#2D221E" : theme === 'sunset' ? "#553D30" : "#7D3E13"}
                cornerRadius={2}
              />
            ))}
            
            {/* Top edge detail - grass or terrain line */}
            <Rect
              width={segmentWidth}
              height={groundHeight * 0.1}
              fill={theme === 'night' ? "#3E2E2A" : theme === 'sunset' ? "#674D3F" : "#A05226"}
            />
          </Group>
        ))}
      </Group>
    </>
  );
};

export default memo(FlappyBackground);