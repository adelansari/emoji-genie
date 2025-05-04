import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useCharacterCollection } from '../../context/CharacterCollectionContext';
import GameSelector from './GameSelector';
import { ArrowLeft, Home, ChevronRight, UserCircle2 } from 'lucide-react';
import { GAME_DATA, getGameById, getDefaultGame } from '../../data/games/gameData';
import { GameType } from '../../context/GameContext'; // Import GameType

const GamePage = () => {
  const { gameType, setGameType, setCharacterImageUrl, characterImageUrl } = useGame();
  const { characters, activeCharacterId, getActiveCharacter, setActiveCharacter } = useCharacterCollection();
  const [showingGame, setShowingGame] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  
  // Get current game config from centralized game data
  const currentGame = getGameById(gameType) || getDefaultGame();
  
  // Get active character from collection
  const activeCharacter = getActiveCharacter();
  
  // Handler for game selection - fix type error by casting to GameType
  const handleGameSelect = (selectedGameType: string) => {
    setGameType(selectedGameType as GameType);
    
    // If no active character is selected, show character selector
    if (!activeCharacter) {
      setShowCharacterSelector(true);
    } else {
      setShowingGame(true);
    }
  };

  // Handle character selection for game
  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setActiveCharacter(character.id);
      setCharacterImageUrl(character.imageUrl);
      setShowCharacterSelector(false);
      setShowingGame(true);
    }
  };
  
  // Create component instances
  const GameComponent = currentGame.component;
  const ControlsComponent = currentGame.controls;

  // Render character selector
  if (showCharacterSelector) {
    return (
      <div className="w-full max-w-6xl bg-gray-900/70 backdrop-blur-md p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Select a Character</h1>
          <button
            onClick={() => {
              // If we've already shown the game before, go back to it
              // Otherwise go to the game selector
              if (showingGame) {
                setShowCharacterSelector(false);
              } else {
                setShowingGame(false);
                setShowCharacterSelector(false);
              }
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        
        {characters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {characters.map((character) => (
              <div 
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                className={`bg-gray-700 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                  ${character.id === activeCharacterId 
                    ? 'border-yellow-500 ring-2 ring-yellow-500' 
                    : 'border-gray-600 hover:border-gray-500'}`}
              >
                <div className="h-24 flex items-center justify-center overflow-hidden bg-gray-800">
                  <img 
                    src={character.imageUrl} 
                    alt={character.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-white font-medium truncate">{character.name}</h3>
                  <p className="text-xs text-gray-400">{character.type.charAt(0).toUpperCase() + character.type.slice(1)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-400 mb-4">You don't have any characters in your collection yet.</p>
            <button 
              onClick={() => {
                setShowCharacterSelector(false);
                setShowingGame(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center gap-2"
            >
              <UserCircle2 size={18} /> Use Default Character
            </button>
          </div>
        )}
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{currentGame.name}</h1>
            
            {/* Active character indicator */}
            {activeCharacter && (
              <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-900">
                  <img 
                    src={activeCharacter.imageUrl} 
                    alt={activeCharacter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-300">{activeCharacter.name}</span>
                <button
                  onClick={() => setShowCharacterSelector(true)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Change
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowCharacterSelector(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow cursor-pointer transition-colors"
            >
              <UserCircle2 size={16} />
              {activeCharacter ? 'Change Character' : 'Select Character'}
            </button>
            <button
              onClick={() => setShowingGame(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow cursor-pointer transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Games
            </button>
          </div>
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