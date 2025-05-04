import { FC, memo } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { GameTheme } from './storageUtils';
import { THEME_CYCLE } from './config';
import Konva from 'konva';

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
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Stop event propagation to prevent canvas click handler from firing
    e.cancelBubble = true;
    
    if (disabled) return;
    
    const currentIndex = THEME_CYCLE.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    onThemeChange(THEME_CYCLE[nextIndex] as GameTheme);
  };
  
  // Theme-specific icons
  const renderThemeIcon = () => {
    if (currentTheme === 'night') {
      // Moon icon
      return (
        <Circle
          radius={buttonSize * 0.3}
          fill="#FFFFFF"
          offsetX={-buttonSize * 0.1}
        />
      );
    } else if (currentTheme === 'sunset') {
      // Sun setting icon
      return (
        <Circle
          radius={buttonSize * 0.3}
          fill="#FFC107"
        />
      );
    } else {
      // Day sun icon
      return (
        <Circle
          radius={buttonSize * 0.3}
          fill="#FFC107"
        />
      );
    }
  };

  return (
    <Group
      x={x}
      y={y}
      opacity={disabled ? 0.6 : 1}
      name="themeSwitch" // Important for event bubbling check
    >
      {/* Main button background */}
      <Rect
        width={buttonSize}
        height={buttonSize}
        fill={disabled ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
        cornerRadius={8}
        stroke={disabled ? "#555555" : "#CCCCCC"}
        strokeWidth={1}
        onClick={handleClick}
        onTap={handleClick}
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.3}
        shadowOffset={{ x: 1, y: 1 }}
      />
      
      {/* Theme icon */}
      <Group
        x={buttonSize / 2}
        y={buttonSize / 2}
        onClick={handleClick}
        onTap={handleClick}
      >
        {renderThemeIcon()}
      </Group>
    </Group>
  );
};

export default memo(ThemeSwitch);