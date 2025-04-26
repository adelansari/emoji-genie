import React from 'react';

const svgModules = import.meta.glob('../assets/head/*.svg', { eager: true, import: 'default' });

export type HeadShapeType = string;

export interface HeadModel {
  id: HeadShapeType;
  name: string;
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  konvaData?: string;
}

export const headModels: HeadModel[] = Object.entries(svgModules).map(([path, SvgComponent]) => {
  const filename = path.split('/').pop()?.replace('.svg', '');
  const name = filename ? filename.charAt(0).toUpperCase() + filename.slice(1) : 'Unknown';
  const id = name;

  return {
    id,
    name,
    SvgComponent: SvgComponent as React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  };
});