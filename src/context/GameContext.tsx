import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useEmojiCustomization, EmojiType } from './EmojiCustomizationContext'; // Import EmojiType
import { loadImageFromLocalStorage } from '../utils/exportUtils';

// Add game type
export type GameType = 'flappy' | 'runner' | 'puzzle';

interface GameContextType {
  isPlaying: boolean;
  score: number;
  highScore: number;
  gameSpeed: number;
  gameOver: boolean;
  characterImageUrl: string | null;
  emojiType: EmojiType;
  gameType: GameType;
  startGame: () => void;
  endGame: () => void;
  incrementScore: () => void;
  resetGame: () => void;
  setGameSpeed: (speed: number) => void;
  setCharacterImageUrl: (url: string) => void;
  setGameType: (type: GameType) => void;
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

interface GameProviderProps {
  children: ReactNode;
}

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
  
  const { emojiType } = useEmojiCustomization();

  // Load high score, character image, and game type from local storage on component mount
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
  }, []);

  // Save high score to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  }, [highScore]);
  
  // Save game type to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(GAME_TYPE_KEY, gameType);
    // Reset game state when changing game type
    if (isPlaying) {
      resetGame();
    }
  }, [gameType]);

  // Reset game when switching emoji type
  useEffect(() => {
    if (isPlaying) {
      resetGame();
    }
  }, [emojiType]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
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
    startGame,
    endGame,
    incrementScore,
    resetGame,
    setGameSpeed,
    setCharacterImageUrl,
    setGameType
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};