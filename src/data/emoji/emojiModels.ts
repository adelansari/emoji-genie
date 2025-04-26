import React from 'react';
import { ModelBase, ModelIdType } from '../modelTypes';

// Head models
const headSvgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../../assets/head/*.svg', { eager: true });

export type EmojiPartType = 'head' | 'hat' | 'eyes' | 'mouth';

export interface EmojiModel extends ModelBase {
  partType: EmojiPartType;
}

// Create head models
export const emojiHeadModels: EmojiModel[] = Object.entries(headSvgModules).map(([path, module]) => {
  const SvgComponent = module.default;
  const filename = path.split('/').pop()?.replace('.svg', '');
  if (!filename || !SvgComponent) {
    return null;
  }
  const name = filename.charAt(0).toUpperCase() + filename.slice(1);
  const id = filename;

  return {
    id,
    name,
    SvgComponent,
    partType: 'head'
  };
}).filter((model): model is EmojiModel => model !== null);

// For now, we have placeholders for other part types
export const emojiHatModels: EmojiModel[] = [];
export const emojiEyesModels: EmojiModel[] = [];
export const emojiMouthModels: EmojiModel[] = [];

// Combine all models for easy access
export const emojiModels = {
  head: emojiHeadModels,
  hat: emojiHatModels,
  eyes: emojiEyesModels,
  mouth: emojiMouthModels
};

// Helper function to find a model by ID and part type
export function findEmojiModel(partType: EmojiPartType, id: ModelIdType): EmojiModel | undefined {
  return emojiModels[partType].find(model => model.id === id);
}