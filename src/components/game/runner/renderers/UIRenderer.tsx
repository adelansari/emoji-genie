import { memo } from 'react';
import { Group, Rect, Text } from 'react-konva';

interface UIRendererProps {
  score: number;
  highScore: number;
  isPlaying: boolean;
  gameOver: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

const UIRenderer = ({ 
  score, 
  highScore, 
  isPlaying, 
  gameOver, 
  canvasWidth, 
  canvasHeight 
}: UIRendererProps) => {
  // Calculate font sizes responsively based on canvas dimensions
  const fontSizeLarge = Math.max(16, canvasWidth * 0.03);
  const fontSizeMedium = Math.max(14, canvasWidth * 0.025);
  const fontSizeSmall = Math.max(12, canvasWidth * 0.02);

  return (
    <>
      {/* Always show score */}
      <Text
        text={`Score: ${score}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill="white"
        x={20}
        y={20}
        shadowColor="black"
        shadowBlur={3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.5}
      />
      
      {/* Always show high score */}
      <Text
        text={`Best: ${highScore}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill="white"
        x={20}
        y={20 + fontSizeMedium * 1.5}
        shadowColor="black"
        shadowBlur={3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.5}
      />
      
      {/* Starting instructions */}
      {!isPlaying && !gameOver && (
        <Group>
          <Rect
            width={canvasWidth * 0.7}
            height={canvasHeight * 0.3}
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            offsetX={(canvasWidth * 0.7) / 2}
            offsetY={(canvasHeight * 0.3) / 2}
            fill="rgba(0, 0, 0, 0.6)"
            cornerRadius={10}
            shadowColor="black"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 2 }}
            shadowOpacity={0.3}
          />
          <Text
            text="Emoji Runner"
            fontSize={fontSizeLarge * 1.5}
            fontFamily="Arial"
            fill="#FFDD00"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.35}
            shadowColor="black"
            shadowBlur={5}
            shadowOffset={{ x: 2, y: 2 }}
            shadowOpacity={0.5}
          />
          <Text
            text="Press Space or Click/Tap to Jump"
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.45}
          />
          <Text
            text="Avoid obstacles and survive as long as possible!"
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill="#AAAAAA"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.52}
          />
          <Text
            text="Click or press Space to start"
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill="#FFDD00"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.6}
          />
        </Group>
      )}
      
      {/* Game over message */}
      {gameOver && (
        <Group>
          <Rect
            width={canvasWidth * 0.7}
            height={canvasHeight * 0.4}
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            offsetX={(canvasWidth * 0.7) / 2}
            offsetY={(canvasHeight * 0.4) / 2}
            fill="rgba(0, 0, 0, 0.7)"
            cornerRadius={10}
            shadowColor="black"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 2 }}
            shadowOpacity={0.3}
          />
          <Text
            text="Game Over"
            fontSize={fontSizeLarge * 1.5}
            fontFamily="Arial"
            fill="#FF5252"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.35}
            shadowColor="black"
            shadowBlur={5}
            shadowOffset={{ x: 2, y: 2 }}
            shadowOpacity={0.5}
          />
          <Text
            text={`Your Score: ${score}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.45}
          />
          <Text
            text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill={score > highScore ? "#FFD700" : "white"}
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.52}
          />
          <Text
            text="Click or press Space to play again"
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill="#AAAAAA"
            align="center"
            width={canvasWidth}
            y={canvasHeight * 0.6}
          />
        </Group>
      )}
    </>
  );
};

export default memo(UIRenderer);