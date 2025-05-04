import React from 'react';
import { useGame, GameType } from '../../context/GameContext'; // Import GameType
import { GAME_DATA } from '../../data/games/gameData';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={`relative p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
        isSelected 
          ? 'bg-yellow-600/30 border-2 border-yellow-500' 
          : 'bg-gray-800/40 border-2 border-gray-700/50 hover:border-gray-500 hover:bg-gray-800/60'
      }`}
      onClick={onClick}
    >
      <div className="aspect-video mb-2 overflow-hidden rounded-md">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-yellow-400">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold text-gray-900 px-2 py-1 rounded-full shadow">
          Selected
        </div>
      )}

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:text-white px-3 py-1 text-sm rounded shadow cursor-pointer transition-colors"
        >
          Play
        </button>
      </div>
    </div>
  );
};

interface GameSelectorProps {
  onGameSelect?: (gameType: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onGameSelect }) => {
  const { gameType, setGameType } = useGame();
  
  // Handle game selection with both context update and callback
  // Fix type error by casting to GameType
  const handleGameSelect = (selectedGameId: string) => {
    setGameType(selectedGameId as GameType);
    if (onGameSelect) {
      onGameSelect(selectedGameId);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-4">Choose a Game</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {GAME_DATA.map((game) => (
          <GameCard 
            key={game.id}
            id={game.id}
            title={game.name}
            description={game.description}
            imageUrl={game.imageUrl}
            isSelected={gameType === game.id}
            onClick={() => handleGameSelect(game.id)}
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-400">Note:</h3>
        <p className="text-gray-300">
          Your customized emoji will be used as the character in all games.
          Click on a game card to start playing!
        </p>
      </div>
    </div>
  );
};

export default GameSelector;