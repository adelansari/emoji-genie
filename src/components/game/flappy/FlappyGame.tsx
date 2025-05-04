import { useRef, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext'; // Generic game context
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

// Import custom hooks from consolidated export
import { 
  useCanvasSize, 
  useFlappyPhysics, 
  useFlappyAchievements, // Flappy specific state/logic hook
  useFlappyControls 
} from './hooks';

// Import modular components
import FlappyCharacter from './FlappyCharacter';
import FlappyBackground from './FlappyBackground';
import FlappyPipes from './FlappyPipes';
import FlappyUI from './FlappyUI';
import FlappyEffects from './FlappyEffects';
import FlappyAchievement from './FlappyAchievement';
import ThemeSwitch from './ThemeSwitch';

// Import constants and types
import { BIRD_SIZE_BASE } from './config';

const FlappyGame = () => {
  // Generic game state from Context API
  const { 
    score, 
    isPlaying, 
    gameOver, 
    startGame: contextStartGame, 
    resetGame: contextResetGame, 
    incrementScore: contextIncrementScore, 
    endGame: contextEndGame, 
    gameSpeed, 
    characterImageUrl, 
    emojiType,
  } = useGame();

  // Flappy specific state and handlers from custom hook
  const {
    localHighScore,
    gameTheme,
    achievements, // Use achievements from the hook
    handleGameStart,
    handleGameEnd,
    handlePipePassed,
    handleGameReset, // Use reset handler from hook if needed
    handleThemeChange
  } = useFlappyAchievements();
  
  // Get responsive canvas size
  const canvasSize = useCanvasSize();
  
  // Stage ref for Konva
  const stageRef = useRef<Konva.Stage>(null);
  
  // Dynamic calculations based on canvas size
  const birdSize = useMemo(() => 
    BIRD_SIZE_BASE * (canvasSize.width / 600), 
    [canvasSize.width]
  );
  const pipeGap = useMemo(() => 
    canvasSize.height * 0.35, 
    [canvasSize.height]
  );
  
  // Character image handling
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);
  const characterColor = useMemo(() => 
    emojiType === 'emoji' ? '#FACC15' : '#FF6B6B', 
    [emojiType]
  );
  
  // Visual effects state (remains local to FlappyGame)
  const [showDeathEffect, setShowDeathEffect] = useState(false);
  
  // Load character image when URL changes
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
  
  // --- Integrate Context and Hook Handlers ---
  const startGame = useCallback(() => {
    contextStartGame(); // Call generic context start
    handleGameStart();  // Call Flappy specific start handler (e.g., increment play count)
  }, [contextStartGame, handleGameStart]);
  
  const endGame = useCallback(() => {
    contextEndGame(score); // Call generic context end, passing final score
    handleGameEnd(score); // Call Flappy specific end handler (e.g., save high score, update achievements)
    setShowDeathEffect(true);
  }, [contextEndGame, handleGameEnd, score]);
  
  const incrementScore = useCallback(() => {
    contextIncrementScore(); // Call generic context score increment
    handlePipePassed();    // Call Flappy specific handler (e.g., increment total pipes)
  }, [contextIncrementScore, handlePipePassed]);
  
  const resetGame = useCallback(() => {
    contextResetGame(); // Call generic context reset
    handleGameReset();  // Call Flappy specific reset handler (if any logic needed)
    setShowDeathEffect(false);
  }, [contextResetGame, handleGameReset]);
  // --- End Integration ---

  // Physics and game mechanics (uses generic state like isPlaying, gameOver, gameSpeed)
  const {
    birdPosition,
    birdVelocity,
    birdRotation,
    pipes,
    flap,
    resetPhysics
  } = useFlappyPhysics(
    isPlaying,
    gameOver,
    canvasSize,
    gameSpeed,
    birdSize,
    pipeGap,
    endGame, // Pass the integrated endGame handler
    incrementScore // Pass the integrated incrementScore handler
  );
  
  // Controls and user interaction (uses generic state and integrated handlers)
  const { handleCanvasInteraction } = useFlappyControls(
    isPlaying,
    gameOver,
    startGame, // Pass integrated startGame
    resetGame, // Pass integrated resetGame
    flap
  );
  
  // Handle death effect completion
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
          {/* Pass Flappy-specific state from useFlappyAchievements */}
          <FlappyBackground 
            width={canvasSize.width} 
            height={canvasSize.height} 
            theme={gameTheme} // Use theme from hook
            isPlaying={isPlaying}
            gameSpeed={gameSpeed} 
          />
          <FlappyPipes 
            pipes={pipes} 
            canvasHeight={canvasSize.height} 
            theme={gameTheme} // Use theme from hook
          />
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
            currentTheme={gameTheme} // Use theme from hook
            onThemeChange={handleThemeChange} // Use theme handler from hook
            disabled={isPlaying}
          />
          <FlappyUI 
            width={canvasSize.width}
            height={canvasSize.height}
            score={score} // Use score from generic context
            highScore={localHighScore} // Use high score from hook
            isPlaying={isPlaying}
            gameOver={gameOver}
            characterImage={characterImage}
            theme={gameTheme} // Use theme from hook
          />
          {/* Pass achievements data from useFlappyAchievements hook */}
          <FlappyAchievement 
            achievements={achievements} // Use achievements from hook
            width={canvasSize.width}
            height={canvasSize.height}
            isPlaying={isPlaying}
            gameTheme={gameTheme} // Use theme from hook
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);