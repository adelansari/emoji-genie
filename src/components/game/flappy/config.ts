// Game physics constants
export const BASE_GRAVITY = 0.25;
export const DESKTOP_FLAP_STRENGTH = -7;
export const MOBILE_FLAP_STRENGTH = -5.5;
export const PIPE_WIDTH = 60;
export const BIRD_SIZE_BASE = 40;

// Speed options for difficulty levels
export const SPEED_OPTIONS = [
  { value: 2, label: 'Easy' },
  { value: 3.5, label: 'Normal' },
  { value: 5, label: 'Hard' }
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