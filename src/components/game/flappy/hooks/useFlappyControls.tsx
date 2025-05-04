import { useEffect, useCallback } from 'react';
import Konva from 'konva';

// Custom hook to manage user interaction with the game - simplified
export const useFlappyControls = (
  isPlaying: boolean,
  gameOver: boolean,
  startGame: () => void,
  resetGame: () => void,
  flap: () => void
) => {
  // Handle canvas interaction (mouse clicks and touch)
  const handleCanvasInteraction = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Don't handle click if it's propagated from the ThemeSwitch
    if (e.target.name() === 'themeSwitch') return;
    
    if (!isPlaying && !gameOver) {
      startGame();
      // Add immediate flap on game start for better UX
      setTimeout(() => flap(), 10);
    } else if (isPlaying) {
      flap();
    } else if (gameOver) {
      resetGame();
    }
  }, [isPlaying, gameOver, startGame, resetGame, flap]);

  // Set up space key control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        if (!isPlaying && !gameOver) {
          startGame();
          // Add immediate flap on game start with space key
          setTimeout(() => flap(), 10);
        } else if (isPlaying) {
          flap();
        } else if (gameOver) {
          resetGame();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame, resetGame, flap]);

  return {
    handleCanvasInteraction
  };
};