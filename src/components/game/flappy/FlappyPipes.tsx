import { FC, memo } from 'react';
import { Group, Rect } from 'react-konva';
import { PIPE_WIDTH } from './config';

export interface PipeData {
  x: number;
  topHeight: number;
  passed: boolean;
  gap: number;
}

interface FlappyPipesProps {
  pipes: PipeData[];
  canvasHeight: number;
}

const FlappyPipes: FC<FlappyPipesProps> = ({ pipes, canvasHeight }) => {
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
            fill="#2ECC71"
            stroke="#27AE60"
            strokeWidth={3}
          />
          {/* Bottom pipe */}
          <Rect
            x={pipe.x}
            y={pipe.topHeight + pipe.gap}
            width={PIPE_WIDTH}
            height={canvasHeight - (pipe.topHeight + pipe.gap)}
            fill="#2ECC71"
            stroke="#27AE60"
            strokeWidth={3}
          />
        </Group>
      ))}
    </>
  );
};

export default memo(FlappyPipes);