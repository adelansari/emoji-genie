import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useGame } from '../../../context/GameContext';
import { useEmojiCustomization } from '../../../context/EmojiCustomizationContext';
import { Stage, Layer } from 'react-konva';
import { RunnerGameEngine, GROUND_HEIGHT } from './engine/RunnerGameEngine';
import { GameState } from './types';
import BackgroundRenderer from './renderers/BackgroundRenderer';
import ObstacleRenderer from './renderers/ObstacleRenderer';
import CharacterRenderer from './renderers/CharacterRenderer';
import UIRenderer from './renderers/UIRenderer';

// Function to calculate responsive canvas size optimized for a runner game
const getResponsiveCanvasSize = () => {
  const padding = 32;
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.7;
  const maxWidth = 800;
  const maxHeight = 450;
  const minWidth = 320;
  const minHeight = 180;

  // For runner game we want a landscape orientation
  const width = Math.max(minWidth, Math.min(maxWidth, availableWidth));
  const height = Math.max(minHeight, Math.min(maxHeight, Math.min(width * 0.5625, availableHeight)));
  
  return { width, height };
};

const RunnerGame = () => {
  const { 
    score,
    highScore, 
    isPlaying,
    gameOver,
    startGame,
    resetGame,
    incrementScore,
    endGame,
    gameSpeed,
    characterImageUrl
  } = useGame();

  const { emojiType } = useEmojiCustomization();
  
  // References
  const stageRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const gameEngineRef = useRef<RunnerGameEngine | null>(null);
  
  // State
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [gameState, setGameState] = useState<GameState>({
    characterPos: { x: 0, y: 0 },
    characterVelocity: 0,
    isJumping: false,
    obstacles: [],
    backgroundElements: []
  });

  // Initialize game engine
  useEffect(() => {
    gameEngineRef.current = new RunnerGameEngine(
      gameSpeed,
      canvasSize.width,
      canvasSize.height,
      incrementScore,
      endGame,
      (newState) => setGameState(newState)
    );
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Reset game when necessary
  useEffect(() => {
    if (!isPlaying && !gameOver && gameEngineRef.current) {
      gameEngineRef.current.initGame(gameSpeed, canvasSize.width, canvasSize.height);
    }
  }, [isPlaying, gameOver, gameSpeed, canvasSize]);
  
  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const newSize = getResponsiveCanvasSize();
      setCanvasSize(newSize);
      
      // Re-initialize game engine with new canvas size
      if (gameEngineRef.current) {
        gameEngineRef.current.initGame(gameSpeed, newSize.width, newSize.height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [gameSpeed]);
  
  // Game loop
  useEffect(() => {
    if (!isPlaying || !gameEngineRef.current) return;
    
    const gameLoop = (timestamp: number) => {
      if (!gameEngineRef.current) return;
      
      const continueGame = gameEngineRef.current.update(timestamp);
      
      if (continueGame) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying]);
  
  // Handle keyboard events for jumping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && isPlaying && gameEngineRef.current) {
        e.preventDefault();
        gameEngineRef.current.handleJump();
      } else if ((e.code === 'Space' || e.code === 'Enter') && gameOver) {
        resetGame();
      } else if ((e.code === 'Space' || e.code === 'Enter') && !isPlaying && !gameOver) {
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame, resetGame]);
  
  // Handle canvas interaction for jumping/starting
  const handleCanvasInteraction = useCallback(() => {
    if (!isPlaying && !gameOver) {
      startGame();
    } else if (isPlaying && gameEngineRef.current) {
      gameEngineRef.current.handleJump();
    } else if (gameOver) {
      resetGame();
    }
  }, [isPlaying, gameOver, startGame, resetGame]);
  
  return (
    <div className="flex flex-col items-center">
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        ref={stageRef}
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        className="bg-sky-700 rounded-lg shadow-xl cursor-pointer"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <Layer>
          {/* Background elements */}
          <BackgroundRenderer 
            elements={gameState.backgroundElements}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            groundHeight={GROUND_HEIGHT}
          />
          
          {/* Obstacles */}
          <ObstacleRenderer 
            obstacles={gameState.obstacles}
            canvasHeight={canvasSize.height}
          />
          
          {/* Character */}
          <CharacterRenderer
            x={gameState.characterPos.x}
            y={gameState.characterPos.y}
            isJumping={gameState.isJumping}
            emojiType={emojiType}
            characterImageUrl={characterImageUrl}
          />
          
          {/* UI elements (score, messages) */}
          <UIRenderer
            score={score}
            highScore={highScore}
            isPlaying={isPlaying}
            gameOver={gameOver}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(RunnerGame);