import { memo } from 'react';
import { GameProvider } from '../../../context/GameContext';
import RunnerGame from './RunnerGame';
import RunnerGameControls from './RunnerGameControls';

const RunnerGameContainer = () => {
  return (
    <GameProvider gameType="runner">
      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-6 p-4">
        <RunnerGame />
        <RunnerGameControls />
      </div>
    </GameProvider>
  );
};

export default memo(RunnerGameContainer);