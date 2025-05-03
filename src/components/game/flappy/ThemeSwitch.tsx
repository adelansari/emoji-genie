import { FC, memo } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { GameTheme } from './storageUtils';
import { THEME_CYCLE } from './config';

interface ThemeSwitchProps {
  width: number;
  height: number;
  currentTheme: GameTheme;
  onThemeChange: (theme: GameTheme) => void;
  disabled: boolean;
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({
  width,
  height,
  currentTheme,
  onThemeChange,
  disabled
}) => {
  const buttonSize = Math.min(width * 0.1, 50);
  const x = width - buttonSize - 10;
  const y = 10;
  
  // Get next theme in cycle
  const handleClick = () => {
    if (disabled) return;
    
    const currentIndex = THEME_CYCLE.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    onThemeChange(THEME_CYCLE[nextIndex] as GameTheme);
  };
  
  // Theme icon colors
  const getThemeColor = () => {
    switch (currentTheme) {
      case 'day': return "#FFD700"; // Sun - gold
      case 'sunset': return "#FF7F50"; // Sunset - coral
      case 'night': return "#E1E1E1"; // Moon - light grey
      default: return "#FFD700";
    }
  };
  
  // Theme icon
  const renderThemeIcon = () => {
    const iconSize = buttonSize * 0.6;
    const centerX = buttonSize / 2;
    const centerY = buttonSize / 2;
    
    switch (currentTheme) {
      case 'day':
        return (
          <Circle
            x={centerX}
            y={centerY}
            radius={iconSize / 2}
            fill="#FFD700"
          />
        );
      case 'sunset':
        return (
          <Group>
            <Circle
              x={centerX}
              y={centerY}
              radius={iconSize / 2}
              fill="#FF7F50"
            />
            <Rect
              x={centerX - iconSize/2}
              y={centerY}
              width={iconSize}
              height={iconSize/2}
              fill="#543D29"
            />
          </Group>
        );
      case 'night':
        return (
          <Group>
            <Circle
              x={centerX}
              y={centerY}
              radius={iconSize / 2}
              fill="#E1E1E1"
            />
            <Circle
              x={centerX + 2}
              y={centerY - 2}
              radius={iconSize / 2.5}
              fill="#1A237E"
            />
          </Group>
        );
    }
  };
  
  return (
    <Group 
      x={x} 
      y={y}
      opacity={disabled ? 0.7 : 1}
      onClick={handleClick}
      onTap={handleClick}
    >
      <Rect
        width={buttonSize}
        height={buttonSize}
        fill="rgba(0,0,0,0.5)"
        cornerRadius={10}
      />
      {renderThemeIcon()}
    </Group>
  );
};

export default memo(ThemeSwitch);