import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useEmojiCustomization, EmojiType } from './EmojiCustomizationContext'; // Import EmojiType
import { loadImageFromLocalStorage } from '../utils/exportUtils';

// Add game type
export type GameType = 'flappy' | 'runner' | 'puzzle';
export type GameTheme = 'day' | 'night';

// Achievement structure
export interface Achievement {
  id: string;
  title: string;
  description: string;
  milestone: number;
  type: 'score' | 'playCount' | 'pipeCount';
  unlocked: boolean;
  progress: number;
}

interface GameContextType {
  isPlaying: boolean;
  score: number;
  highScore: number;
  gameSpeed: number;
  gameOver: boolean;
  characterImageUrl: string | null;
  emojiType: EmojiType;
  gameType: GameType;
  gameTheme: GameTheme;
  deathEffect: boolean;
  playCount: number;
  totalPipesPassed: number;
  achievements: Achievement[];
  startGame: () => void;
  endGame: () => void;
  incrementScore: () => void;
  resetGame: () => void;
  setGameSpeed: (speed: number) => void;
  setCharacterImageUrl: (url: string) => void;
  setGameType: (type: GameType) => void;
  setGameTheme: (theme: GameTheme) => void;
  toggleDeathEffect: () => void;
  resetDeathEffect: () => void;
}

const GameContext = createContext<GameContextType>(null!);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Storage keys
const HIGH_SCORE_KEY = 'flappyEmojiHighScore';
const CHARACTER_IMAGE_KEY = 'flappyEmojiCharacter';
const GAME_TYPE_KEY = 'selectedGameType';
const GAME_THEME_KEY = 'gameThemeMode';
const PLAY_COUNT_KEY = 'gamePlayCount';
const TOTAL_PIPES_KEY = 'gameTotalPipes';
const ACHIEVEMENTS_KEY = 'gameAchievements';

interface GameProviderProps {
  children: ReactNode;
}

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'rookie',
    title: 'Rookie Flapper',
    description: 'Score 10 points in a single game',
    milestone: 10,
    type: 'score',
    unlocked: false,
    progress: 0
  },
  {
    id: 'master',
    title: 'Flapping Master',
    description: 'Score 30 points in a single game',
    milestone: 30,
    type: 'score',
    unlocked: false,
    progress: 0
  },
  {
    id: 'addict',
    title: 'Game Addict',
    description: 'Play the game 10 times',
    milestone: 10,
    type: 'playCount',
    unlocked: false,
    progress: 0
  },
  {
    id: 'veteran',
    title: 'Flappy Veteran',
    description: 'Pass through 100 pipes in total',
    milestone: 100,
    type: 'pipeCount',
    unlocked: false,
    progress: 0
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Play a game in night mode and score at least 15 points',
    milestone: 15,
    type: 'score',
    unlocked: false,
    progress: 0
  }
];

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  // Initialize with Normal difficulty (3.5)
  const [gameSpeed, setGameSpeed] = useState(3.5);
  const [gameOver, setGameOver] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  // Initialize with flappy game as default
  const [gameType, setGameType] = useState<GameType>('flappy');
  // Add theme state
  const [gameTheme, setGameTheme] = useState<GameTheme>('day');
  // Add death effect state
  const [deathEffect, setDeathEffect] = useState(false);
  // Add achievement tracking
  const [playCount, setPlayCount] = useState(0);
  const [totalPipesPassed, setTotalPipesPassed] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  
  const { emojiType } = useEmojiCustomization();

  // Load data from local storage on component mount
  useEffect(() => {
    // Load high score
    const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    // Load character image
    const storedCharacterImage = loadImageFromLocalStorage(CHARACTER_IMAGE_KEY);
    if (storedCharacterImage) {
      setCharacterImageUrl(storedCharacterImage);
    }
    
    // Load game type
    const storedGameType = localStorage.getItem(GAME_TYPE_KEY) as GameType;
    if (storedGameType) {
      setGameType(storedGameType);
    }
    
    // Load game theme
    const storedTheme = localStorage.getItem(GAME_THEME_KEY) as GameTheme;
    if (storedTheme) {
      setGameTheme(storedTheme);
    }
    
    // Load play count
    const storedPlayCount = localStorage.getItem(PLAY_COUNT_KEY);
    if (storedPlayCount) {
      setPlayCount(parseInt(storedPlayCount, 10));
    }
    
    // Load total pipes passed
    const storedTotalPipes = localStorage.getItem(TOTAL_PIPES_KEY);
    if (storedTotalPipes) {
      setTotalPipesPassed(parseInt(storedTotalPipes, 10));
    }
    
    // Load achievements
    const storedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    }
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  }, [highScore]);
  
  useEffect(() => {
    localStorage.setItem(GAME_TYPE_KEY, gameType);
    // Reset game state when changing game type
    if (isPlaying) {
      resetGame();
    }
  }, [gameType]);
  
  useEffect(() => {
    localStorage.setItem(GAME_THEME_KEY, gameTheme);
  }, [gameTheme]);
  
  useEffect(() => {
    localStorage.setItem(PLAY_COUNT_KEY, playCount.toString());
  }, [playCount]);
  
  useEffect(() => {
    localStorage.setItem(TOTAL_PIPES_KEY, totalPipesPassed.toString());
  }, [totalPipesPassed]);
  
  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }, [achievements]);

  // Reset game when switching emoji type
  useEffect(() => {
    if (isPlaying) {
      resetGame();
    }
  }, [emojiType]);
  
  // Check and update achievements
  useEffect(() => {
    if (gameOver) {
      updateAchievements();
    }
  }, [gameOver, score]);

  const updateAchievements = () => {
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.progress;
      let unlocked = achievement.unlocked;
      
      if (achievement.type === 'score') {
        // For night_owl achievement, check theme
        if (achievement.id === 'night_owl') {
          if (gameTheme === 'night' && score >= achievement.milestone) {
            progress = achievement.milestone;
            unlocked = true;
          }
        } else if (score >= achievement.milestone) {
          // For regular score achievements
          progress = achievement.milestone;
          unlocked = true;
        } else {
          // Update progress if higher than current but not yet achieved
          progress = Math.max(progress, score);
        }
      } else if (achievement.type === 'playCount') {
        progress = playCount;
        unlocked = playCount >= achievement.milestone;
      } else if (achievement.type === 'pipeCount') {
        progress = totalPipesPassed;
        unlocked = totalPipesPassed >= achievement.milestone;
      }
      
      return { ...achievement, progress, unlocked };
    });
    
    setAchievements(updatedAchievements);
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setPlayCount(prev => prev + 1);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setDeathEffect(true);
    
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setDeathEffect(false);
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
    setTotalPipesPassed(prev => prev + 1);
  };
  
  const toggleDeathEffect = () => {
    setDeathEffect(prev => !prev);
  };
  
  const resetDeathEffect = () => {
    setDeathEffect(false);
  };

  const value = {
    isPlaying,
    score,
    highScore,
    gameSpeed,
    gameOver,
    characterImageUrl,
    emojiType,
    gameType,
    gameTheme,
    deathEffect,
    playCount,
    totalPipesPassed,
    achievements,
    startGame,
    endGame,
    incrementScore,
    resetGame,
    setGameSpeed,
    setCharacterImageUrl,
    setGameType,
    setGameTheme,
    toggleDeathEffect,
    resetDeathEffect
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};