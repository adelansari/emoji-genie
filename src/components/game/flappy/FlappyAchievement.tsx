import { FC, memo, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { ACHIEVEMENT_DISPLAY } from './config';
import { GameTheme, StoredAchievement } from './storageUtils';

interface FlappyAchievementProps {
  achievements: StoredAchievement[];
  width: number;
  height: number;
  isPlaying: boolean;
  gameTheme: GameTheme;
}

const FlappyAchievement: FC<FlappyAchievementProps> = ({ 
  achievements, 
  width, 
  height,
  isPlaying,
  gameTheme
}) => {
  const [currentAchievement, setCurrentAchievement] = useState<StoredAchievement | null>(null);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  // Check for newly unlocked achievements
  useEffect(() => {
    // Only check for achievements when not actively playing
    if (isPlaying) return;
    
    // Find first newly unlocked achievement
    const newlyUnlocked = achievements.find(a => a.unlocked && a.progress >= a.milestone);
    
    if (newlyUnlocked && !currentAchievement) {
      setCurrentAchievement(newlyUnlocked);
      setVisible(true);
      setOpacity(0);
      
      // Fade in
      const fadeIn = setTimeout(() => {
        setOpacity(1);
      }, 100);
      
      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        setOpacity(0);
        
        // After fade out, mark as no longer new
        const finalHide = setTimeout(() => {
          setVisible(false);
          setCurrentAchievement(null);
        }, 500);
        
        return () => clearTimeout(finalHide);
      }, ACHIEVEMENT_DISPLAY.duration);
      
      return () => {
        clearTimeout(fadeIn);
        clearTimeout(hideTimer);
      };
    }
  }, [achievements, currentAchievement, isPlaying]);
  
  if (!visible || !currentAchievement) return null;
  
  const { position } = ACHIEVEMENT_DISPLAY;
  const x = width * position.x;
  const y = height * position.y;
  
  // Responsive sizes
  const notifWidth = Math.min(400, width * 0.8);
  const notifHeight = height * 0.15;
  const fontSize = Math.max(16, Math.min(24, width * 0.04));
  const descFontSize = fontSize * 0.75;
  
  // Text colors based on theme
  const textColor = gameTheme === 'night' ? "#FFECB3" : 
                    gameTheme === 'sunset' ? "#FFD700" : "#FFDD00";
  const bgColor = gameTheme === 'night' 
    ? "rgba(38, 50, 56, 0.85)" 
    : gameTheme === 'sunset'
      ? "rgba(70, 40, 20, 0.85)"
      : "rgba(0, 0, 0, 0.75)";
  
  return (
    <Group
      x={x}
      y={y}
      opacity={opacity}
      offsetX={notifWidth / 2}
      offsetY={notifHeight / 2}
    >
      <Rect
        width={notifWidth}
        height={notifHeight}
        fill={bgColor}
        cornerRadius={10}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.5}
        shadowOffset={{ x: 2, y: 2 }}
      />
      
      <Text
        text="🏆 Achievement Unlocked!"
        fontSize={fontSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill={textColor}
        width={notifWidth}
        align="center"
        y={notifHeight * 0.2}
      />
      
      <Text
        text={currentAchievement.title}
        fontSize={fontSize}
        fontFamily="Arial"
        fontStyle="bold"
        fill="white"
        width={notifWidth}
        align="center"
        y={notifHeight * 0.45}
      />
      
      <Text
        text={currentAchievement.description}
        fontSize={descFontSize}
        fontFamily="Arial"
        fill="white"
        opacity={0.8}
        width={notifWidth * 0.9}
        x={notifWidth * 0.05}
        align="center"
        y={notifHeight * 0.7}
      />
    </Group>
  );
};

export default memo(FlappyAchievement);