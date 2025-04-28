import React from 'react';
import { ModelBase, ModelIdType } from '../modelTypes';

// Face shape models
const faceShapeSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/face/shape/*.svg', { eager: true });
const faceMouthSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/face/mouth/*.svg', { eager: true });

// Eye models
const eyeShapeSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/eyes/eyeShape/*.svg', { eager: true });
const eyebrowsSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/eyes/eyebrows/*.svg', { eager: true });

// Hair models
const hairSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/hair/*.svg', { eager: true });

// Other models
const othersSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/others/*.svg', { eager: true });

export type StickerPartType = 'face' | 'eyes' | 'hair' | 'others';
export type StickerSubcategoryType = 'shape' | 'mouth' | 'eyeShape' | 'eyebrows' | 'default';

export interface StickerModel extends ModelBase {
  partType: StickerPartType;
  subcategory: StickerSubcategoryType;
}

// Helper function to create models from SVG modules
function createModels(
  modules: Record<string, { default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>, 
  partType: StickerPartType,
  subcategory: StickerSubcategoryType
): StickerModel[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const SvgComponent = module.default;
      const filename = path.split('/').pop()?.replace('.svg', '');
      if (!filename || !SvgComponent) {
        return null;
      }
      // Format name to be more readable (remove numbers, capitalize)
      const name = filename
        .replace(/[0-9]/g, '')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .charAt(0).toUpperCase() + filename
        .replace(/[0-9]/g, '')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .slice(1);
      
      return {
        id: filename,
        name: name || filename,
        SvgComponent,
        partType,
        subcategory
      };
    })
    .filter((model): model is StickerModel => model !== null);
}

// Create models for each part type and subcategory
export const stickerFaceShapeModels = createModels(faceShapeSvgModules, 'face', 'shape');
export const stickerFaceMouthModels = createModels(faceMouthSvgModules, 'face', 'mouth');
export const stickerEyeShapeModels = createModels(eyeShapeSvgModules, 'eyes', 'eyeShape');
export const stickerEyebrowsModels = createModels(eyebrowsSvgModules, 'eyes', 'eyebrows');
export const stickerHairModels = createModels(hairSvgModules, 'hair', 'default');
export const stickerOthersModels = createModels(othersSvgModules, 'others', 'default');

// Define available subcategories for each part type
export const subcategories: Record<StickerPartType, StickerSubcategoryType[]> = {
  face: ['shape', 'mouth'],
  eyes: ['eyeShape', 'eyebrows'],
  hair: ['default'],
  others: ['default']
};

// Display names for subcategories
export const subcategoryNames: Record<StickerSubcategoryType, string> = {
  shape: 'Shape',
  mouth: 'Mouth',
  eyeShape: 'Eye Shape',
  eyebrows: 'Eyebrows',
  default: 'Options'
};

// Combine all models for easy access by part type and subcategory
export const stickerModels: Record<StickerPartType, Record<StickerSubcategoryType, StickerModel[]>> = {
  face: {
    shape: stickerFaceShapeModels,
    mouth: stickerFaceMouthModels,
    eyeShape: [],
    eyebrows: [],
    default: []
  },
  eyes: {
    shape: [],
    mouth: [],
    eyeShape: stickerEyeShapeModels,
    eyebrows: stickerEyebrowsModels,
    default: []
  },
  hair: {
    shape: [],
    mouth: [],
    eyeShape: [],
    eyebrows: [],
    default: stickerHairModels
  },
  others: {
    shape: [],
    mouth: [],
    eyeShape: [],
    eyebrows: [],
    default: stickerOthersModels
  }
};

// Helper function to find a model by part type, subcategory and id
export function findStickerModel(
  partType: StickerPartType, 
  subcategory: StickerSubcategoryType,
  id: ModelIdType
): StickerModel | undefined {
  return stickerModels[partType][subcategory].find(model => model.id === id);
}