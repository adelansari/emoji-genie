import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import { useEmojiCustomization } from '../../../context/EmojiCustomizationContext';
import { Play, Pause, RotateCcw, HelpCircle, Zap, Trophy, Shield } from 'lucide-react';

const RunnerGameControls = () => {
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
  
  // UI states
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [powerupCooldown, setPowerupCooldown] = useState(0);
  
  // Speed options for Runner game
  const speedOptions = [
    { value: 0.7, label: 'Easy' },
    { value: 1.0, label: 'Normal' },
    { value: 1.5, label: 'Hard' }
  ];
  
  // Simulated achievements for the runner game
  const achievements = [
    {
      id: 'first_run',
      title: 'First Run',
      description: 'Start your first run',
      unlocked: true,
      icon: '🏃'
    },
    {
      id: 'score_10',
      title: 'Getting Started',
      description: 'Reach a score of 10 points',
      unlocked: highScore >= 10,
      icon: '🌟'
    },
    {
      id: 'score_25',
      title: 'Runner Up',
      description: 'Reach a score of 25 points',
      unlocked: highScore >= 25,
      icon: '🥈'
    },
    {
      id: 'score_50',
      title: 'Marathon Runner',
      description: 'Reach a score of 50 points',
      unlocked: highScore >= 50,
      icon: '🏆'
    },
    {
      id: 'score_100',
      title: 'Emoji Champion',
      description: 'Reach a score of 100 points',
      unlocked: highScore >= 100,
      icon: '👑'
    }
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
  
  // Simulate cooldown for power-ups
  useEffect(() => {
    if (isPlaying && powerupCooldown > 0) {
      const timer = setTimeout(() => {
        setPowerupCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, powerupCooldown]);
  
  // Calculate how many achievements are unlocked
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <h2 className="text-2xl font-bold text-yellow-400">Emoji Runner</h2>
      
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
          {isPlaying && 'Press Space or Click to Jump'}
          {gameOver && `Your score: ${score}`}
        </p>
      </div>
      
      {/* Game statistics */}
      <div className="bg-gray-900/50 rounded-md p-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-gray-400">High Score</p>
          <p className="text-xl font-bold text-yellow-300">{highScore}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Current Score</p>
          <p className="text-xl font-bold text-yellow-300">{score}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Game Speed</p>
          <p className="text-xl font-bold text-green-400">
            {speedOptions.find(opt => opt.value === gameSpeed)?.label || 'Normal'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Character</p>
          <p className="text-xl font-bold text-blue-400">{emojiType === 'emoji' ? 'Emoji' : 'Sticker'}</p>
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
      
      {/* Power-ups section (disabled when playing) */}
      <div className="bg-gray-900/50 rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Power-ups</p>
          <span className="text-xs text-gray-500">Coming soon!</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            disabled={true}
            className="p-2 rounded bg-gray-700/50 border border-gray-600/50 text-gray-400 cursor-not-allowed flex flex-col items-center text-xs"
          >
            <Shield size={18} className="mb-1" />
            Shield
          </button>
          <button
            disabled={true}
            className="p-2 rounded bg-gray-700/50 border border-gray-600/50 text-gray-400 cursor-not-allowed flex flex-col items-center text-xs"
          >
            <Zap size={18} className="mb-1" />
            Speed Boost
          </button>
          <button
            disabled={true}
            className="p-2 rounded bg-gray-700/50 border border-gray-600/50 text-gray-400 cursor-not-allowed flex flex-col items-center text-xs"
          >
            <div className="mb-1 text-base">🧲</div>
            Magnet
          </button>
        </div>
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
      
      {/* Tabbed content - Instructions and Achievements */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => {
            setShowInstructions(true);
            setShowAchievements(false);
          }}
          className={`py-2 px-4 text-sm rounded-md transition-colors flex items-center justify-center gap-2 ${
            showInstructions 
              ? "bg-gray-700 text-white" 
              : "bg-gray-800 hover:bg-gray-700 text-gray-400"
          }`}
        >
          <HelpCircle size={16} />
          How to Play
        </button>
        
        <button
          onClick={() => {
            setShowAchievements(true);
            setShowInstructions(false);
          }}
          className={`py-2 px-4 text-sm rounded-md transition-colors flex items-center justify-center gap-2 ${
            showAchievements 
              ? "bg-gray-700 text-white" 
              : "bg-gray-800 hover:bg-gray-700 text-gray-400"
          }`}
        >
          <Trophy size={16} />
          Achievements
        </button>
      </div>
      
      {/* Instructions panel */}
      {showInstructions && (
        <div className="bg-gray-900/70 rounded-md p-3 text-sm">
          <h3 className="font-bold text-yellow-300 mb-2">How to Play:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Press Space or Click to start the game</li>
            <li>Press Space or Click to make your character jump</li>
            <li>Avoid cacti, rocks, pits, and flying obstacles</li>
            <li>Your score increases the longer you run</li>
            <li>The game ends when you hit an obstacle</li>
            <li>Your emoji character will animate as you run</li>
            <li>Different obstacles require different jump timing</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
            <p className="text-yellow-300 font-medium">Pro Tip:</p>
            <p className="text-gray-300">Flying birds require precise timing - jump right before they reach you!</p>
          </div>
        </div>
      )}
      
      {/* Achievements panel */}
      {showAchievements && (
        <div className="bg-gray-900/70 rounded-md p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-yellow-300">Achievements:</h3>
            <span className="text-xs text-gray-400">{unlockedCount}/{achievements.length} Unlocked</span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-2 rounded flex items-center gap-2 ${
                  achievement.unlocked 
                    ? "bg-gray-700/70 border border-yellow-500/30" 
                    : "bg-gray-800/30 border border-gray-700/30"
                }`}
              >
                <div className="text-xl">{achievement.icon}</div>
                <div className="flex-grow">
                  <h4 className={achievement.unlocked ? "text-yellow-300" : "text-gray-500"}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-400 text-xs">✓</div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Earn achievements by reaching score milestones!
          </p>
        </div>
      )}
    </div>
  );
};

export default RunnerGameControls;