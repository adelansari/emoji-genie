import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
// Remove unused import
// import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { Stage, Layer, Rect, Text, Group, Circle, Image } from 'react-konva';
import Konva from 'konva'; // Import Konva namespace

// Improve physics constants to match Flappy Bird feel
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const BIRD_SIZE_BASE = 35; // Base size, will scale with canvas

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
  
  // Remove unused context hook
  // const { resetAllTransforms } = useEmojiCustomization(); // Get reset function
  
  const stageRef = useRef<Konva.Stage>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [birdPosition, setBirdPosition] = useState({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 }); // Initial position relative to size
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number; passed: boolean; gap: number }>>([]); // Add gap to pipe state
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);

  // Dynamic calculations based on canvasSize
  const birdSize = useMemo(() => BIRD_SIZE_BASE * (canvasSize.width / 600), [canvasSize.width]); // Scale bird size
  const pipeGap = useMemo(() => canvasSize.height * 0.3, [canvasSize.height]); // Scale pipe gap

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset bird position when canvas size changes and game not playing
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]); // Also clear pipes on resize when not playing
    }
  }, [canvasSize, isPlaying, gameOver]);


  // Default character color for fallback
  const characterColor = emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  
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

  // Create a pipe at a random height, using dynamic gap
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
        } else if (isPlaying) {
          flap();
        } else if (gameOver) {
          resetGame();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, startGame, resetGame]); // Dependencies remain the same
  
  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      const deltaTime = (timestamp - lastTimeRef.current) / 16.67; // Normalize based on 60 FPS
      lastTimeRef.current = timestamp;
      
      // Update bird position
      const newVelocity = birdVelocity + GRAVITY * deltaTime; // Apply delta time
      const newPosition = {
        x: birdPosition.x,
        y: birdPosition.y + newVelocity * deltaTime // Apply delta time
      };
      
      setBirdVelocity(newVelocity);
      setBirdPosition(newPosition);
      
      // Check boundaries (use dynamic height and birdSize)
      // Allow hitting the ground (y > canvasHeight - groundHeight - birdSize/2)
      const groundHeight = canvasSize.height * 0.1; // Assuming ground is 10%
      if (newPosition.y < birdSize / 2 || newPosition.y > canvasSize.height - groundHeight - birdSize / 2) {
        endGame();
        return;
      }
      
      // Update pipes
      let shouldAddNewPipe = false;
      let updatedPipes = pipes.map(pipe => {
        const newX = pipe.x - gameSpeed * deltaTime; // Apply delta time to pipe movement
        
        // Check if bird passed the pipe
        if (!pipe.passed && newX + PIPE_WIDTH < birdPosition.x - birdSize / 2) { // Check based on bird's left edge
          incrementScore();
          return { ...pipe, x: newX, passed: true };
        }
        
        return { ...pipe, x: newX };
      }).filter(pipe => pipe.x > -PIPE_WIDTH); // Remove pipes fully off-screen
      
      // Check if we need to add a new pipe (adjust distance based on width)
      const pipeSpacing = canvasSize.width * 0.6; // Add pipe when last one is 60% across
      if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < canvasSize.width - pipeSpacing) {
        shouldAddNewPipe = true;
      }
      
      if (shouldAddNewPipe) {
        updatedPipes.push(createPipe());
      }
      
      setPipes(updatedPipes);
      
      // Check for collision with pipes (use dynamic sizes)
      const birdLeftEdge = birdPosition.x - birdSize / 2;
      const birdRightEdge = birdPosition.x + birdSize / 2;
      const birdTopEdge = birdPosition.y - birdSize / 2;
      const birdBottomEdge = birdPosition.y + birdSize / 2;
      
      // Adjust hitbox reduction based on dynamic birdSize
      const hitboxReduction = birdSize * 0.15; // Slightly smaller reduction (more generous hitbox)
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
          // Check top pipe collision
          if (hitboxTop < pipe.topHeight) {
            collision = true;
            break;
          }
          // Check bottom pipe collision (use stored pipe.gap)
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
    
    // Start game loop
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // Add canvasSize to dependencies as game logic depends on it
  }, [birdPosition, birdVelocity, pipes, isPlaying, gameSpeed, createPipe, incrementScore, canvasSize, birdSize, endGame, pipeGap]); 
  
  // Reset game state (uses canvasSize in initial position)
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      setBirdPosition({ x: canvasSize.width * 0.2, y: canvasSize.height / 2 });
      setBirdVelocity(0);
      setPipes([]);
    }
  }, [isPlaying, gameOver, canvasSize]); // Add canvasSize dependency
  
  // Flap function
  const flap = useCallback(() => {
    if (!isPlaying) return;
    setBirdVelocity(FLAP_STRENGTH);
  }, [isPlaying]); // Dependency is correct
  
  // Handle canvas click/touch for flapping or starting/resetting
  const handleCanvasInteraction = useCallback(() => {
    if (!isPlaying && !gameOver) {
      startGame();
    } else if (isPlaying) {
      flap();
    } else if (gameOver) {
      resetGame();
    }
  }, [isPlaying, gameOver, startGame, resetGame, flap]); // Add flap dependency
  
  // Determine shape based on emoji/sticker type
  const renderCharacter = useCallback(() => {
    const charSize = birdSize; // Use scaled bird size
    const charHalfSize = charSize / 2;

    // If we have a custom character image from export, use that
    if (characterImage) {
      const aspectRatio = characterImage.height / characterImage.width;
      const imgWidth = charSize;
      const imgHeight = imgWidth * aspectRatio;
      return (
        <Image
          image={characterImage}
          width={imgWidth}
          height={imgHeight}
          offsetX={imgWidth / 2} // Center image
          offsetY={imgHeight / 2} // Center image
        />
      );
    }
    
    // Default shapes scaled
    const eyeRadius = charSize * 0.08;
    const eyeOffsetX = charSize * 0.18;
    const eyeOffsetY = -charSize * 0.1; // Eyes slightly higher

    if (emojiType === 'emoji') {
      // Emoji (Circle)
      return (
        <>
          <Circle
            radius={charHalfSize}
            fill={characterColor}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Eyes */}
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          {/* Smile */}
          <Circle y={charSize * 0.15} radius={charSize * 0.2} fill="#333" />
          <Circle y={charSize * 0.1} radius={charSize * 0.2} fill={characterColor} />
        </>
      );
    } else {
      // Sticker (Rounded Rect)
      return (
        <>
          <Rect
            width={charSize}
            height={charSize}
            offsetX={charHalfSize} // Center rect
            offsetY={charHalfSize} // Center rect
            fill={characterColor}
            cornerRadius={charSize * 0.1} // Scale corner radius
            stroke="#333"
            strokeWidth={2}
          />
          {/* Eyes */}
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          {/* Mouth */}
          <Rect
            x={-charSize * 0.2} // Center mouth horizontally
            y={charSize * 0.15} // Position mouth vertically
            width={charSize * 0.4}
            height={charSize * 0.1}
            fill="#333"
            cornerRadius={charSize * 0.02} // Slight rounding
          />
        </>
      );
    }
  }, [emojiType, characterColor, characterImage, birdSize]); // Add birdSize dependency
  
  // Calculate ground height dynamically
  const groundHeight = canvasSize.height * 0.1;

  // Calculate text positions and sizes dynamically
  const scoreTextY = canvasSize.height * 0.04;
  const highScoreTextY = canvasSize.height * 0.1;
  const fontSizeLarge = Math.max(16, canvasSize.width * 0.04);
  const fontSizeMedium = Math.max(14, canvasSize.width * 0.035);
  const fontSizeSmall = Math.max(12, canvasSize.width * 0.03);
  const fontSizeXSmall = Math.max(10, canvasSize.width * 0.025);

  return (
    <div 
      className="flex flex-col items-center"
      // Container size set by parent or CSS, Stage uses dynamic size
    >
      <Stage 
        width={canvasSize.width} 
        height={canvasSize.height}
        ref={stageRef}
        onClick={handleCanvasInteraction} // Use combined handler for click
        onTouchStart={handleCanvasInteraction} // Add touch handler
        className="bg-sky-500 rounded-lg shadow-xl cursor-pointer"
        // Style ensures it takes up the calculated size
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <Layer>
          {/* Sky background */}
          <Rect width={canvasSize.width} height={canvasSize.height} fill="#87CEEB" />
          
          {/* Clouds (decorative, scale position/size slightly) */}
          {[...Array(3)].map((_, i) => (
            <Group key={`cloud-${i}`} x={(canvasSize.width * 0.2) * i + (canvasSize.width * 0.1)} y={(canvasSize.height * 0.1) * (i % 2) + (canvasSize.height * 0.08)}>
              <Rect width={canvasSize.width * 0.15} height={canvasSize.height * 0.07} cornerRadius={canvasSize.width * 0.04} fill="white" opacity={0.9} />
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
                y={pipe.topHeight + pipe.gap} // Use stored gap
                width={PIPE_WIDTH}
                height={canvasSize.height - (pipe.topHeight + pipe.gap)} // Calculate height based on gap
                fill="#2ECC71"
                stroke="#27AE60"
                strokeWidth={3}
              />
            </Group>
          ))}
          
          {/* Ground */}
          <Rect
            y={canvasSize.height - groundHeight}
            width={canvasSize.width}
            height={groundHeight}
            fill="#8B4513"
          />
          
          {/* Score display */}
          <Text
            text={`Score: ${score}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            x={canvasSize.width * 0.03} // Relative position
            y={scoreTextY}
          />
          
          {/* High Score display */}
          <Text
            text={`Best: ${highScore}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            x={canvasSize.width * 0.03} // Relative position
            y={highScoreTextY}
          />
          
          {/* Custom character badge if exported */}
          {characterImage && (
            <Group x={canvasSize.width - (canvasSize.width * 0.22)} y={canvasSize.height * 0.03}>
              <Rect
                width={canvasSize.width * 0.2} // Relative size
                height={canvasSize.height * 0.05} // Relative size
                fill="rgba(0,0,0,0.5)"
                cornerRadius={canvasSize.width * 0.03} // Relative size
              />
              <Text
                text="Custom" // Shorter text
                fontSize={fontSizeXSmall}
                fontFamily="Arial"
                fill="#FFDD00"
                x={canvasSize.width * 0.015} // Relative position
                y={canvasSize.height * 0.015} // Relative position
                width={canvasSize.width * 0.17} // Ensure text fits
                align="center"
              />
            </Group>
          )}
          
          {/* Emoji/Sticker character */}
          <Group
            x={birdPosition.x} // Position is already state managed
            y={birdPosition.y} // Position is already state managed
            rotation={Math.max(-30, Math.min(30, birdVelocity * 3))} // Clamp rotation
            // Offset is handled within renderCharacter now
          >
            {renderCharacter()}
          </Group>
          
          {/* Starting instruction */}
          {!isPlaying && !gameOver && (
            <Text
              text="Tap or Space to Start" // Changed text slightly
              fontSize={fontSizeLarge}
              fontFamily="Arial"
              fill="white"
              align="center"
              width={canvasSize.width * 0.8} // Relative width
              x={canvasSize.width / 2} // Center X
              offsetX={(canvasSize.width * 0.8) / 2} // Center offset X
              y={canvasSize.height / 2 - fontSizeLarge} // Relative Y
            />
          )}
          
          {/* Game over message */}
          {gameOver && (
            <>
              <Rect
                width={canvasSize.width * 0.6} // Relative size
                height={canvasSize.height * 0.3} // Relative size
                x={canvasSize.width / 2} // Center X
                y={canvasSize.height / 2} // Center Y
                offsetX={(canvasSize.width * 0.6) / 2} // Center offset X
                offsetY={(canvasSize.height * 0.3) / 2} // Center offset Y
                fill="rgba(0, 0, 0, 0.7)"
                cornerRadius={10}
              />
              <Text
                text="Game Over"
                fontSize={fontSizeLarge}
                fontFamily="Arial"
                fill="#FF5252"
                align="center"
                width={canvasSize.width * 0.6} // Match rect width
                x={canvasSize.width / 2} // Center X
                offsetX={(canvasSize.width * 0.6) / 2} // Center offset X
                y={canvasSize.height * 0.4} // Relative Y
              />
              <Text
                text={`Score: ${score}`}
                fontSize={fontSizeMedium}
                fontFamily="Arial"
                fill="white"
                align="center"
                width={canvasSize.width * 0.6} // Match rect width
                x={canvasSize.width / 2} // Center X
                offsetX={(canvasSize.width * 0.6) / 2} // Center offset X
                y={canvasSize.height * 0.5} // Relative Y
              />
              <Text
                text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
                fontSize={fontSizeSmall}
                fontFamily="Arial"
                fill={score > highScore ? "#FFD700" : "white"}
                align="center"
                width={canvasSize.width * 0.6} // Match rect width
                x={canvasSize.width / 2} // Center X
                offsetX={(canvasSize.width * 0.6) / 2} // Center offset X
                y={canvasSize.height * 0.56} // Relative Y
              />
              <Text
                text="Tap to Play Again" // Changed text slightly
                fontSize={fontSizeSmall}
                fontFamily="Arial"
                fill="#AAAAAA"
                align="center"
                width={canvasSize.width * 0.6} // Match rect width
                x={canvasSize.width / 2} // Center X
                offsetX={(canvasSize.width * 0.6) / 2} // Center offset X
                y={canvasSize.height * 0.62} // Relative Y
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(FlappyGame);