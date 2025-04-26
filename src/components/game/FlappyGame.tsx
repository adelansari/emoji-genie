import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { findEmojiModel } from '../../data/emoji/emojiModels';
import { findStickerModel } from '../../data/sticker/stickerModels';
import { Stage, Layer, Rect, Text, Group, Circle } from 'react-konva';

// Reduce gravity and increase flap strength for better gameplay
const GRAVITY = 0.25;
const FLAP_STRENGTH = -6;
const PIPE_GAP = 200;
const PIPE_WIDTH = 80;
const BIRD_SIZE = 40;

const FlappyGame = () => {
  const {
    isPlaying,
    gameOver,
    score,
    highScore,
    gameSpeed,
    startGame,
    endGame,
    incrementScore,
    resetGame
  } = useGame();

  const { 
    emojiType,
    selectedEmojiModels,
    selectedStickerModels
  } = useEmojiCustomization();
  
  const [birdPosition, setBirdPosition] = useState({ x: 100, y: 250 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number; passed: boolean }>>([]);
  const animationRef = useRef<number>();
  const stageRef = useRef<any>(null);
  const lastTimeRef = useRef<number>(0);

  const canvasWidth = 600;
  const canvasHeight = 600;
  
  // Determine the character color based on emoji/sticker type
  const characterColor = emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  
  // Create a pipe at a random height
  const createPipe = useCallback(() => {
    const minHeight = 50;
    const maxHeight = canvasHeight - PIPE_GAP - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    
    return {
      x: canvasWidth,
      topHeight,
      passed: false
    };
  }, [canvasWidth]);

  // Initialize game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (!isPlaying && !gameOver) {
          startGame();
        } else if (isPlaying) {
          flap();
        } else if (gameOver) {
          resetGame();
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame, resetGame]);
  
  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      // Update bird position - apply gravity more gently
      const newVelocity = birdVelocity + GRAVITY;
      const newPosition = {
        x: birdPosition.x,
        y: birdPosition.y + newVelocity
      };
      
      setBirdVelocity(newVelocity);
      setBirdPosition(newPosition);
      
      // Check boundaries
      if (newPosition.y < 0 || newPosition.y > canvasHeight - BIRD_SIZE) {
        endGame();
        return;
      }
      
      // Update pipes
      let shouldAddNewPipe = false;
      let updatedPipes = pipes.map(pipe => {
        // Move pipe
        const newX = pipe.x - gameSpeed;
        
        // Check if bird passed the pipe
        if (!pipe.passed && newX + PIPE_WIDTH < birdPosition.x) {
          incrementScore();
          return { ...pipe, x: newX, passed: true };
        }
        
        return { ...pipe, x: newX };
      }).filter(pipe => pipe.x > -PIPE_WIDTH);
      
      // Check if we need to add a new pipe
      if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < canvasWidth - 300) {
        shouldAddNewPipe = true;
      }
      
      if (shouldAddNewPipe) {
        updatedPipes.push(createPipe());
      }
      
      setPipes(updatedPipes);
      
      // Check for collision with pipes
      const birdRightEdge = birdPosition.x + BIRD_SIZE;
      const birdBottomEdge = birdPosition.y + BIRD_SIZE;
      
      for (const pipe of updatedPipes) {
        if (
          birdRightEdge > pipe.x && 
          birdPosition.x < pipe.x + PIPE_WIDTH
        ) {
          // Check if bird hits top pipe
          if (birdPosition.y < pipe.topHeight) {
            endGame();
            return;
          }
          
          // Check if bird hits bottom pipe
          if (birdBottomEdge > pipe.topHeight + PIPE_GAP) {
            endGame();
            return;
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [birdPosition, birdVelocity, pipes, isPlaying, gameSpeed, createPipe, incrementScore, canvasHeight, endGame]);
  
  // Reset game state
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: 100, y: 250 });
      setBirdVelocity(0);
      setPipes([]);
    }
  }, [isPlaying, gameOver]);
  
  // Flap function - called when screen is clicked or space is pressed
  const flap = () => {
    if (!isPlaying) return;
    
    // Use the flap strength constant for consistent jumps
    setBirdVelocity(FLAP_STRENGTH);
  };
  
  // Handle canvas click for flapping
  const handleCanvasClick = () => {
    if (!isPlaying && !gameOver) {
      startGame();
    } else if (isPlaying) {
      flap();
    } else if (gameOver) {
      resetGame();
    }
  };
  
  // Determine shape based on emoji/sticker type
  const renderCharacter = () => {
    if (emojiType === 'emoji') {
      // For emoji, use a circle
      return (
        <>
          <Circle
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            fill={characterColor}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Add eyes to make it look like an emoji */}
          <Circle
            x={BIRD_SIZE * 0.3}
            y={BIRD_SIZE * 0.4}
            radius={BIRD_SIZE * 0.1}
            fill="#333"
          />
          <Circle
            x={BIRD_SIZE * 0.7} 
            y={BIRD_SIZE * 0.4}
            radius={BIRD_SIZE * 0.1}
            fill="#333"
          />
          {/* Add a smile */}
          <Circle
            x={BIRD_SIZE * 0.5}
            y={BIRD_SIZE * 0.65}
            radius={BIRD_SIZE * 0.2}
            fill="#333"
          />
          <Circle
            x={BIRD_SIZE * 0.5}
            y={BIRD_SIZE * 0.6}
            radius={BIRD_SIZE * 0.2}
            fill={characterColor}
          />
        </>
      );
    } else {
      // For sticker, use a square with rounded corners
      return (
        <>
          <Rect
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            fill={characterColor}
            cornerRadius={5}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Add eyes to make it look like a sticker face */}
          <Circle
            x={BIRD_SIZE * 0.3}
            y={BIRD_SIZE * 0.4}
            radius={BIRD_SIZE * 0.1}
            fill="#333"
          />
          <Circle
            x={BIRD_SIZE * 0.7} 
            y={BIRD_SIZE * 0.4}
            radius={BIRD_SIZE * 0.1}
            fill="#333"
          />
          {/* Add a mouth */}
          <Rect
            x={BIRD_SIZE * 0.3}
            y={BIRD_SIZE * 0.65}
            width={BIRD_SIZE * 0.4}
            height={BIRD_SIZE * 0.1}
            fill="#333"
          />
        </>
      );
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center"
      style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
    >
      <Stage 
        width={canvasWidth} 
        height={canvasHeight}
        ref={stageRef}
        onClick={handleCanvasClick}
        className="bg-sky-500 rounded-lg shadow-xl cursor-pointer"
      >
        <Layer>
          {/* Sky background */}
          <Rect
            width={canvasWidth}
            height={canvasHeight}
            fill="#87CEEB"
          />
          
          {/* Clouds (decorative) */}
          {[...Array(3)].map((_, i) => (
            <Group key={`cloud-${i}`} x={150 * i + 50} y={80 * (i % 2) + 50}>
              <Rect width={80} height={40} cornerRadius={20} fill="white" opacity={0.9} />
            </Group>
          ))}
          
          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <Group key={`pipe-${index}`}>
              {/* Top pipe */}
              <Rect
                x={pipe.x}
                y={0}
                width={PIPE_WIDTH}
                height={pipe.topHeight}
                fill="#2ECC71"
                stroke="#27AE60"
                strokeWidth={3}
              />
              
              {/* Bottom pipe */}
              <Rect
                x={pipe.x}
                y={pipe.topHeight + PIPE_GAP}
                width={PIPE_WIDTH}
                height={canvasHeight - (pipe.topHeight + PIPE_GAP)}
                fill="#2ECC71"
                stroke="#27AE60"
                strokeWidth={3}
              />
            </Group>
          ))}
          
          {/* Ground */}
          <Rect
            y={canvasHeight - 50}
            width={canvasWidth}
            height={50}
            fill="#8B4513"
          />
          
          {/* Score display */}
          <Text
            text={`Score: ${score}`}
            fontSize={20}
            fontFamily="Arial"
            fill="white"
            x={20}
            y={20}
          />
          
          {/* High Score display */}
          <Text
            text={`Best: ${highScore}`}
            fontSize={20}
            fontFamily="Arial"
            fill="white"
            x={20}
            y={50}
          />
          
          {/* Emoji/Sticker character as the bird */}
          <Group
            x={birdPosition.x - BIRD_SIZE/2}
            y={birdPosition.y - BIRD_SIZE/2}
            rotation={birdVelocity * 2} // Rotate based on velocity
          >
            {renderCharacter()}
          </Group>
          
          {/* Starting instruction */}
          {!isPlaying && !gameOver && (
            <Text
              text="Press SPACE or Click to Start"
              fontSize={24}
              fontFamily="Arial"
              fill="white"
              align="center"
              x={canvasWidth / 2 - 150}
              y={canvasHeight / 2 - 15}
            />
          )}
          
          {/* Game over message */}
          {gameOver && (
            <>
              <Rect
                x={canvasWidth / 2 - 150}
                y={canvasHeight / 2 - 80}
                width={300}
                height={160}
                fill="rgba(0, 0, 0, 0.7)"
                cornerRadius={10}
              />
              <Text
                text="Game Over"
                fontSize={32}
                fontFamily="Arial"
                fill="#FF5252"
                align="center"
                x={canvasWidth / 2 - 80}
                y={canvasHeight / 2 - 60}
              />
              <Text
                text={`Score: ${score}`}
                fontSize={24}
                fontFamily="Arial"
                fill="white"
                align="center"
                x={canvasWidth / 2 - 50}
                y={canvasHeight / 2 - 10}
              />
              <Text
                text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
                fontSize={20}
                fontFamily="Arial"
                fill={score > highScore ? "#FFD700" : "white"}
                align="center"
                x={canvasWidth / 2 - 70}
                y={canvasHeight / 2 + 25}
              />
              <Text
                text="Click to Play Again"
                fontSize={16}
                fontFamily="Arial"
                fill="#AAAAAA"
                align="center"
                x={canvasWidth / 2 - 70}
                y={canvasHeight / 2 + 60}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);