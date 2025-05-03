import React from 'react';
import { useGame, GameType } from '../../context/GameContext';

interface GameCardProps {
  id: GameType;
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
      className={`relative p-4 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-yellow-600/30 border-2 border-yellow-500' 
          : 'bg-gray-800/40 border-2 border-gray-700/50 hover:border-gray-500'
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
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold text-black px-2 py-1 rounded-full">
          Selected
        </div>
      )}
    </div>
  );
};

const GameSelector: React.FC = () => {
  const { gameType, setGameType } = useGame();
  const games: Array<{
    id: GameType;
    title: string;
    description: string;
    imageUrl: string;
  }> = [
    {
      id: 'flappy',
      title: 'Flappy Emoji',
      description: 'Navigate through pipes by flapping your emoji character.',
      imageUrl: 'src/assets/games/flappy.png',
    },
    {
      id: 'runner',
      title: 'Emoji Runner',
      description: 'Run and jump over obstacles in this endless runner.',
      imageUrl: '/assets/screenshots/02.jpeg',
    },
    {
      id: 'puzzle',
      title: 'Emoji Puzzle',
      description: 'Use your emoji to solve challenging puzzles.',
      imageUrl: '/assets/screenshots/03.jpeg',
    }
  ];

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-4">Choose a Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard 
            key={game.id}
            id={game.id}
            title={game.title}
            description={game.description}
            imageUrl={game.imageUrl}
            isSelected={gameType === game.id}
            onClick={() => setGameType(game.id)}  // No error now, game.id is of type GameType
          />
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-400">Note:</h3>
        <p className="text-gray-300">
          Your customized emoji will be used as the character in all games.
          Feel free to switch games at any time!
        </p>
      </div>
    </div>
  );
};

export default GameSelector;