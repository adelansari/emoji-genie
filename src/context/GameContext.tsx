import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useEmojiCustomization, EmojiType } from './EmojiCustomizationContext'; // Import EmojiType
import { loadImageFromLocalStorage } from '../utils/exportUtils';

// Add game type
export type GameType = 'flappy' | 'runner' | 'puzzle';

// Define storage keys based on emoji type
export const CHARACTER_IMAGE_KEYS = {
  emoji: 'flappyEmojiCharacter',
  sticker: 'flappyStickerCharacter'
};

interface GameContextType {
  isPlaying: boolean;
  score: number;
  highScore: number; // Keep high score generic for now, might need per-game later
  gameSpeed: number;
  gameOver: boolean;
  characterImageUrl: string | null;
  emojiType: EmojiType;
  gameType: GameType;
  startGame: () => void;
  endGame: (finalScore: number) => void; // Pass final score for potential high score update
  incrementScore: () => void;
  resetGame: () => void;
  setGameSpeed: (speed: number) => void;
  setCharacterImageUrl: (url: string | null) => void;
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

// Storage keys - Keep only generic ones if needed, or remove if managed per-game
const HIGH_SCORE_KEY = 'genericHighScore'; // Example: Make generic or remove
const GAME_TYPE_KEY = 'selectedGameType'; // Keep

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); // Generic high score
  const [gameSpeed, setGameSpeed] = useState(3.5);
  const [gameOver, setGameOver] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [gameType, setGameType] = useState<GameType>('flappy');

  const { emojiType } = useEmojiCustomization();
  
  // Get the correct storage key based on the current emoji type
  const currentCharacterImageKey = useMemo(() => 
    CHARACTER_IMAGE_KEYS[emojiType],
  [emojiType]);

  // Load data from local storage on component mount
  useEffect(() => {
    // Load generic high score (example)
    const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    // Load character image based on current emoji type
    const storedCharacterImage = loadImageFromLocalStorage(currentCharacterImageKey);
    if (storedCharacterImage) {
      setCharacterImageUrl(storedCharacterImage);
    }

    // Load game type
    const storedGameType = localStorage.getItem(GAME_TYPE_KEY) as GameType;
    if (storedGameType) {
      setGameType(storedGameType);
    }
  }, [currentCharacterImageKey]); // Re-run when the key changes

  // Save data to local storage whenever it changes
  useEffect(() => {
    // Save generic high score (example)
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem(GAME_TYPE_KEY, gameType);
    if (isPlaying) {
      resetGame(); // Keep reset on game type change
    }
  }, [gameType]);

  // Load the appropriate character when switching emoji type
  useEffect(() => {
    // Load character image when emoji type changes
    const storedCharacterImage = loadImageFromLocalStorage(currentCharacterImageKey);
    if (storedCharacterImage) {
      setCharacterImageUrl(storedCharacterImage);
    } else {
      // If no character found for this emoji type, set to null
      setCharacterImageUrl(null);
    }
    
    if (isPlaying) {
      resetGame();
    }
  }, [emojiType, currentCharacterImageKey]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  // Accept finalScore to update generic high score
  const endGame = (finalScore: number) => {
    setIsPlaying(false);
    setGameOver(true);
    if (finalScore > highScore) {
      setHighScore(finalScore); // Update generic high score
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
    highScore, // Provide generic high score
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
    setGameType,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};