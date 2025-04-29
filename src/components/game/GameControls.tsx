import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';
import { Play, RotateCcw, HelpCircle } from 'lucide-react'; // Import icons

const GameControls = () => {
  const { 
    isPlaying,
    gameOver,
    score,
    highScore,
    gameSpeed,
    startGame,
    resetGame,
    setGameSpeed
  } = useGame();
  
  const { emojiType } = useEmojiCustomization();
  
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Improved speed options to match classic Flappy Bird feel
  const speedOptions = [
    { value: 2, label: 'Easy' },
    { value: 3.5, label: 'Normal' },
    { value: 5, label: 'Hard' }
  ];
  
  // Handle play/restart button click
  const handlePlayClick = () => {
    if (gameOver) {
      resetGame();
      setTimeout(() => startGame(), 50); // Small delay to ensure reset completes
    } else if (!isPlaying) {
      startGame();
    }
  };
  
  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <h2 className="text-2xl font-bold text-yellow-400">Flappy {emojiType === 'emoji' ? 'Emoji' : 'Sticker'}</h2>
      
      {/* Game status indicator */}
      <div className="bg-gray-900/50 rounded-md p-3 text-center">
        <p className="text-lg">
          {isPlaying 
            ? '🎮 Game in progress!'
            : gameOver 
              ? '💀 Game Over!' 
              : '🎯 Ready to play!'}
        </p>
        <p className="text-sm mt-1 text-gray-400">
          {!isPlaying && !gameOver && 'Click "Play" or press Space to start'}
          {isPlaying && 'Click or press Space to flap'}
          {gameOver && `Your score: ${score}`}
        </p>
      </div>
      
      {/* Game statistics */}
      <div className="bg-gray-900/50 rounded-md p-3 flex justify-between">
        <div>
          <p className="text-sm text-gray-400">High Score</p>
          <p className="text-xl font-bold text-yellow-300">{highScore}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Current Character</p>
          <p className="text-xl font-bold text-yellow-300">{emojiType === 'emoji' ? 'Emoji' : 'Sticker'}</p>
        </div>
      </div>
      
      {/* Game controls */}
      <div className="bg-gray-900/50 rounded-md p-3">
        <p className="text-sm text-gray-400 mb-2">Game Speed</p>
        <div className="flex gap-2">
          {speedOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setGameSpeed(option.value)}
              disabled={isPlaying}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                gameSpeed === option.value
                  ? "bg-yellow-500 text-gray-900"
                  : isPlaying
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {isPlaying && (
          <p className="text-xs text-gray-400 mt-2">
            Game speed cannot be changed while playing
          </p>
        )}
      </div>
      
      {/* Main action buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Play/Restart button */}
        <button
          onClick={handlePlayClick}
          disabled={isPlaying}
          className={`py-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
            isPlaying
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Play size={18} />
          {gameOver ? 'Play Again' : 'Play'}
        </button>
        
        {/* Reset button - only enabled when not playing */}
        <button
          onClick={resetGame}
          disabled={isPlaying}
          className={`py-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
            isPlaying
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
      
      {/* Instructions button - separated from main actions */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <HelpCircle size={18} />
        {showInstructions ? 'Hide Instructions' : 'How to Play'}
      </button>
      
      {/* Instructions panel */}
      {showInstructions && (
        <div className="bg-gray-900/70 rounded-md p-3 mt-2 text-sm">
          <h3 className="font-bold text-yellow-300 mb-2">How to Play:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Press Space or Click to start the game</li>
            <li>Press Space or Click to make your character flap and rise</li>
            <li>Navigate through the pipes without touching them</li>
            <li>Each pipe you pass gives you 1 point</li>
            <li>The game ends if you hit a pipe or the ground</li>
            <li>You can change the difficulty level before starting</li>
            <li>Create a new emoji/sticker in the customization tab first</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
            <p className="text-yellow-300 font-medium">Pro Tip:</p>
            <p className="text-gray-300">Try different emoji/sticker designs to see which one performs best!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;