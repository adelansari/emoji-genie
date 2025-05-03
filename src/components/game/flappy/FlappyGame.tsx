import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useGame } from '../../../context/GameContext';
import { useEmojiCustomization } from '../../../context/EmojiCustomizationContext';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

// Import modular components
import FlappyCharacter from './FlappyCharacter';
import FlappyBackground from './FlappyBackground';
import FlappyPipes from './FlappyPipes';
import FlappyUI from './FlappyUI';
import FlappyEffects from './FlappyEffects';
import FlappyAchievement from './FlappyAchievement';
import ThemeSwitch from './ThemeSwitch';
import { BIRD_SIZE_BASE, HIGH_SCORE_ACHIEVEMENTS, GAME_COUNT_ACHIEVEMENTS } from './config';
import { getResponsiveCanvasSize, calculateGamePhysics } from './config';
import { updatePipes, checkCollision } from './gameUtils';
import type { PipeData } from './FlappyPipes';
import {
  GameTheme,
  StoredAchievement,
  getHighScore,
  saveHighScore,
  getGameTheme,
  saveGameTheme,
  getPlayCount,
  incrementPlayCount,
  getTotalPipesPassed,
  incrementTotalPipesPassed,
  getAchievements,
  saveAchievements
} from './storageUtils';

const FlappyGame = () => {
  // Game context state from Context API
  const { 
    score, 
    highScore, 
    isPlaying, 
    gameOver, 
    startGame: contextStartGame, 
    resetGame: contextResetGame, 
    incrementScore: contextIncrementScore, 
    endGame: contextEndGame, 
    gameSpeed, 
    characterImageUrl, 
    emojiType,
    playCount,
    totalPipesPassed,
    achievements
  } = useGame();
  
  // Refs for performance optimization
  const stageRef = useRef<Konva.Stage>(null);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  
  // Game state refs to avoid re-renders
  const birdPositionRef = useRef({ x: 0, y: 0 });
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<PipeData[]>([]);
  const frameCountRef = useRef(0);
  const physicsDeltaRef = useRef(0);
  
  // Local state (minimized to improve performance)
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [birdPosition, setBirdPosition] = useState({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);
  const [gameTheme, setGameTheme] = useState<GameTheme>('day');
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [localAchievements, setLocalAchievements] = useState<StoredAchievement[]>([]);
  const [pipesPassedThisGame, setPipesPassedThisGame] = useState(0);
  const [localHighScore, setLocalHighScore] = useState(highScore);
  const [localPlayCount, setLocalPlayCount] = useState(playCount);
  const [localTotalPipesPassed, setLocalTotalPipesPassed] = useState(totalPipesPassed);
  
  // Dynamic calculations based on canvas size
  const birdSize = useMemo(() => BIRD_SIZE_BASE * (canvasSize.width / 600), [canvasSize.width]);
  const pipeGap = useMemo(() => canvasSize.height * 0.35, [canvasSize.height]);
  
  // Calculate physics constants based on difficulty
  const { gravity, flapStrength } = useMemo(() => calculateGamePhysics(gameSpeed), [gameSpeed]);
  
  // Default character color for fallback
  const characterColor = useMemo(() => {
    return emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  }, [emojiType]);

  // Initialize refs with current state
  useEffect(() => {
    birdPositionRef.current = { x: canvasSize.width * 0.2, y: canvasSize.height / 2 };
  }, [canvasSize]);
  
  // Initialize from localStorage on first load
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    // Load high score
    const savedHighScore = getHighScore();
    if (savedHighScore > highScore) {
      setLocalHighScore(savedHighScore);
    }
    
    // Load theme
    setGameTheme(getGameTheme());
    
    // Load play count
    setLocalPlayCount(getPlayCount());
    
    // Load total pipes passed
    setLocalTotalPipesPassed(getTotalPipesPassed());
    
    // Load or initialize achievements
    const savedAchievements = getAchievements();
    
    if (savedAchievements.length === 0) {
      // Initialize achievements if none exist in storage
      const initialAchievements: StoredAchievement[] = [
        ...HIGH_SCORE_ACHIEVEMENTS.map(a => ({
          ...a,
          progress: 0,
          unlocked: false
        })),
        ...GAME_COUNT_ACHIEVEMENTS.map(a => ({
          ...a,
          progress: 0,
          unlocked: false
        }))
      ];
      
      setLocalAchievements(initialAchievements);
      saveAchievements(initialAchievements);
    } else {
      setLocalAchievements(savedAchievements);
    }
  }, []);

  // Handle context state updates
  const startGame = useCallback(() => {
    contextStartGame();
    setPipesPassedThisGame(0);
    
    // Initialize bird position and velocity in refs
    birdPositionRef.current = { x: canvasSize.width * 0.2, y: canvasSize.height / 2 };
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    
    // Set initial react state too
    setBirdPosition(birdPositionRef.current);
    setBirdVelocity(0);
    setPipes([]);
    
    // Increment play count in localStorage
    const newPlayCount = incrementPlayCount();
    setLocalPlayCount(newPlayCount);
    
    // Update game count achievements
    updateAchievements('games', newPlayCount);
  }, [contextStartGame, canvasSize.width, canvasSize.height]);
  
  const endGame = useCallback(() => {
    contextEndGame();
    setShowDeathEffect(true);
    
    // Save high score if current score is higher
    if (score > localHighScore) {
      saveHighScore(score);
      setLocalHighScore(score);
      
      // Update score achievements
      updateAchievements('score', score);
    }
  }, [contextEndGame, score, localHighScore]);
  
  const incrementScore = useCallback(() => {
    contextIncrementScore();
    setPipesPassedThisGame(prev => prev + 1);
    
    // Update total pipes passed in localStorage
    const newTotal = incrementTotalPipesPassed(1);
    setLocalTotalPipesPassed(newTotal);
  }, [contextIncrementScore]);
  
  const resetGame = useCallback(() => {
    contextResetGame();
    setShowDeathEffect(false);
    setPipesPassedThisGame(0);
    
    // Reset positions
    birdPositionRef.current = { x: canvasSize.width * 0.2, y: canvasSize.height / 2 };
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    
    // Update React state to match
    setBirdPosition(birdPositionRef.current);
    setBirdVelocity(0);
    setPipes([]);
  }, [contextResetGame, canvasSize]);
  
  // Handle theme change
  const handleThemeChange = useCallback((newTheme: GameTheme) => {
    setGameTheme(newTheme);
    saveGameTheme(newTheme);
  }, []);
  
  // Update achievements and save to localStorage
  const updateAchievements = useCallback((type: 'score' | 'games', value: number) => {
    setLocalAchievements(prevAchievements => {
      const updatedAchievements = prevAchievements.map(achievement => {
        // Only update relevant achievement types
        if (
          (type === 'score' && achievement.id.startsWith('score_')) ||
          (type === 'games' && achievement.id.startsWith('games_'))
        ) {
          const newProgress = type === 'score' ? value : value;
          const unlocked = newProgress >= achievement.milestone;
          
          return {
            ...achievement,
            progress: newProgress,
            unlocked: unlocked
          };
        }
        
        return achievement;
      });
      
      // Save to localStorage
      saveAchievements(updatedAchievements);
      
      return updatedAchievements;
    });
  }, []);

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

  // Bird flap function - optimized for performance
  const flap = useCallback(() => {
    if (!isPlaying) return;
    
    // Update ref immediately for responsive gameplay
    birdVelocityRef.current = flapStrength;
    
    // We still need to update React state for the rotation calculation
    setBirdVelocity(flapStrength);
  }, [isPlaying, flapStrength]);

  // Handle canvas interaction
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
  
  // OPTIMIZED GAME LOOP - IMPROVED FOR SMOOTH PIPE MOVEMENT
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
      const elapsedInSeconds = elapsed / 1000;
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
          endGame();
          return;
        }
        
        physicsDeltaRef.current -= physicsStep;
      }

      // Handle score increment - wrapped in function to avoid state updates in game loop
      const handleScoreIncrement = () => {
        incrementScore();
      };
      
      // Check pipe collisions
      if (checkCollision(
        birdPositionRef.current.x,
        birdPositionRef.current.y,
        birdSize,
        pipesRef.current,
        canvasSize.height
      )) {
        endGame();
        return;
      }
      
      // Move pipes - use elapsed time for smooth movement
      // This is key for smooth pipe animation regardless of framerate
      pipesRef.current = updatePipes(
        pipesRef.current, 
        gameSpeed * (elapsed / 16.667), // Scale speed by actual frame time for consistency
        birdPositionRef.current.x, 
        canvasSize.width, 
        canvasSize.height,
        pipeGap,
        handleScoreIncrement
      );
      
      // Increment frame counter
      frameCountRef.current++;
      
      // Update React state to render - IMPORTANT: Update pipes EVERY frame for smooth movement
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
    endGame,
    incrementScore
  ]);
  
  // Calculate bird rotation for visual effect
  const birdRotation = useMemo(() => {
    // Smoother rotation calculations for more responsive feel
    if (birdVelocity < 0) {
      return Math.max(-25, birdVelocity * 1.5);
    } else {
      return Math.min(90, birdVelocity * 3);
    }
  }, [birdVelocity]);
  
  // Handle cleanup for death effect
  const handleEffectComplete = useCallback(() => {
    setShowDeathEffect(false);
  }, []);
  
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
          <FlappyBackground width={canvasSize.width} height={canvasSize.height} theme={gameTheme} />
          <FlappyPipes pipes={pipes} canvasHeight={canvasSize.height} theme={gameTheme} />
          <FlappyCharacter
            x={birdPosition.x}
            y={birdPosition.y}
            size={birdSize}
            rotation={birdRotation}
            emojiType={emojiType}
            characterImage={characterImage}
            characterColor={characterColor}
          />
          <FlappyEffects 
            active={showDeathEffect && gameOver}
            x={birdPosition.x}
            y={birdPosition.y}
            onComplete={handleEffectComplete}
          />
          <ThemeSwitch
            width={canvasSize.width}
            height={canvasSize.height}
            currentTheme={gameTheme}
            onThemeChange={handleThemeChange}
            disabled={isPlaying}
          />
          <FlappyUI 
            width={canvasSize.width}
            height={canvasSize.height}
            score={score}
            highScore={localHighScore}
            isPlaying={isPlaying}
            gameOver={gameOver}
            characterImage={characterImage}
            theme={gameTheme}
          />
          <FlappyAchievement 
            achievements={localAchievements}
            width={canvasSize.width}
            height={canvasSize.height}
            isPlaying={isPlaying}
            gameTheme={gameTheme}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);