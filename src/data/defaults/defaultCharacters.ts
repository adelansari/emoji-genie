import { Character } from "../../context/CharacterCollectionContext";
import { EmojiType } from "../../context/EmojiCustomizationContext";
import { convertSvgToPng } from "../../utils/exportUtils";

const generateDefaultId = (prefix: string) => {
  return `default_${prefix}_${Math.random().toString(36).substring(2, 9)}`;
};

const createGeometryDashSvg = async (color: string, shape: 'square' | 'triangle' | 'circle', face: 'happy' | 'cool'): Promise<string> => {
  let shapePath = '';
  let viewBox = '0 0 100 100';
  
  // Define shape paths
  if (shape === 'square') {
    shapePath = '<rect x="10" y="10" width="80" height="80" rx="5" fill="' + color + '" />';
  } else if (shape === 'triangle') {
    shapePath = '<polygon points="50,10 10,90 90,90" fill="' + color + '" />';
  } else if (shape === 'circle') {
    shapePath = '<circle cx="50" cy="50" r="40" fill="' + color + '" />';
  }
  
  // Add face features
  let faceFeatures = '';
  if (face === 'happy') {
    faceFeatures = `
      <circle cx="35" cy="40" r="5" fill="white" />
      <circle cx="65" cy="40" r="5" fill="white" />
      <path d="M30,60 Q50,75 70,60" stroke="white" stroke-width="3" fill="none" />
    `;
  } else if (face === 'cool') {
    faceFeatures = `
      <rect x="25" y="35" width="20" height="10" rx="2" fill="white" />
      <rect x="55" y="35" width="20" height="10" rx="2" fill="white" />
      <path d="M35,65 H65" stroke="white" stroke-width="3" fill="none" />
    `;
  }
  
  // Create SVG string
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
      ${shapePath}
      ${faceFeatures}
    </svg>
  `;
  
  try {
    // Convert to base64
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    // Convert SVG to PNG to avoid corruption issues
    return await convertSvgToPng(svgDataUrl);
  } catch (error) {
    console.error('Error creating geometry dash character:', error);
    // Fallback to SVG if PNG conversion fails
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }
};

// Create default base characters
export const createDefaultCharacters = async (): Promise<Character[]> => {
  // Create all characters in parallel
  const [square, triangle, circle, coolSquare] = await Promise.all([
    createGeometryDashSvg('#FF5722', 'square', 'happy'),
    createGeometryDashSvg('#2196F3', 'triangle', 'cool'),
    createGeometryDashSvg('#4CAF50', 'circle', 'happy'),
    createGeometryDashSvg('#9C27B0', 'square', 'cool')
  ]);

  return [
    // Default Emoji characters - Geometry Dash inspired
    {
      id: generateDefaultId('emoji1'),
      name: "Square Emoji",
      imageUrl: square,
      type: 'emoji' as EmojiType,
      createdAt: Date.now() - 40000,
      isDefault: true
    },
    {
      id: generateDefaultId('emoji2'),
      name: "Triangle Emoji",
      imageUrl: triangle,
      type: 'emoji' as EmojiType,
      createdAt: Date.now() - 30000,
      isDefault: true
    },
    
    // Default Sticker characters - Geometry Dash inspired
    {
      id: generateDefaultId('sticker1'),
      name: "Circle Sticker",
      imageUrl: circle,
      type: 'sticker' as EmojiType,
      createdAt: Date.now() - 20000,
      isDefault: true
    },
    {
      id: generateDefaultId('sticker2'),
      name: "Cool Square",
      imageUrl: coolSquare,
      type: 'sticker' as EmojiType, 
      createdAt: Date.now() - 10000,
      isDefault: true
    }
  ];
};

// Export individual default characters by type
export const getDefaultCharactersByType = async (type: EmojiType): Promise<Character[]> => {
  const allCharacters = await createDefaultCharacters();
  return allCharacters.filter(character => character.type === type);
};