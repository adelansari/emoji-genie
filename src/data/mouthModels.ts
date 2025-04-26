import React from 'react';

const svgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../assets/mouth/*.svg', { eager: true });

export type MouthShapeType = string;

export interface MouthModel {
  id: MouthShapeType;
  name: string;
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const mouthModels: MouthModel[] = Object.entries(svgModules).map(([path, module]) => {
  const SvgComponent = module.default;
  const filename = path.split('/').pop()?.replace('.svg', '');
  if (!filename || !SvgComponent) {
    console.error(`Could not process SVG module for mouth path: ${path}`);
    return null;
  }
  const name = filename.charAt(0).toUpperCase() + filename.slice(1);
  const id = filename;

  return {
    id,
    name,
    SvgComponent,
  };
}).filter((model): model is MouthModel => model !== null);

console.log("Processed mouthModels:", mouthModels);
