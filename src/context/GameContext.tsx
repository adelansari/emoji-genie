import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useEmojiCustomization } from './EmojiCustomizationContext';

interface GameContextType {
  isPlaying: boolean;
  score: number;
  highScore: number;
  gameSpeed: number;
  gameOver: boolean;
  startGame: () => void;
  endGame: () => void;
  incrementScore: () => void;
  resetGame: () => void;
  setGameSpeed: (speed: number) => void;
}

const GameContext = createContext<GameContextType>(null!);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  
  const { emojiType } = useEmojiCustomization();

  // Load high score from local storage on component mount
  useEffect(() => {
    const storedHighScore = localStorage.getItem('flappyEmojiHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  // Save high score to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('flappyEmojiHighScore', highScore.toString());
  }, [highScore]);

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
    startGame,
    endGame,
    incrementScore,
    resetGame,
    setGameSpeed
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};