// Game speed types that correspond to difficulty levels
export type GameSpeed = number;

// Types of obstacles that can appear in the game
export type ObstacleType = 'cactus' | 'rock' | 'pit' | 'bird';

// Types of background elements for parallax effect
export type BackgroundElementType = 'cloud' | 'mountain' | 'hill' | 'bush';

// Game state
export interface GameState {
  characterPos: { x: number; y: number };
  characterVelocity: number;
  isJumping: boolean;
  obstacles: Array<Obstacle>;
  backgroundElements: Array<BackgroundElement>;
}

// Obstacle object
export interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: ObstacleType;
  y?: number; // Optional y position for flying obstacles
}

// Background element
export interface BackgroundElement {
  x: number;
  y: number;
  type: BackgroundElementType;
  scale: number;
}

// Animation frame for character sprites
export interface AnimationFrame {
  id: string; 
  duration: number; // milliseconds
}