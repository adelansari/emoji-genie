import { FC, memo } from 'react';
import { Group, Rect } from 'react-konva';
import { PIPE_WIDTH, THEME_COLORS } from './config';
import { GameTheme } from './storageUtils';

export interface PipeData {
  x: number;
  topHeight: number;
  passed: boolean;
  gap: number;
}

interface FlappyPipesProps {
  pipes: PipeData[];
  canvasHeight: number;
  theme: GameTheme;
}

const FlappyPipes: FC<FlappyPipesProps> = ({ pipes, canvasHeight, theme }) => {
  const pipeColors = THEME_COLORS[theme].pipe;
  
  return (
    <>
      {pipes.map((pipe, index) => (
        <Group key={`pipe-${index}`}>
          {/* Top pipe */}
          <Rect
            x={pipe.x}
            y={0}
            width={PIPE_WIDTH}
            height={pipe.topHeight}
            fill={pipeColors.fill}
            stroke={pipeColors.stroke}
            strokeWidth={3}
          />
          {/* Pipe cap - top */}
          <Rect
            x={pipe.x - 5}
            y={pipe.topHeight - 10}
            width={PIPE_WIDTH + 10}
            height={12}
            fill={pipeColors.stroke}
            cornerRadius={3}
          />
          
          {/* Bottom pipe */}
          <Rect
            x={pipe.x}
            y={pipe.topHeight + pipe.gap}
            width={PIPE_WIDTH}
            height={canvasHeight - (pipe.topHeight + pipe.gap)}
            fill={pipeColors.fill}
            stroke={pipeColors.stroke}
            strokeWidth={3}
          />
          {/* Pipe cap - bottom */}
          <Rect
            x={pipe.x - 5}
            y={pipe.topHeight + pipe.gap - 2}
            width={PIPE_WIDTH + 10}
            height={12}
            fill={pipeColors.stroke}
            cornerRadius={3}
          />
        </Group>
      ))}
    </>
  );
};

export default memo(FlappyPipes);