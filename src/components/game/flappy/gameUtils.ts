import { PIPE_WIDTH } from './config';
import type { PipeData } from './FlappyPipes';

// Creates a new pipe with a random gap position
export const createPipe = (canvasWidth: number, canvasHeight: number, pipeGap: number): PipeData => {
  const minTopHeight = canvasHeight * 0.1; // Min 10% from top
  const maxTopHeight = canvasHeight - pipeGap - (canvasHeight * 0.1); // Max 10% from bottom (considering ground)
  const topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight) + minTopHeight);
  
  return {
    x: canvasWidth, // Start pipe at the right edge
    topHeight,
    passed: false,
    gap: pipeGap
  };
};

// Moves all pipes and creates new ones as needed
export const updatePipes = (
  pipes: PipeData[], 
  gameSpeed: number, 
  birdX: number, 
  canvasWidth: number, 
  canvasHeight: number,
  pipeGap: number,
  onScore: () => void
): PipeData[] => {
  let updatedPipes = pipes.map(pipe => {
    const newX = pipe.x - gameSpeed;
    
    // Check if bird passed the pipe to increment score
    if (!pipe.passed && newX + PIPE_WIDTH < birdX) {
      onScore();
      return { ...pipe, x: newX, passed: true };
    }
    
    return { ...pipe, x: newX };
  }).filter(pipe => pipe.x > -PIPE_WIDTH); // Remove pipes that are off screen
  
  // Add new pipe when needed
  const pipeSpacing = canvasWidth * 0.6;
  if (updatedPipes.length === 0 || 
      updatedPipes[updatedPipes.length - 1].x < canvasWidth - pipeSpacing) {
    updatedPipes.push(createPipe(canvasWidth, canvasHeight, pipeGap));
  }
  
  return updatedPipes;
};

// Checks for collision between bird and pipes or ground
export const checkCollision = (
  birdX: number, 
  birdY: number, 
  birdSize: number, 
  pipes: PipeData[], 
  canvasHeight: number
): boolean => {
  const groundHeight = canvasHeight * 0.1;
  
  // Check ground collision
  if (birdY + birdSize/2 > canvasHeight - groundHeight) {
    return true;
  }
  
  // Check ceiling collision
  if (birdY - birdSize/2 < 0) {
    return true;
  }
  
  // Create a smaller hitbox for better gameplay feel
  const hitboxReduction = birdSize * 0.2;
  const hitboxLeft = birdX - birdSize/2 + hitboxReduction;
  const hitboxRight = birdX + birdSize/2 - hitboxReduction;
  const hitboxTop = birdY - birdSize/2 + hitboxReduction;
  const hitboxBottom = birdY + birdSize/2 - hitboxReduction;
  
  // Check pipe collisions
  for (const pipe of pipes) {
    // Check if bird is horizontally aligned with pipe
    if (hitboxRight > pipe.x && hitboxLeft < pipe.x + PIPE_WIDTH) {
      // Check if bird hits top pipe
      if (hitboxTop < pipe.topHeight) {
        return true;
      }
      // Check if bird hits bottom pipe
      if (hitboxBottom > pipe.topHeight + pipe.gap) {
        return true;
      }
    }
  }
  
  return false;
};