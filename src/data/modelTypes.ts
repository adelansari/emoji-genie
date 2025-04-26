import React from 'react';

export type ModelIdType = string;

export interface ModelBase {
  id: ModelIdType;
  name: string;
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}