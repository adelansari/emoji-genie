import React from 'react';
import { ModelBase, ModelIdType } from '../modelTypes';

// Face shape models
const faceSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/face/shape/*.svg', { eager: true });

// Eye models (will be populated later)
const eyeSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/eyes/eyeShape/*.svg', { eager: true });

// Hair models
const hairSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/stickerCharacter/hair/*.svg', { eager: true });

export type StickerPartType = 'face' | 'eyes' | 'hair' | 'others';

export interface StickerModel extends ModelBase {
  partType: StickerPartType;
}

// Helper function to create models from SVG modules
function createModels(modules: Record<string, { default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>, partType: StickerPartType): StickerModel[] {
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
        partType
      };
    })
    .filter((model): model is StickerModel => model !== null);
}

// Create models for each part type
export const stickerFaceModels = createModels(faceSvgModules, 'face');
export const stickerEyesModels = createModels(eyeSvgModules, 'eyes');
export const stickerHairModels = createModels(hairSvgModules, 'hair');
export const stickerOthersModels: StickerModel[] = []; // Placeholder for now

// Combine all models for easy access
export const stickerModels = {
  face: stickerFaceModels,
  eyes: stickerEyesModels,
  hair: stickerHairModels,
  others: stickerOthersModels
};

// Helper function to find a model by ID and part type
export function findStickerModel(partType: StickerPartType, id: ModelIdType): StickerModel | undefined {
  return stickerModels[partType].find(model => model.id === id);
}