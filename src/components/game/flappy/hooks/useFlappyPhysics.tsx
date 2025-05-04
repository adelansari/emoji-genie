import { useState, useRef, useCallback, useEffect } from 'react';
import { calculateGamePhysics } from '../config';
import { checkCollision, updatePipes } from '../gameUtils';
import type { PipeData } from '../FlappyPipes';

// Custom hook to handle all the flappy bird physics
export const useFlappyPhysics = (
  isPlaying: boolean,
  gameOver: boolean,
  canvasSize: { width: number, height: number },
  gameSpeed: number,
  birdSize: number,
  pipeGap: number,
  onGameEnd: () => void,
  onScoreIncrement: () => void
) => {
  // Game state refs to avoid re-renders
  const birdPositionRef = useRef({ x: 0, y: 0 });
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<PipeData[]>([]);
  const frameCountRef = useRef(0);
  const physicsDeltaRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Physics state needed by component for rendering
  const [birdPosition, setBirdPosition] = useState({ 
    x: canvasSize.width * 0.2, 
    y: canvasSize.height / 2 
  });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);

  // Calculate physics constants based on difficulty
  const { gravity, flapStrength } = calculateGamePhysics(gameSpeed);

  // Initialize bird position
  useEffect(() => {
    birdPositionRef.current = { 
      x: canvasSize.width * 0.2, 
      y: canvasSize.height / 2 
    };
  }, [canvasSize]);

  // Reset positions when canvas size changes (when not playing)
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      const newPosition = { 
        x: canvasSize.width * 0.2, 
        y: canvasSize.height / 2 
      };
      birdPositionRef.current = newPosition;
      setBirdPosition(newPosition);
      birdVelocityRef.current = 0;
      setBirdVelocity(0);
      pipesRef.current = [];
      setPipes([]);
    }
  }, [canvasSize, isPlaying, gameOver]);

  // Reset game physics state
  const resetPhysics = useCallback(() => {
    // Reset positions
    birdPositionRef.current = { 
      x: canvasSize.width * 0.2, 
      y: canvasSize.height / 2 
    };
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    
    // Update React state to match
    setBirdPosition(birdPositionRef.current);
    setBirdVelocity(0);
    setPipes([]);
  }, [canvasSize]);

  // Bird flap function
  const flap = useCallback(() => {
    if (!isPlaying) return;
    
    // Update ref immediately for responsive gameplay
    birdVelocityRef.current = flapStrength;
    
    // Update React state for the rotation calculation
    setBirdVelocity(flapStrength);
  }, [isPlaying, flapStrength]);

  // GAME LOOP
  useEffect(() => {
    if (!isPlaying) return;

    let previousTime = 0;
    const frameInterval = 1000 / 60; // Target 60 FPS
    
    const gameLoop = (currentTime: number) => {
      if (!isPlaying) return;
      
      // Calculate time delta
      const elapsed = previousTime ? currentTime - previousTime : frameInterval;
      previousTime = currentTime;
      
      // Skip frame if browser tab is inactive (elapsed is too large)
      if (elapsed > 100) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Physics update based on elapsed time
      physicsDeltaRef.current += elapsed;
      
      // Fixed physics timestep for consistent behavior
      const physicsStep = 16; // ~60 FPS physics
      
      // Accumulate time and run physics in fixed steps
      while (physicsDeltaRef.current >= physicsStep) {
        const scaledGravity = gravity * (physicsStep / 1000) * 60;
        
        // Update bird physics
        birdVelocityRef.current += scaledGravity;
        birdPositionRef.current.y += birdVelocityRef.current;
        
        // Check ceiling and ground collisions
        if (birdPositionRef.current.y < birdSize / 2) {
          birdPositionRef.current.y = birdSize / 2;
          birdVelocityRef.current = 0;
        } else if (birdPositionRef.current.y > canvasSize.height - birdSize / 2) {
          birdPositionRef.current.y = canvasSize.height - birdSize / 2;
          onGameEnd();
          return;
        }
        
        physicsDeltaRef.current -= physicsStep;
      }

      // Check pipe collisions
      if (checkCollision(
        birdPositionRef.current.x,
        birdPositionRef.current.y,
        birdSize,
        pipesRef.current,
        canvasSize.height
      )) {
        onGameEnd();
        return;
      }
      
      // Move pipes - use elapsed time for smooth movement
      pipesRef.current = updatePipes(
        pipesRef.current, 
        gameSpeed * (elapsed / 16.667), // Scale speed by actual frame time for consistency
        birdPositionRef.current.x, 
        canvasSize.width, 
        canvasSize.height,
        pipeGap,
        onScoreIncrement
      );
      
      // Increment frame counter
      frameCountRef.current++;
      
      // Update React state to render
      // Only update bird position less frequently to save performance
      if (frameCountRef.current % 2 === 0) {
        setBirdPosition({...birdPositionRef.current});
        setBirdVelocity(birdVelocityRef.current);
      }
      
      // Always update pipes every frame for smooth movement
      setPipes([...pipesRef.current]);
      
      // Continue the animation loop
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop and reset frame counter
    frameCountRef.current = 0;
    physicsDeltaRef.current = 0;
    previousTime = 0;
    animationRef.current = requestAnimationFrame(gameLoop);
    
    // Cleanup animation on unmount or game end
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [
    isPlaying,
    canvasSize,
    birdSize,
    gravity,
    gameSpeed,
    pipeGap,
    onGameEnd,
    onScoreIncrement
  ]);
  
  // Calculate bird rotation for visual effect
  const birdRotation = birdVelocity < 0 
    ? Math.max(-25, birdVelocity * 1.5)
    : Math.min(90, birdVelocity * 3);

  return {
    birdPosition,
    birdVelocity,
    birdRotation,
    pipes,
    flap,
    resetPhysics
  };
};