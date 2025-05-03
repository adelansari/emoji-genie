import { FC, memo } from 'react';
import { Text, Rect, Group } from 'react-konva';
import { THEME_COLORS } from './config';
import { GameTheme } from './storageUtils';

interface FlappyUIProps {
  width: number;
  height: number;
  score: number;
  highScore: number;
  isPlaying: boolean;
  gameOver: boolean;
  characterImage: HTMLImageElement | null;
  theme: GameTheme;
}

const FlappyUI: FC<FlappyUIProps> = ({ 
  width, 
  height, 
  score, 
  highScore, 
  isPlaying, 
  gameOver,
  characterImage,
  theme
}) => {
  // Theme colors
  const textColors = THEME_COLORS[theme].text;
  
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
        fill={textColors.primary}
        x={width * 0.03}
        y={scoreTextY}
      />
      
      {/* High Score display */}
      <Text
        text={`Best: ${highScore}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill={textColors.primary}
        x={width * 0.03}
        y={highScoreTextY}
      />
      
      {/* Starting instruction */}
      {!isPlaying && !gameOver && (
        <Text
          text="Tap or Space to Start"
          fontSize={fontSizeLarge}
          fontFamily="Arial"
          fill={textColors.primary}
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
            fill={textColors.gameOver}
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
            fill={textColors.primary}
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
            fill={score > highScore ? textColors.accent : textColors.primary}
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