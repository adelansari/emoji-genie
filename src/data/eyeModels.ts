import React from 'react';

const svgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../assets/eye/*.svg', { eager: true });

export type EyeShapeType = string;

export interface EyeModel {
  id: EyeShapeType;
  name: string;
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const eyeModels: EyeModel[] = Object.entries(svgModules).map(([path, module]) => {
  const SvgComponent = module.default;
  const filename = path.split('/').pop()?.replace('.svg', '');
  if (!filename || !SvgComponent) {
    console.error(`Could not process SVG module for eye path: ${path}`);
    return null;
  }
  const name = filename.charAt(0).toUpperCase() + filename.slice(1);
  const id = filename;

  return {
    id,
    name,
    SvgComponent,
  };
}).filter((model): model is EyeModel => model !== null);

console.log("Processed eyeModels:", eyeModels);