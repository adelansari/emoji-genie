import { FlappyGame, FlappyGameControls } from '../../components/game/flappy';
import React from 'react';

// Define the interface for game configuration
export interface GameConfig {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  component: React.ComponentType<any>;
  controls?: React.ComponentType<any> | null;
}

// Create component factories for coming soon games
const createComingSoonGame = (title: string): React.ComponentType => {
  const ComingSoonComponent = () => (
    React.createElement('div', { className: 'bg-gray-800/50 p-8 text-center rounded-lg' }, [
      React.createElement('h2', { key: 'heading', className: 'text-2xl text-yellow-400 font-bold mb-4' }, title),
      React.createElement('p', { key: 'text', className: 'text-gray-300' }, 'This game is coming soon! Please check back later.')
    ])
  );
  
  return ComingSoonComponent;
};

// Define all games in a single array
export const GAME_DATA: GameConfig[] = [
  {
    id: 'flappy',
    name: 'Flappy Emoji',
    description: 'Navigate through pipes by flapping your emoji character.',
    imageUrl: 'src/assets/games/flappy.png',
    component: FlappyGame,
    controls: FlappyGameControls
  },
  {
    id: 'runner',
    name: 'Emoji Runner',
    description: 'Run and jump over obstacles in this endless runner.',
    imageUrl: '/assets/screenshots/02.jpeg',
    component: createComingSoonGame('Emoji Runner'),
    controls: null
  },
  {
    id: 'puzzle',
    name: 'Emoji Puzzle',
    description: 'Use your emoji to solve challenging puzzles.',
    imageUrl: '/assets/screenshots/03.jpeg',
    component: createComingSoonGame('Emoji Puzzle'),
    controls: null
  }
  // Add more games here as needed
];

// Helper function to get a game by ID
export const getGameById = (id: string): GameConfig | undefined => {
  return GAME_DATA.find(game => game.id === id);
};

// Helper function to get the default game
export const getDefaultGame = (): GameConfig => {
  return GAME_DATA[0];
};