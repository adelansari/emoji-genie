import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import GameSelector from './GameSelector';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { GAME_DATA, getGameById, getDefaultGame } from '../../data/games/gameData';
import { GameType } from '../../context/GameContext'; // Import GameType

const GamePage = () => {
  const { gameType, setGameType } = useGame();
  const [showingGame, setShowingGame] = useState(false);
  
  // Get current game config from centralized game data
  const currentGame = getGameById(gameType) || getDefaultGame();
  
  // Handler for game selection - fix type error by casting to GameType
  const handleGameSelect = (selectedGameType: string) => {
    setGameType(selectedGameType as GameType);
    setShowingGame(true);
  };
  
  // Create component instances
  const GameComponent = currentGame.component;
  const ControlsComponent = currentGame.controls;

  // Render the game selector
  if (!showingGame) {
    return (
      <div className="w-full max-w-6xl bg-gray-900/70 backdrop-blur-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Game Center</h1>
        <GameSelector onGameSelect={handleGameSelect} />
      </div>
    );
  }

  // Render the selected game with breadcrumb navigation
  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-6">
      {/* Breadcrumb navigation */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center text-sm text-gray-400">
          <button 
            onClick={() => setShowingGame(false)} 
            className="flex items-center hover:text-yellow-400 transition-colors cursor-pointer"
          >
            <Home size={16} className="mr-1" />
            <span>Game Center</span>
          </button>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-yellow-400 font-medium">{currentGame.name}</span>
        </div>
        
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{currentGame.name}</h1>
          <button
            onClick={() => setShowingGame(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Games
          </button>
        </div>
      </div>
      
      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-shrink-0 w-full md:w-auto">
          <GameComponent />
        </div>
        {ControlsComponent && (
          <div className="flex-shrink-0 w-full md:w-auto">
            <ControlsComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;