import { FC, memo } from 'react';
import { Text, Rect, Group } from 'react-konva';

interface FlappyUIProps {
  width: number;
  height: number;
  score: number;
  highScore: number;
  isPlaying: boolean;
  gameOver: boolean;
  characterImage: HTMLImageElement | null;
}

const FlappyUI: FC<FlappyUIProps> = ({ 
  width, 
  height, 
  score, 
  highScore, 
  isPlaying, 
  gameOver,
  characterImage 
}) => {
  // Calculate responsive text sizes
  const fontSizeLarge = Math.max(16, width * 0.04);
  const fontSizeMedium = Math.max(14, width * 0.035);
  const fontSizeSmall = Math.max(12, width * 0.03);
  const fontSizeXSmall = Math.max(10, width * 0.025);
  
  // Calculate positions
  const scoreTextY = height * 0.04;
  const highScoreTextY = height * 0.1;
  
  return (
    <>
      {/* Score display */}
      <Text
        text={`Score: ${score}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill="white"
        x={width * 0.03}
        y={scoreTextY}
      />
      
      {/* High Score display */}
      <Text
        text={`Best: ${highScore}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill="white"
        x={width * 0.03}
        y={highScoreTextY}
      />
      
      {/* Custom character badge if exported */}
      {characterImage && (
        <Group x={width - (width * 0.22)} y={height * 0.03}>
          <Rect
            width={width * 0.2}
            height={height * 0.05}
            fill="rgba(0,0,0,0.5)"
            cornerRadius={width * 0.03}
          />
          <Text
            text="Custom"
            fontSize={fontSizeXSmall}
            fontFamily="Arial"
            fill="#FFDD00"
            x={width * 0.015}
            y={height * 0.015}
            width={width * 0.17}
            align="center"
          />
        </Group>
      )}
      
      {/* Starting instruction */}
      {!isPlaying && !gameOver && (
        <Text
          text="Tap or Space to Start"
          fontSize={fontSizeLarge}
          fontFamily="Arial"
          fill="white"
          align="center"
          width={width * 0.8}
          x={width / 2}
          offsetX={(width * 0.8) / 2}
          y={height / 2 - fontSizeLarge}
        />
      )}
      
      {/* Game over message */}
      {gameOver && (
        <>
          <Rect
            width={width * 0.6}
            height={height * 0.3}
            x={width / 2}
            y={height / 2}
            offsetX={(width * 0.6) / 2}
            offsetY={(height * 0.3) / 2}
            fill="rgba(0, 0, 0, 0.7)"
            cornerRadius={10}
          />
          <Text
            text="Game Over"
            fontSize={fontSizeLarge}
            fontFamily="Arial"
            fill="#FF5252"
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.4}
          />
          <Text
            text={`Score: ${score}`}
            fontSize={fontSizeMedium}
            fontFamily="Arial"
            fill="white"
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.5}
          />
          <Text
            text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill={score > highScore ? "#FFD700" : "white"}
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.56}
          />
          <Text
            text="Tap to Play Again"
            fontSize={fontSizeSmall}
            fontFamily="Arial"
            fill="#AAAAAA"
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.62}
          />
        </>
      )}
    </>
  );
};

export default memo(FlappyUI);