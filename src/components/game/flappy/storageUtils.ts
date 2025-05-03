// Storage keys
const STORAGE_KEYS = {
  HIGH_SCORE: 'flappy_high_score',
  THEME: 'flappy_theme',
  PLAY_COUNT: 'flappy_play_count',
  TOTAL_PIPES_PASSED: 'flappy_total_pipes',
  ACHIEVEMENTS: 'flappy_achievements',
};

// Types
export type GameTheme = 'day' | 'night' | 'sunset';
export interface StoredAchievement {
  id: string;
  title: string;
  description: string;
  milestone: number;
  progress: number;
  unlocked: boolean;
}

// Functions to save and retrieve data from localStorage
export const saveHighScore = (score: number): void => {
  try {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

export const getHighScore = (): number => {
  try {
    const storedScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return storedScore ? parseInt(storedScore, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};

export const saveGameTheme = (theme: GameTheme): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving game theme:', error);
  }
};

export const getGameTheme = (): GameTheme => {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as GameTheme;
    return storedTheme || 'day'; // Default to day theme
  } catch (error) {
    console.error('Error getting game theme:', error);
    return 'day';
  }
};

export const incrementPlayCount = (): number => {
  try {
    const currentCount = getPlayCount();
    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEYS.PLAY_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return 0;
  }
};

export const getPlayCount = (): number => {
  try {
    const storedCount = localStorage.getItem(STORAGE_KEYS.PLAY_COUNT);
    return storedCount ? parseInt(storedCount, 10) : 0;
  } catch (error) {
    console.error('Error getting play count:', error);
    return 0;
  }
};

export const incrementTotalPipesPassed = (count: number = 1): number => {
  try {
    const currentTotal = getTotalPipesPassed();
    const newTotal = currentTotal + count;
    localStorage.setItem(STORAGE_KEYS.TOTAL_PIPES_PASSED, newTotal.toString());
    return newTotal;
  } catch (error) {
    console.error('Error incrementing total pipes passed:', error);
    return 0;
  }
};

export const getTotalPipesPassed = (): number => {
  try {
    const storedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL_PIPES_PASSED);
    return storedTotal ? parseInt(storedTotal, 10) : 0;
  } catch (error) {
    console.error('Error getting total pipes passed:', error);
    return 0;
  }
};

export const saveAchievements = (achievements: StoredAchievement[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

export const getAchievements = (): StoredAchievement[] => {
  try {
    const storedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return storedAchievements ? JSON.parse(storedAchievements) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Clear all game data (for testing/debugging)
export const clearAllGameData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all game data:', error);
  }
};