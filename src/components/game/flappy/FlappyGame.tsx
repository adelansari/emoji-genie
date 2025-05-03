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
  
  // Refs
  const stageRef = useRef<Konva.Stage>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Local state
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [birdPosition, setBirdPosition] = useState({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);
  const [gameTheme, setGameTheme] = useState<GameTheme>('day');
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  const [localAchievements, setLocalAchievements] = useState<StoredAchievement[]>([]);
  const [pipesPassedThisGame, setPipesPassedThisGame] = useState(0);
  
  // Local state to track and update to context values
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
  
  // Initialize from localStorage on first load
  useEffect(() => {
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
  
  // Modified game functions to use localStorage
  const startGame = useCallback(() => {
    contextStartGame();
    setPipesPassedThisGame(0);
    
    // Increment play count in localStorage
    const newPlayCount = incrementPlayCount();
    setLocalPlayCount(newPlayCount);
    
    // Update game count achievements
    updateAchievements('games', newPlayCount);
  }, [contextStartGame]);
  
  const resetGame = useCallback(() => {
    contextResetGame();
    setShowDeathEffect(false);
    setPipesPassedThisGame(0);
  }, [contextResetGame]);
  
  const incrementScore = useCallback(() => {
    contextIncrementScore();
    setPipesPassedThisGame(prev => prev + 1);
    
    // Update total pipes passed in localStorage
    const newTotal = incrementTotalPipesPassed(1);
    setLocalTotalPipesPassed(newTotal);
  }, [contextIncrementScore]);
  
  const endGame = useCallback(() => {
    contextEndGame();
    setShowDeathEffect(true);
    
    // Save high score if current score is higher
    if (score > localHighScore) {
      saveHighScore(score);
      setLocalHighScore(score);
    }
    
    // Update score achievements
    updateAchievements('score', score);
  }, [contextEndGame, score, localHighScore]);
  
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
  
  // Handle theme change
  const handleThemeChange = useCallback((newTheme: GameTheme) => {
    setGameTheme(newTheme);
    saveGameTheme(newTheme);
  }, []);

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
      setPipesPassedThisGame(0);
    }
  }, [isPlaying, gameOver, canvasSize]);
  
  // Calculate bird rotation based on velocity (for visual effect)
  const birdRotation = Math.max(-30, Math.min(30, birdVelocity * 3));
  
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
          {/* Game background */}
          <FlappyBackground width={canvasSize.width} height={canvasSize.height} theme={gameTheme} />
          
          {/* Pipes */}
          <FlappyPipes pipes={pipes} canvasHeight={canvasSize.height} theme={gameTheme} />
          
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
          
          {/* Visual effects (when the bird dies) */}
          <FlappyEffects 
            active={showDeathEffect && gameOver}
            x={birdPosition.x}
            y={birdPosition.y}
            onComplete={handleEffectComplete}
          />
          
          {/* Theme switcher - only enabled when not playing */}
          <ThemeSwitch
            width={canvasSize.width}
            height={canvasSize.height}
            currentTheme={gameTheme}
            onThemeChange={handleThemeChange}
            disabled={isPlaying}
          />
          
          {/* UI Elements */}
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
          
          {/* Achievement notifications */}
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