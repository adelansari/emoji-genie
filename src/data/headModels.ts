export type HeadShapeType =
  // Original
  | "circle"
  | "square"
  | "rectangle"
  | "triangle"
  | "oval"
  // Added
  | "roundedSquare"
  | "tallRectangle"
  | "wideRectangle"
  | "roundedRectangle"
  | "isoTriangleUp"
  | "isoTriangleDown"
  | "rightTriangleLeft"
  | "rightTriangleRight"
  | "tallOval"
  | "wideOval"
  | "pentagon"
  | "hexagon"
  | "octagon"
  | "star"
  | "heart"
  | "egg"
  | "eggUpsideDown"
  | "bean"
  | "pear"
  | "apple"
  | "blob1"
  | "blob2"
  | "roundTopFlatBottom"
  | "flatTopRoundBottom"
  | "diamond";


export interface HeadModel {
  id: HeadShapeType;
  name: string;
}

export const headModels: HeadModel[] = [
  // Original
  { id: "circle", name: "Circle" },
  { id: "square", name: "Square" },
  { id: "rectangle", name: "Rectangle" },
  { id: "triangle", name: "Triangle" },
  { id: "oval", name: "Oval" },
  // Added
  { id: "roundedSquare", name: "Rounded Square" },
  { id: "tallRectangle", name: "Tall Rectangle" },
  { id: "wideRectangle", name: "Wide Rectangle" },
  { id: "roundedRectangle", name: "Rounded Rectangle" },
  { id: "isoTriangleUp", name: "Triangle (Up)" },
  { id: "isoTriangleDown", name: "Triangle (Down)" },
  { id: "rightTriangleLeft", name: "Triangle (Left)" },
  { id: "rightTriangleRight", name: "Triangle (Right)" },
  { id: "tallOval", name: "Tall Oval" },
  { id: "wideOval", name: "Wide Oval" },
  { id: "pentagon", name: "Pentagon" },
  { id: "hexagon", name: "Hexagon" },
  { id: "octagon", name: "Octagon" },
  { id: "star", name: "Star" },
  { id: "heart", name: "Heart" },
  { id: "egg", name: "Egg" },
  { id: "eggUpsideDown", name: "Egg (Up)" },
  { id: "bean", name: "Bean" },
  { id: "pear", name: "Pear" },
  { id: "apple", name: "Apple" },
  { id: "blob1", name: "Blob 1" },
  { id: "blob2", name: "Blob 2" },
  { id: "roundTopFlatBottom", name: "Dome" },
  { id: "flatTopRoundBottom", name: "Bowl" },
  { id: "diamond", name: "Diamond" },
];