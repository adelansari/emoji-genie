import { useState, useEffect, useCallback } from 'react';
import { 
  getHighScore, 
  saveHighScore, 
  getGameTheme, 
  saveGameTheme, 
  getPlayCount, 
  incrementPlayCount, 
  getTotalPipesPassed, 
  incrementTotalPipesPassed, 
  getAchievements, 
  saveAchievements, 
  GameTheme, 
  StoredAchievement 
} from '../storageUtils';
import { HIGH_SCORE_ACHIEVEMENTS, GAME_COUNT_ACHIEVEMENTS } from '../config'; // Assuming pipe count achievements are defined here too

// Define achievement types based on config
const ALL_ACHIEVEMENTS_CONFIG = [
  ...HIGH_SCORE_ACHIEVEMENTS,
  ...GAME_COUNT_ACHIEVEMENTS,
  // Add pipe count achievements if they exist in config.ts
  // { id: 'pipes_100', title: 'Pipe Navigator', description: 'Pass 100 pipes', milestone: 100, type: 'pipeCount' },
];

// Hook to manage Flappy Bird specific state and achievements
export const useFlappyAchievements = () => {
  const [localHighScore, setLocalHighScore] = useState<number>(0);
  const [gameTheme, setGameTheme] = useState<GameTheme>('day');
  const [playCount, setPlayCount] = useState<number>(0);
  const [totalPipesPassed, setTotalPipesPassed] = useState<number>(0);
  const [achievements, setAchievements] = useState<StoredAchievement[]>([]);

  // Load initial state from localStorage
  useEffect(() => {
    setLocalHighScore(getHighScore());
    setGameTheme(getGameTheme());
    setPlayCount(getPlayCount());
    setTotalPipesPassed(getTotalPipesPassed());
    
    // Initialize achievements: Load existing or create from config
    const storedAchievements = getAchievements();
    if (storedAchievements.length > 0) {
      // Merge stored achievements with config in case new achievements were added
      const mergedAchievements = ALL_ACHIEVEMENTS_CONFIG.map(config => {
        const stored = storedAchievements.find(sa => sa.id === config.id);
        return stored ? { ...config, ...stored } : { ...config, progress: 0, unlocked: false };
      });
      setAchievements(mergedAchievements);
    } else {
      // Initialize from config if nothing is stored
      const initialAchievements = ALL_ACHIEVEMENTS_CONFIG.map(config => ({
        ...config,
        progress: 0,
        unlocked: false,
      }));
      setAchievements(initialAchievements);
    }
  }, []);

  // Update achievements based on game events
  const updateAchievements = useCallback((currentScore: number, isGameOver: boolean) => {
    if (!isGameOver) return; // Only update achievements at game over

    const updatedAchievements = achievements.map(ach => {
      let progress = ach.progress;
      let unlocked = ach.unlocked;

      if (ach.id.startsWith('score_')) {
        progress = Math.max(ach.progress, currentScore); // Track max score achieved
        if (currentScore >= ach.milestone) {
          unlocked = true;
        }
      } else if (ach.id.startsWith('games_')) {
        progress = playCount; // Use the current play count
        if (playCount >= ach.milestone) {
          unlocked = true;
        }
      } else if (ach.id.startsWith('pipes_')) { // Assuming pipe achievements exist
        progress = totalPipesPassed; // Use the current total pipes
        if (totalPipesPassed >= ach.milestone) {
          unlocked = true;
        }
      }
      
      return { ...ach, progress, unlocked };
    });

    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);
  }, [achievements, playCount, totalPipesPassed]);

  // Handle game start: Increment play count
  const handleGameStart = useCallback(() => {
    const newPlayCount = incrementPlayCount();
    setPlayCount(newPlayCount);
  }, []);

  // Handle game end: Update high score and achievements
  const handleGameEnd = useCallback((finalScore: number) => {
    saveHighScore(finalScore);
    if (finalScore > localHighScore) {
      setLocalHighScore(finalScore);
    }
    // Pass true for isGameOver to trigger achievement update
    updateAchievements(finalScore, true);
  }, [localHighScore, updateAchievements]);

  // Handle pipe passed: Increment total pipes
  const handlePipePassed = useCallback(() => {
    const newTotalPipes = incrementTotalPipesPassed();
    setTotalPipesPassed(newTotalPipes);
  }, []);

  // Handle theme change
  const handleThemeChange = useCallback((newTheme: GameTheme) => {
    setGameTheme(newTheme);
    saveGameTheme(newTheme);
  }, []);

  // Handle game reset (optional, if specific reset logic is needed here)
  const handleGameReset = useCallback(() => {
    // Currently no specific reset logic needed here, but available if required
  }, []);

  return {
    localHighScore,
    gameTheme,
    playCount, // Renamed from localPlayCount for clarity
    totalPipesPassed, // Renamed from localTotalPipesPassed
    achievements, // Renamed from localAchievements
    handleGameStart,
    handleGameEnd,
    handlePipePassed,
    handleGameReset,
    handleThemeChange,
    updateAchievements // Expose if needed externally, though handleGameEnd calls it
  };
};