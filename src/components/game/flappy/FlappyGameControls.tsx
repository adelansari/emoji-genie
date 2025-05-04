import { useState } from 'react';
import { useGame } from '../../../context/GameContext'; // Generic game state/controls
import { useFlappyAchievements } from './hooks/useFlappyAchievements'; // Flappy specific state
import { useEmojiCustomization } from '../../../context/EmojiCustomizationContext';
import { useCharacterCollection } from '../../../context/CharacterCollectionContext';
import { Play, RotateCcw, HelpCircle, Medal } from 'lucide-react';
import { memo } from 'react';

const FlappyGameControls = () => {
  // Generic state and controls from GameContext
  const { 
    isPlaying,
    gameOver,
    score, 
    gameSpeed,
    startGame, // Use generic startGame
    resetGame, // Use generic resetGame
    setGameSpeed,
  } = useGame();

  // Flappy specific state from useFlappyAchievements hook
  const {
    localHighScore, // Use Flappy specific high score
    playCount,      // Use Flappy specific play count
    totalPipesPassed, // Use Flappy specific pipe count
    achievements    // Use Flappy specific achievements
  } = useFlappyAchievements();
  
  const { emojiType } = useEmojiCustomization();
  const { getActiveCharacter } = useCharacterCollection();
  
  // Get active character to determine its type
  const activeCharacter = getActiveCharacter();

  // Get character type label for display
  const getCharacterTypeLabel = () => {
    if (!activeCharacter) {
      return emojiType === 'emoji' ? 'Emoji' : 'Sticker';
    }
    
    if (activeCharacter.isImported) {
      return 'Imported';
    }
    
    return activeCharacter.type.charAt(0).toUpperCase() + activeCharacter.type.slice(1);
  };
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Improved speed options to match classic Flappy Bird feel
  const speedOptions = [
    { value: 2, label: 'Easy' },
    { value: 3.5, label: 'Normal' },
    { value: 5, label: 'Hard' }
  ];
  
  // Handle play/restart button click - Uses generic context functions
  const handlePlayClick = () => {
    if (gameOver) {
      resetGame(); // Use generic reset
      setTimeout(() => startGame(), 50); // Use generic start
    } else if (!isPlaying) {
      startGame(); // Use generic start
    }
  };

  // Get completion percentage for all achievements - Now safe as achievements comes from the hook
  const achievementCompletion = () => {
    if (!achievements || achievements.length === 0) {
      return 0;
    }
    const total = achievements.length;
    const completed = achievements.filter(a => a.unlocked).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
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
          <p className="text-xl font-bold text-yellow-300">{localHighScore}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Current Character</p>
          <p className="text-xl font-bold text-yellow-300">{getCharacterTypeLabel()}</p>
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
      
      {/* Achievements button */}
      <button
        onClick={() => setShowAchievements(!showAchievements)}
        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <Medal size={18} />
        Achievements ({achievementCompletion()}% Complete)
      </button>
      
      {/* Achievements panel */}
      {showAchievements && (
        <div className="bg-gray-900/70 rounded-md p-3 text-sm">
          <div className="mb-3 pb-2 border-b border-gray-700">
            <p className="text-gray-400">Game Stats:</p>
            <div className="flex justify-between mt-1">
              <span>Games Played:</span>
              <span className="font-bold text-yellow-300">{playCount}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total Pipes Cleared:</span>
              <span className="font-bold text-yellow-300">{totalPipesPassed}</span>
            </div>
          </div>
          
          <p className="font-bold text-yellow-300 mb-2">Your Achievements:</p>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {achievements && achievements.length > 0 ? (
              achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-2 rounded-md ${
                    achievement.unlocked 
                      ? "bg-indigo-900/50 border border-indigo-500/30" 
                      : "bg-gray-800/50 border border-gray-700/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {achievement.unlocked ? (
                      <div className="p-1 bg-yellow-500 rounded-full">
                        <Medal size={14} className="text-gray-900" />
                      </div>
                    ) : (
                      <div className="p-1 bg-gray-700 rounded-full">
                        <Medal size={14} className="text-gray-500" />
                      </div>
                    )}
                    <span className={achievement.unlocked ? "text-yellow-200 font-medium" : "text-gray-400"}>
                      {achievement.title}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1 ml-7">
                    {achievement.description}
                  </p>
                  
                  <div className="mt-2 ml-7">
                    <div className="h-1.5 bg-gray-700 rounded-full w-full">
                      <div 
                        className="h-1.5 bg-indigo-500 rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((achievement.progress / achievement.milestone) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{achievement.progress}/{achievement.milestone}</span>
                      <span>{achievement.milestone > 0 ? Math.round((achievement.progress / achievement.milestone) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Loading achievements...</p>
            )}
          </div>
        </div>
      )}
      
      {/* Main action buttons */}
      <div className="grid grid-cols-2 gap-3">
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
      
      {/* Instructions button */}
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
            <li>Cycle through Day, Sunset, and Night themes in-game!</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
            <p className="text-yellow-300 font-medium">Pro Tip:</p>
            <p className="text-gray-300">Complete achievements to track your progress and show off your skills!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FlappyGameControls);