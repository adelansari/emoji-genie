import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useGame } from '../../../context/GameContext';
import { useEmojiCustomization } from '../../../context/EmojiCustomizationContext';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

// Import our new modular components
import FlappyCharacter from './FlappyCharacter';
import FlappyBackground from './FlappyBackground';
import FlappyPipes from './FlappyPipes';
import FlappyUI from './FlappyUI';
import { BIRD_SIZE_BASE } from './config';
import { getResponsiveCanvasSize, calculateGamePhysics } from './config';
import { updatePipes, checkCollision } from './gameUtils';
import type { PipeData } from './FlappyPipes';

const FlappyGame = () => {
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
    characterImageUrl, 
    emojiType 
  } = useGame();
  
  // Refs
  const stageRef = useRef<Konva.Stage>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // State
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [birdPosition, setBirdPosition] = useState({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);

  // Dynamic calculations based on canvas size
  const birdSize = useMemo(() => BIRD_SIZE_BASE * (canvasSize.width / 600), [canvasSize.width]);
  const pipeGap = useMemo(() => canvasSize.height * 0.35, [canvasSize.height]);
  
  // Calculate physics constants based on difficulty
  const { gravity, flapStrength } = useMemo(() => calculateGamePhysics(gameSpeed), [gameSpeed]);
  
  // Default character color for fallback
  const characterColor = useMemo(() => {
    return emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  }, [emojiType]);
  
  // Load character image
  useEffect(() => {
    if (characterImageUrl) {
      const img = new window.Image();
      img.src = characterImageUrl;
      img.onload = () => setCharacterImage(img);
      img.onerror = () => {
        console.error("Failed to load character image.");
        setCharacterImage(null);
      };
    } else {
      setCharacterImage(null);
    }
  }, [characterImageUrl]);

  // Bird flap function
  const flap = useCallback(() => {
    if (!isPlaying) return;
    setBirdVelocity(flapStrength);
  }, [isPlaying, flapStrength]);

  // Handle canvas interaction
  const handleCanvasInteraction = useCallback(() => {
    if (!isPlaying && !gameOver) {
      startGame();
      setTimeout(() => setBirdVelocity(flapStrength), 10);
    } else if (isPlaying) {
      flap();
    } else if (gameOver) {
      resetGame();
    }
  }, [isPlaying, gameOver, startGame, resetGame, flap, flapStrength]);

  // Set up responsive canvas
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset bird position when canvas size changes (when not playing)
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]);
    }
  }, [canvasSize, isPlaying, gameOver]);

  // Set up space key control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying && !gameOver) {
          startGame();
          setTimeout(() => setBirdVelocity(flapStrength), 10);
        } else if (isPlaying) {
          flap();
        } else if (gameOver) {
          resetGame();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame, resetGame, flap, flapStrength]);
  
  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      // Physics updates
      const newVelocity = Math.max(-10, Math.min(10, birdVelocity + gravity));
      
      // Modified: Only prevent bird from going above the ceiling, not below the ground
      // This allows proper ground collision detection
      const newPosition = {
        x: birdPosition.x,
        y: Math.max(birdSize/2, birdPosition.y + newVelocity)
      };
      
      setBirdVelocity(newVelocity);
      setBirdPosition(newPosition);
      
      // Check for collisions before updating pipes - this ensures ground detection works
      if (checkCollision(
        birdPosition.x,
        birdPosition.y,
        birdSize,
        pipes,
        canvasSize.height
      )) {
        endGame();
        return;
      }
      
      // Update pipes and check for score
      setPipes(currentPipes => updatePipes(
        currentPipes, 
        gameSpeed, 
        birdPosition.x, 
        canvasSize.width, 
        canvasSize.height,
        pipeGap,
        incrementScore
      ));
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(gameLoop);
    
    // Cleanup on unmount or game end
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    birdPosition,
    birdVelocity,
    pipes,
    isPlaying,
    gameSpeed,
    gravity,
    incrementScore,
    canvasSize,
    birdSize,
    endGame,
    pipeGap
  ]);
  
  // Reset game state when game is reset
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]);
    }
  }, [isPlaying, gameOver, canvasSize]);
  
  // Calculate bird rotation based on velocity (for visual effect)
  const birdRotation = Math.max(-30, Math.min(30, birdVelocity * 3));
  
  return (
    <div className="flex flex-col items-center">
      <Stage 
        width={canvasSize.width} 
        height={canvasSize.height}
        ref={stageRef}
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        className="bg-sky-500 rounded-lg shadow-xl cursor-pointer"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <Layer>
          {/* Game background */}
          <FlappyBackground width={canvasSize.width} height={canvasSize.height} />
          
          {/* Pipes */}
          <FlappyPipes pipes={pipes} canvasHeight={canvasSize.height} />
          
          {/* Character */}
          <FlappyCharacter
            x={birdPosition.x}
            y={birdPosition.y}
            size={birdSize}
            rotation={birdRotation}
            emojiType={emojiType}
            characterImage={characterImage}
            characterColor={characterColor}
          />
          
          {/* UI Elements */}
          <FlappyUI 
            width={canvasSize.width}
            height={canvasSize.height}
            score={score}
            highScore={highScore}
            isPlaying={isPlaying}
            gameOver={gameOver}
            characterImage={characterImage}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);