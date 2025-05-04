// Main components
import FlappyGame from './FlappyGame';
import FlappyGameControls from './FlappyGameControls';

// Visual components
import FlappyBackground from './FlappyBackground';
import FlappyCharacter from './FlappyCharacter';
import FlappyPipes from './FlappyPipes';
import FlappyUI from './FlappyUI';
import FlappyEffects from './FlappyEffects';
import FlappyAchievement from './FlappyAchievement';
import ThemeSwitch from './ThemeSwitch';

// Custom hooks
import { useCanvasSize } from './hooks/useCanvasSize';
import { useFlappyPhysics } from './hooks/useFlappyPhysics';
import { useFlappyAchievements } from './hooks/useFlappyAchievements';
import { useFlappyControls } from './hooks/useFlappyControls';

export { 
  // Main components
  FlappyGame, 
  FlappyGameControls,
  
  // Visual components
  FlappyBackground,
  FlappyCharacter,
  FlappyPipes,
  FlappyUI,
  FlappyEffects,
  FlappyAchievement,
  ThemeSwitch,
  
  // Custom hooks
  useCanvasSize,
  useFlappyPhysics,
  useFlappyAchievements,
  useFlappyControls
};