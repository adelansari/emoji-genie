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

  // Add text shadow for better contrast
  const textShadow = {
    shadowColor: 'black',
    shadowBlur: 4,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    shadowOpacity: 0.8
  };
  
  return (
    <>
      {/* Score display - with improved contrast */}
      <Rect
        width={width * 0.25}
        height={fontSizeMedium * 1.5}
        x={width * 0.015}
        y={scoreTextY - fontSizeMedium * 0.25}
        fill="rgba(0, 0, 0, 0.4)"
        cornerRadius={5}
      />
      <Text
        text={`Score: ${score}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill={textColors.primary}
        x={width * 0.03}
        y={scoreTextY}
        {...textShadow}
      />
      
      {/* High Score display - with improved contrast */}
      <Rect
        width={width * 0.25}
        height={fontSizeMedium * 1.5}
        x={width * 0.015}
        y={highScoreTextY - fontSizeMedium * 0.25}
        fill="rgba(0, 0, 0, 0.4)"
        cornerRadius={5}
      />
      <Text
        text={`Best: ${highScore}`}
        fontSize={fontSizeMedium}
        fontFamily="Arial"
        fill={textColors.primary}
        x={width * 0.03}
        y={highScoreTextY}
        {...textShadow}
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
          {...textShadow}
        />
      )}
      
      {/* Game over message - with Press Start 2P font */}
      {gameOver && (
        <>
          <Rect
            width={width * 0.7}
            height={height * 0.35}
            x={width / 2}
            y={height / 2}
            offsetX={(width * 0.7) / 2}
            offsetY={(height * 0.35) / 2}
            fill="rgba(0, 0, 0, 0.75)"
            cornerRadius={10}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={2}
          />
          <Text
            text="GAME OVER"
            fontSize={fontSizeLarge}
            fontFamily="'Press Start 2P', monospace"
            fill={textColors.gameOver}
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.38}
            shadowColor="black"
            shadowBlur={6}
            shadowOffsetX={2}
            shadowOffsetY={2}
            shadowOpacity={1}
          />
          <Text
            text={`Score: ${score}`}
            fontSize={fontSizeMedium}
            fontFamily="'Press Start 2P', monospace"
            fill={textColors.primary}
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.48}
            {...textShadow}
          />
          <Text
            text={score > highScore ? "New High Score!" : `Best: ${highScore}`}
            fontSize={fontSizeSmall}
            fontFamily="'Press Start 2P', monospace"
            fill={score > highScore ? textColors.accent : textColors.primary}
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.54}
            {...textShadow}
          />
          <Text
            text="Tap to Play Again"
            fontSize={fontSizeXSmall}
            fontFamily="'Press Start 2P', monospace"
            fill="#FFFFFF"
            align="center"
            width={width * 0.6}
            x={width / 2}
            offsetX={(width * 0.6) / 2}
            y={height * 0.62}
            opacity={0.7}
            {...textShadow}
          />
        </>
      )}
    </>
  );
};

export default memo(FlappyUI);