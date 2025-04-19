export type HeadShapeType = "circle" | "square" | "rectangle" | "triangle" | "oval";

export interface HeadModel {
  id: HeadShapeType;
  name: string;
  // Add preview data if needed, e.g., an SVG path or small image URL
}

export const headModels: HeadModel[] = [
  { id: "circle", name: "Circle" },
  { id: "square", name: "Square" },
  { id: "rectangle", name: "Rectangle" },
  { id: "triangle", name: "Triangle" },
  { id: "oval", name: "Oval" },
];
