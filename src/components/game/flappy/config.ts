// Game physics constants
export const BASE_GRAVITY = 0.25;
export const DESKTOP_FLAP_STRENGTH = -6.5;
export const MOBILE_FLAP_STRENGTH = -4.5;
export const PIPE_WIDTH = 60;
export const BIRD_SIZE_BASE = 40;

// Speed options for difficulty levels
export const SPEED_OPTIONS = [
  { value: 2, label: 'Easy' },
  { value: 3.5, label: 'Normal' },
  { value: 6, label: 'Hard' }
];

// Game theme options and colors
export const THEME_COLORS = {
  day: {
    sky: "#87CEEB",
    ground: "#8B4513",
    pipe: {
      fill: "#2ECC71",
      stroke: "#27AE60"
    },
    cloud: "#FFFFFF",
    text: {
      primary: "#FFFFFF",
      accent: "#FFDD00",
      gameOver: "#FF5252"
    }
  },
  night: {
    sky: "#1A237E",
    ground: "#3E2723",
    pipe: {
      fill: "#3949AB",
      stroke: "#303F9F"
    },
    cloud: "#9FA8DA",
    text: {
      primary: "#E8EAF6",
      accent: "#FFECB3",
      gameOver: "#FF8A80"
    }
  },
  sunset: {
    sky: "#FF7F50",
    ground: "#654321",
    pipe: {
      fill: "#FF5722",
      stroke: "#BF360C"
    },
    cloud: "#FFC0CB",
    text: {
      primary: "#FFFFFF",
      accent: "#FFD700",
      gameOver: "#D50000"
    }
  }
};

// Theme cycle order for in-game cycling
export const THEME_CYCLE = ['day', 'sunset', 'night'];

// Visual effects config
export const EFFECTS = {
  death: {
    particleCount: 30,
    colors: ["#FF5252", "#FFEB3B", "#FFC107", "#FF9800"],
    duration: 1000,
    size: { min: 2, max: 8 },
    speed: { min: 1, max: 5 }
  }
};

// Achievement display config
export const ACHIEVEMENT_DISPLAY = {
  duration: 3000, // How long to show achievement notification in ms
  position: { x: 0.5, y: 0.3 }, // Relative position (0-1)
};

// High score achievements
export const HIGH_SCORE_ACHIEVEMENTS = [
  { id: 'score_10', title: 'Rookie', description: 'Score 10 points', milestone: 10 },
  { id: 'score_25', title: 'Amateur', description: 'Score 25 points', milestone: 25 },
  { id: 'score_50', title: 'Skilled', description: 'Score 50 points', milestone: 50 },
  { id: 'score_100', title: 'Pro', description: 'Score 100 points', milestone: 100 },
  { id: 'score_150', title: 'Expert', description: 'Score 150 points', milestone: 150 },
  { id: 'score_200', title: 'Master', description: 'Score 200 points', milestone: 200 },
  { id: 'score_300', title: 'Legend', description: 'Score 300 points', milestone: 300 }
];

// Game count achievements
export const GAME_COUNT_ACHIEVEMENTS = [
  { id: 'games_5', title: 'Beginner', description: 'Play 5 games', milestone: 5 },
  { id: 'games_25', title: 'Regular', description: 'Play 25 games', milestone: 25 },
  { id: 'games_100', title: 'Veteran', description: 'Play 100 games', milestone: 100 }
];

// Helper to detect mobile devices
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (window.innerWidth <= 768);
};

// Function to calculate responsive size for the canvas
export const getResponsiveCanvasSize = () => {
  const padding = 32; 
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.7; 
  const maxSize = 600; 
  const minSize = 300; 
  const size = Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
  return { width: size, height: size };
};

// Calculate adjusted physics constants based on difficulty level
export const calculateGamePhysics = (gameSpeed: number) => {
  const gravity = (() => {
    if (gameSpeed <= 2.5) return BASE_GRAVITY * 0.7;
    if (gameSpeed >= 4.5) return BASE_GRAVITY * 1.3;
    return BASE_GRAVITY;
  })();
  
  const flapStrength = (() => {
    if (isMobileDevice()) {
      if (gameSpeed <= 2.5) return MOBILE_FLAP_STRENGTH * 0.85;
      if (gameSpeed >= 4.5) return MOBILE_FLAP_STRENGTH * 1.15;
      return MOBILE_FLAP_STRENGTH;
    } else {
      if (gameSpeed <= 2.5) return DESKTOP_FLAP_STRENGTH * 0.85;
      if (gameSpeed >= 4.5) return DESKTOP_FLAP_STRENGTH * 1.15;
      return DESKTOP_FLAP_STRENGTH;
    }
  })();
  
  return { gravity, flapStrength };
};