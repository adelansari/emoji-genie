import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useGame } from '../../../context/GameContext';
import { Stage, Layer, Rect, Text, Group, Circle, Image } from 'react-konva';
import Konva from 'konva';

// Base physics constants - separate desktop and mobile values
const BASE_GRAVITY = 0.25;
const DESKTOP_FLAP_STRENGTH = -7;
const MOBILE_FLAP_STRENGTH = -5.5;
const PIPE_WIDTH = 60;
const BIRD_SIZE_BASE = 40;

// Helper to detect mobile devices
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (window.innerWidth <= 768);
};

// Function to calculate responsive size (similar to other canvases, maybe slightly different constraints)
const getResponsiveCanvasSize = () => {
  const padding = 32; 
  const availableWidth = window.innerWidth - padding;
  // Allow more height for game view compared to customization
  const availableHeight = window.innerHeight * 0.7; 
  const maxSize = 600; 
  const minSize = 300; 
  // Game is often landscape-ish, but let's keep it square for simplicity matching others
  // If landscape is desired, width/height calculation would differ.
  const size = Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
  return { width: size, height: size }; // Return width/height object
};


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
  
  // ...existing code...
  const stageRef = useRef<Konva.Stage>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [birdPosition, setBirdPosition] = useState({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number; passed: boolean; gap: number }>>([]);
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);

  // Dynamic calculations
  const birdSize = useMemo(() => BIRD_SIZE_BASE * (canvasSize.width / 600), [canvasSize.width]);
  const pipeGap = useMemo(() => canvasSize.height * 0.35, [canvasSize.height]); 
  
  // Calculate adjusted physics constants based on difficulty level
  const gravity = useMemo(() => {
    if (gameSpeed <= 2.5) return BASE_GRAVITY * 0.7;
    if (gameSpeed >= 4.5) return BASE_GRAVITY * 1.3;
    return BASE_GRAVITY;
  }, [gameSpeed]);
  
  const flapStrength = useMemo(() => {
    if (isMobileDevice()) {
      if (gameSpeed <= 2.5) return MOBILE_FLAP_STRENGTH * 0.85;
      if (gameSpeed >= 4.5) return MOBILE_FLAP_STRENGTH * 1.15;
      return MOBILE_FLAP_STRENGTH;
    } else {
      if (gameSpeed <= 2.5) return DESKTOP_FLAP_STRENGTH * 0.85;
      if (gameSpeed >= 4.5) return DESKTOP_FLAP_STRENGTH * 1.15;
      return DESKTOP_FLAP_STRENGTH;
    }
  }, [gameSpeed]);

  // Flap function
  const flap = useCallback(() => {
    if (!isPlaying) return;
    setBirdVelocity(flapStrength);
  }, [isPlaying, flapStrength]);
  
  // Handle canvas interaction
  const handleCanvasInteraction = useCallback(() => {
    if (!isPlaying && !gameOver) {
      startGame();
      // Add immediate flap on game start for better UX
      setTimeout(() => {
        setBirdVelocity(flapStrength);
      }, 10);
    } else if (isPlaying) {
      flap();
    } else if (gameOver) {
      resetGame();
    }
  }, [isPlaying, gameOver, startGame, resetGame, flap, flapStrength]);
  
  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset bird position when canvas size changes
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]); // Also clear pipes on resize when not playing
    }
  }, [canvasSize, isPlaying, gameOver]);

  // Default character color for fallback
  const characterColor = useMemo(() => {
    return emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  }, [emojiType]);

  // Load the custom character image if available
  useEffect(() => {
    if (characterImageUrl) {
      const img = new window.Image();
      img.src = characterImageUrl;
      img.onload = () => setCharacterImage(img);
      img.onerror = () => {
        console.error("Failed to load character image.");
        setCharacterImage(null); // Fallback if image fails to load
      };
    } else {
      setCharacterImage(null); // Clear image if URL is removed
    }
  }, [characterImageUrl]);

  // Create a pipe at a random height
  const createPipe = useCallback(() => {
    const minTopHeight = canvasSize.height * 0.1; // Min 10% from top
    const maxTopHeight = canvasSize.height - pipeGap - (canvasSize.height * 0.1); // Max 10% from bottom (considering ground)
    const topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight) + minTopHeight);
    
    return {
      x: canvasSize.width, // Start pipe at the right edge
      topHeight,
      passed: false,
      gap: pipeGap // Store the gap used for this pipe
    };
  }, [canvasSize.width, canvasSize.height, pipeGap]);

  // Initialize game keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        if (!isPlaying && !gameOver) {
          startGame();
          // Add immediate flap on game start with space key, matching click behavior
          setTimeout(() => {
            setBirdVelocity(flapStrength);
          }, 10);
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
  
  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (timestamp: number) => {
      // ...existing game loop code...
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      lastTimeRef.current = timestamp;
      
      const groundHeight = canvasSize.height * 0.1;
      const newVelocity = Math.max(-10, Math.min(10, birdVelocity + gravity));
      
      const wouldHitGround = birdPosition.y + newVelocity > canvasSize.height - groundHeight - birdSize/2;
      
      if (wouldHitGround) {
        endGame();
        return;
      }
      
      const newPosition = {
        x: birdPosition.x,
        y: Math.max(birdSize/2, Math.min(canvasSize.height - groundHeight - birdSize/2, birdPosition.y + newVelocity))
      };
      
      setBirdVelocity(newVelocity);
      setBirdPosition(newPosition);
      
      if (newPosition.y < birdSize/2) {
        endGame();
        return;
      }
      
      let shouldAddNewPipe = false;
      let updatedPipes = pipes.map(pipe => {
        const newX = pipe.x - gameSpeed;
        
        if (!pipe.passed && newX + PIPE_WIDTH < birdPosition.x) {
          incrementScore();
          return { ...pipe, x: newX, passed: true };
        }
        
        return { ...pipe, x: newX };
      }).filter(pipe => pipe.x > -PIPE_WIDTH);
      
      const pipeSpacing = canvasSize.width * 0.6;
      if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < canvasSize.width - pipeSpacing) {
        shouldAddNewPipe = true;
      }
      
      if (shouldAddNewPipe) {
        updatedPipes.push(createPipe());
      }
      
      setPipes(updatedPipes);
      
      const birdLeftEdge = birdPosition.x - birdSize / 2;
      const birdRightEdge = birdPosition.x + birdSize / 2;
      const birdTopEdge = birdPosition.y - birdSize / 2;
      const birdBottomEdge = birdPosition.y + birdSize / 2;
      
      const hitboxReduction = birdSize * 0.2;
      const hitboxLeft = birdLeftEdge + hitboxReduction;
      const hitboxRight = birdRightEdge - hitboxReduction;
      const hitboxTop = birdTopEdge + hitboxReduction;
      const hitboxBottom = birdBottomEdge - hitboxReduction;
      
      let collision = false;
      for (const pipe of updatedPipes) {
        if (
          hitboxRight > pipe.x && 
          hitboxLeft < pipe.x + PIPE_WIDTH
        ) {
          if (hitboxTop < pipe.topHeight) {
            collision = true;
            break;
          }
          if (hitboxBottom > pipe.topHeight + pipe.gap) {
            collision = true;
            break;
          }
        }
      }
      
      if (collision) {
        endGame();
        return;
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [birdPosition, birdVelocity, pipes, isPlaying, gameSpeed, createPipe, incrementScore, canvasSize, birdSize, endGame, pipeGap, gravity]);
  
  // Reset game state
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]);
    }
  }, [isPlaying, gameOver, canvasSize]);
  
  // Render character based on emoji/sticker type
  const renderCharacter = useCallback(() => {
    const charSize = birdSize;
    const charHalfSize = charSize / 2;

    if (characterImage) {
      const aspectRatio = characterImage.height / characterImage.width;
      const imgWidth = charSize;
      const imgHeight = imgWidth * aspectRatio;
      return (
        <Image
          image={characterImage}
          width={imgWidth}
          height={imgHeight}
          offsetX={imgWidth / 2}
          offsetY={imgHeight / 2}
        />
      );
    }
    
    const eyeRadius = charSize * 0.08;
    const eyeOffsetX = charSize * 0.18;
    const eyeOffsetY = -charSize * 0.1;

    if (emojiType === 'emoji') {
      return (
        <>
          <Circle
            radius={charHalfSize}
            fill={characterColor}
            stroke="#333"
            strokeWidth={2}
          />
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle y={charSize * 0.15} radius={charSize * 0.2} fill="#333" />
          <Circle y={charSize * 0.1} radius={charSize * 0.2} fill={characterColor} />
        </>
      );
    } else {
      return (
        <>
          <Rect
            width={charSize}
            height={charSize}
            offsetX={charHalfSize}
            offsetY={charHalfSize}
            fill={characterColor}
            cornerRadius={charSize * 0.1}
            stroke="#333"
            strokeWidth={2}
          />
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Rect
            x={-charSize * 0.2}
            y={charSize * 0.15}
            width={charSize * 0.4}
            height={charSize * 0.1}
            fill="#333"
            cornerRadius={charSize * 0.02}
          />
        </>
      );
    }
  }, [emojiType, characterColor, characterImage, birdSize]);
  
  // Calculate text positions and sizes dynamically
  const scoreTextY = canvasSize.height * 0.04;
  const highScoreTextY = canvasSize.height * 0.1;
  const fontSizeLarge = Math.max(16, canvasSize.width * 0.04);
  const fontSizeMedium = Math.max(14, canvasSize.width * 0.035);
  const fontSizeSmall = Math.max(12, canvasSize.width * 0.03);
  const fontSizeXSmall = Math.max(10, canvasSize.width * 0.025);

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
          {/* Sky background */}
          <Rect width={canvasSize.width} height={canvasSize.height} fill="#87CEEB" />
          
          {/* Clouds */}
          {[...Array(3)].map((_, i) => (
            <Group key={`cloud-${i}`} x={(canvasSize.width * 0.2) * i + (canvasSize.width * 0.1)} y={(canvasSize.height * 0.1) * (i % 2) + (canvasSize.height * 0.08)}>
              <Rect width={canvasSize.width * 0.15} height={canvasSize.height * 0.07} cornerRadius={canvasSize.width * 0.04} fill="white" opacity={0.9} />
            </Group>
          ))}
          
          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <Group key={`pipe-${index}`}>
              <Rect
                x={pipe.x}
                y={0}
                width={PIPE_WIDTH}
                height={pipe.topHeight}
                fill="#2ECC71"
                stroke="#27AE60"
                strokeWidth={3}
              />
              <Rect
                x={pipe.x}
                y={pipe.topHeight + pipe.gap}
                width={PIPE_WIDTH}
                height={canvasSize.height - (pipe.topHeight + pipe.gap)}
                fill="#2ECC71"
                stroke="#27AE60"
                strokeWidth={3}
              />
            </Group>
          ))}
          
          {/* Ground */}
          <Rect
            y={canvasSize.height - (canvasSize.height * 0.1)}
            width={canvasSize.width}
            height={canvasSize.height * 0.1}
            fill="#8B4513"
          />
          
          {/* Score display */}
          <Text
            text={`Score: ${score}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            x={canvasSize.width * 0.03}
            y={scoreTextY}
          />
          
          {/* High Score display */}
          <Text
            text={`Best: ${highScore}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            x={canvasSize.width * 0.03}
            y={highScoreTextY}
          />
          
          {/* Custom character badge if exported */}
          {characterImage && (
            <Group x={canvasSize.width - (canvasSize.width * 0.22)} y={canvasSize.height * 0.03}>
              <Rect
                width={canvasSize.width * 0.2}
                height={canvasSize.height * 0.05}
                fill="rgba(0,0,0,0.5)"
                cornerRadius={canvasSize.width * 0.03}
              />
              <Text
                text="Custom"
                fontSize={fontSizeXSmall}
                fontFamily="Arial"
                fill="#FFDD00"
                x={canvasSize.width * 0.015}
                y={canvasSize.height * 0.015}
                width={canvasSize.width * 0.17}
                align="center"
              />
            </Group>
          )}
          
          {/* Emoji/Sticker character */}
          <Group
            x={birdPosition.x}
            y={birdPosition.y}
            rotation={Math.max(-30, Math.min(30, birdVelocity * 3))}
          >
            {renderCharacter()}
          </Group>
          
          {/* Starting instruction */}
          {!isPlaying && !gameOver && (
            <Text
              text="Tap or Space to Start"
              fontSize={fontSizeLarge}
              fontFamily="Arial"
              fill="white"
              align="center"
              width={canvasSize.width * 0.8}
              x={canvasSize.width / 2}
              offsetX={(canvasSize.width * 0.8) / 2}
              y={canvasSize.height / 2 - fontSizeLarge}
            />
          )}
          
          {/* Game over message */}
          {gameOver && (
            <>
              <Rect
                width={canvasSize.width * 0.6}
                height={canvasSize.height * 0.3}
                x={canvasSize.width / 2}
                y={canvasSize.height / 2}
                offsetX={(canvasSize.width * 0.6) / 2}
                offsetY={(canvasSize.height * 0.3) / 2}
                fill="rgba(0, 0, 0, 0.7)"
                cornerRadius={10}
              />
              <Text
                text="Game Over"
                fontSize={fontSizeLarge}
                fontFamily="Arial"
                fill="#FF5252"
                align="center"
                width={canvasSize.width * 0.6}
                x={canvasSize.width / 2}
                offsetX={(canvasSize.width * 0.6) / 2}
                y={canvasSize.height * 0.4}
              />
              <Text
                text={`Score: ${score}`}
                fontSize={fontSizeMedium}
                fontFamily="Arial"
                fill="white"
                align="center"
                width={canvasSize.width * 0.6}
                x={canvasSize.width / 2}
                offsetX={(canvasSize.width * 0.6) / 2}
                y={canvasSize.height * 0.5}
              />
              <Text
                text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
                fontSize={fontSizeSmall}
                fontFamily="Arial"
                fill={score > highScore ? "#FFD700" : "white"}
                align="center"
                width={canvasSize.width * 0.6}
                x={canvasSize.width / 2}
                offsetX={(canvasSize.width * 0.6) / 2}
                y={canvasSize.height * 0.56}
              />
              <Text
                text="Tap to Play Again"
                fontSize={fontSizeSmall}
                fontFamily="Arial"
                fill="#AAAAAA"
                align="center"
                width={canvasSize.width * 0.6}
                x={canvasSize.width / 2}
                offsetX={(canvasSize.width * 0.6) / 2}
                y={canvasSize.height * 0.62}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);