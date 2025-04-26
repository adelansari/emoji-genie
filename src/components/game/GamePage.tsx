import FlappyGame from './FlappyGame';
import GameControls from './GameControls';

const GamePage = () => {
  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
      <div className="flex-shrink-0">
        <FlappyGame />
      </div>
      <div className="flex-shrink-0">
        <GameControls />
      </div>
    </div>
  );
};

export default GamePage;