import React from 'react';

const svgModules = import.meta.glob<{ default: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>('../assets/head/*.svg', { eager: true });

export type HeadShapeType = string;

export interface HeadModel {
  id: HeadShapeType;
  name: string;
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const headModels: HeadModel[] = Object.entries(svgModules).map(([path, module]) => {
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
    SvgComponent
  };
}).filter((model): model is HeadModel => model !== null);
