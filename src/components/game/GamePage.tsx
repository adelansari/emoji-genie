import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import GameSelector from './GameSelector';
import { ArrowLeft } from 'lucide-react';
import { FlappyGame, FlappyGameControls } from './flappy';
import { RunnerGame, RunnerGameControls } from './runner';

const GamePage = () => {
  const { gameType } = useGame();
  const [showGameSelector, setShowGameSelector] = useState(false);

  // Function to render the current game based on gameType
  const renderGame = () => {
    switch (gameType) {
      case 'flappy':
        return <FlappyGame />;
      case 'runner':
        return <RunnerGame />;
      case 'puzzle':
        return <div className="bg-gray-800/50 p-8 text-center rounded-lg">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4">Emoji Puzzle</h2>
          <p className="text-gray-300">This game is coming soon! Please check back later.</p>
        </div>;
      default:
        return <FlappyGame />;
    }
  };

  // Function to render game controls if applicable
  const renderGameControls = () => {
    switch (gameType) {
      case 'flappy':
        return <FlappyGameControls />;
      case 'runner':
        return <RunnerGameControls />;
      default:
        return null;
    }
  };

  if (showGameSelector) {
    return (
      <div className="w-full max-w-6xl bg-gray-900/70 backdrop-blur-md p-6 rounded-lg">
        <button
          onClick={() => setShowGameSelector(false)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
        >
          <ArrowLeft size={16} />
          Back to Game
        </button>
        <GameSelector />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-8">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Game Center</h1>
        <button
          onClick={() => setShowGameSelector(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Change Game
        </button>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-shrink-0">
          {renderGame()}
        </div>
        <div className="flex-shrink-0">
          {renderGameControls()}
        </div>
      </div>
    </div>
  );
};

export default GamePage;