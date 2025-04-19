export type HeadShapeType =
  | "circle"
  | "square"
  | "rectangle"
  | "triangle"
  | "oval"
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
  svgPath?: string;
  konvaData?: string;
}

export const headModels: HeadModel[] = [
  { id: "circle", name: "Circle", svgPath: "M12 12 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0", konvaData: "M 0 -50 A 50 50 0 1 0 0 50 A 50 50 0 1 0 0 -50 Z" },
  { id: "square", name: "Square", svgPath: "M3,3 h18 v18 h-18 Z", konvaData: "M -40 -50 L 40 -50 Q 50 -50 50 -40 L 50 40 Q 50 50 40 50 L -40 50 Q -50 50 -50 40 L -50 -40 Q -50 -50 -40 -50 Z" },
  { id: "rectangle", name: "Rectangle", svgPath: "M2,6 h20 v12 h-20 Z", konvaData: "M -65 -50 L 65 -50 Q 75 -50 75 -40 L 75 40 Q 75 50 65 50 L -65 50 Q -75 50 -75 40 L -75 -40 Q -75 -50 -65 -50 Z" },
  { id: "triangle", name: "Triangle", svgPath: "M12 2 L2 22 L22 22 Z", konvaData: "M 0 -57.7 L 50 28.9 L -50 28.9 Z" },
  { id: "oval", name: "Oval", svgPath: "M12,22 C4,22 4,2 12,2 C20,2 20,22 12,22 Z", konvaData: "M 0 -55.6 A 40 55.6 0 1 0 0 55.6 A 40 55.6 0 1 0 0 -55.6 Z" },
  { id: "roundedSquare", name: "Rounded Square", svgPath: "M8,3 h8 q5,0 5,5 v8 q0,5 -5,5 h-8 q-5,0 -5,-5 v-8 q0,-5 5,-5 Z", konvaData: "M -25 -50 L 25 -50 Q 50 -50 50 -25 L 50 25 Q 50 50 25 50 L -25 50 Q -50 50 -50 25 L -50 -25 Q -50 -50 -25 -50 Z" },
  { id: "tallRectangle", name: "Tall Rectangle", svgPath: "M6,2 h12 v20 h-12 Z", konvaData: "M -25 -70 L 25 -70 Q 35 -70 35 -60 L 35 60 Q 35 70 25 70 L -25 70 Q -35 70 -35 60 L -35 -60 Q -35 -70 -25 -70 Z" },
  { id: "wideRectangle", name: "Wide Rectangle", svgPath: "M1,8 h22 v8 h-22 Z", konvaData: "M -60 -35 L 60 -35 Q 70 -35 70 -25 L 70 25 Q 70 35 60 35 L -60 35 Q -70 35 -70 25 L -70 -25 Q -70 -35 -60 -35 Z" },
  { id: "roundedRectangle", name: "Rounded Rectangle", svgPath: "M8,6 h8 q6,0 6,6 v0 q0,6 -6,6 h-8 q-6,0 -6,-6 v0 q0,-6 6,-6 Z", konvaData: "M -25 -50 L 25 -50 Q 75 -50 75 0 Q 75 50 25 50 L -25 50 Q -75 50 -75 0 Q -75 -50 -25 -50 Z" },
  { id: "isoTriangleUp", name: "Triangle (Up)", svgPath: "M12 3 L4 21 L20 21 Z", konvaData: "M 0 -57.7 L 50 28.9 L -50 28.9 Z" },
  { id: "isoTriangleDown", name: "Triangle (Down)", svgPath: "M12 21 L4 3 L20 3 Z", konvaData: "M 0 57.7 L -50 -28.9 L 50 -28.9 Z" },
  { id: "rightTriangleLeft", name: "Triangle (Left)", svgPath: "M21 3 L21 21 L3 21 Z", konvaData: "M 50 -50 L 50 50 L -50 50 Z" },
  { id: "rightTriangleRight", name: "Triangle (Right)", svgPath: "M3 3 L3 21 L21 21 Z", konvaData: "M -50 -50 L -50 50 L 50 50 Z" },
  { id: "tallOval", name: "Tall Oval", svgPath: "M12,22 C6,22 6,2 12,2 C18,2 18,22 12,22 Z", konvaData: "M 0 -66.7 A 33.3 66.7 0 1 0 0 66.7 A 33.3 66.7 0 1 0 0 -66.7 Z" },
  { id: "wideOval", name: "Wide Oval", svgPath: "M22,12 C22,6 2,6 2,12 C2,18 22,18 22,12 Z", konvaData: "M 0 -33.3 A 66.7 33.3 0 1 0 0 33.3 A 66.7 33.3 0 1 0 0 -33.3 Z" },
  { id: "pentagon", name: "Pentagon", svgPath: "M12 2 L22 8 L18 22 L6 22 L2 8 Z", konvaData: "M 0 -55.6 L 52.9 -17.2 L 32.7 44.9 L -32.7 44.9 L -52.9 -17.2 Z" },
  { id: "hexagon", name: "Hexagon", svgPath: "M18 3 L6 3 L0 12 L6 21 L18 21 L24 12 Z", konvaData: "M 50 0 L 25 43.3 L -25 43.3 L -50 0 L -25 -43.3 L 25 -43.3 Z" },
  { id: "octagon", name: "Octagon", svgPath: "M8 2 L16 2 L22 8 L22 16 L16 22 L8 22 L2 16 L2 8 Z", konvaData: "M 35.4 -35.4 L 50 0 L 35.4 35.4 L 0 50 L -35.4 35.4 L -50 0 L -35.4 -35.4 L 0 -50 Z" },
  { id: "star", name: "Star", svgPath: "M12 1 L15.09 8.26 L23 9.27 L17 14.14 L18.18 22 L12 18.31 L5.82 22 L7 14.14 L1 9.27 L8.91 8.26 Z", konvaData: "M 0 -50 L 11.8 -15.5 L 47.6 -15.5 L 19.1 7.6 L 29.4 40.5 L 0 25 L -29.4 40.5 L -19.1 7.6 L -47.6 -15.5 L -11.8 -15.5 Z" },
  { id: "heart", name: "Heart", svgPath: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", konvaData: "M 0 25 C 0 0, -50 -25, -50 -25 Q -50 -50, -25 -50 C 0 -50, 0 -25, 0 -25 C 0 -25, 0 -50, 25 -50 Q 50 -50, 50 -25 C 50 -25, 0 0, 0 25 Z" },
  { id: "egg", name: "Egg", svgPath: "M12 2C9 2 6 5 6 10 C6 17 12 22 12 22 S18 17 18 10 C18 5 15 2 12 2Z", konvaData: "M 0 -50 C 27.5 -50, 50 -25, 50 0 C 50 50, -50 50, -50 0 C -50 -25, -27.5 -50, 0 -50 Z" },
  { id: "eggUpsideDown", name: "Egg (Up)", svgPath: "M12 22C15 22 18 19 18 14 C18 7 12 2 12 2 S6 7 6 14 C6 19 9 22 12 22Z", konvaData: "M 0 50 C 27.5 50, 50 25, 50 0 C 50 -50, -50 -50, -50 0 C -50 25, -27.5 50, 0 50 Z" },
  { id: "bean", name: "Bean", svgPath: "M18 8 C18 4 15 2 12 2 C9 2 6 4 6 8 C6 12 8 16 10 18 C12 20 15 22 18 22 C21 22 22 19 22 16 C22 12 20 8 18 8Z", konvaData: "M -27.5 -27.5 Q -50 0, -27.5 27.5 C -50 66.7, 50 66.7, 27.5 25 Q 66.7 0, 27.5 -25 C 50 -66.7, -50 -66.7, -27.5 -27.5 Z" },
  { id: "pear", name: "Pear", svgPath: "M12 2 C10 2 8 3 7 5 C5 8 4 12 4 15 C4 19 7 22 12 22 C17 22 20 19 20 15 C20 12 19 8 17 5 C16 3 14 2 12 2Z", konvaData: "M 0 -50 C 25 -50, 33.3 -25, 33.3 0 C 33.3 33.3, 25 50, 0 50 C -25 50, -33.3 33.3, -33.3 0 C -33.3 -25, -25 -50, 0 -50 Z" },
  { id: "apple", name: "Apple", svgPath: "M18 5 C18 2 15 1 12 3 C9 1 6 2 6 5 C3 6 2 10 2 14 C2 19 6 23 12 23 C18 23 22 19 22 14 C22 10 21 6 18 5Z M12 5 C13 4 14 4 15 5", konvaData: "M 0 -40 C 25 -50, 50 -33.3, 50 0 C 50 55, 25 50, 0 50 C -25 50, -50 55, -50 0 C -50 -33.3, -25 -50, 0 -40 M 0 -40 Q 0 -55.5, -10 -50 C -12.5 -66.7, 12.5 -66.7, 10 -50 Q 0 -55.5, 0 -40 Z" },
  { id: "blob1", name: "Blob 1", svgPath: "M10 2 C4 2 2 6 4 12 C6 18 10 22 16 22 C22 22 24 18 20 12 C16 6 14 2 10 2Z", konvaData: "M -50 0 C -50 -50, -25 -66.7, 0 -50 C 50 -41.7, 66.7 0, 50 50 C 33.3 66.7, -33.3 66.7, -50 0 Z" },
  { id: "blob2", name: "Blob 2", svgPath: "M14 2 C20 2 22 6 20 12 C18 18 14 22 8 22 C2 22 0 18 4 12 C8 6 10 2 14 2Z", konvaData: "M 50 0 C 50 -50, 25 -66.7, 0 -50 C -50 -41.7, -66.7 0, -50 50 C -33.3 66.7, 33.3 66.7, 50 0 Z" },
  { id: "roundTopFlatBottom", name: "Dome", svgPath: "M4 20 L20 20 L20 12 C20 6 16 2 12 2 C8 2 4 6 4 12 Z", konvaData: "M -50 50 L 50 50 L 50 0 C 50 -50, -50 -50, -50 0 Z" },
  { id: "flatTopRoundBottom", name: "Bowl", svgPath: "M4 4 L20 4 L20 12 C20 18 16 22 12 22 C8 22 4 18 4 12 Z", konvaData: "M -50 -50 L 50 -50 L 50 0 C 50 50, -50 50, -50 0 Z" },
  { id: "diamond", name: "Diamond", svgPath: "M12 1 L23 12 L12 23 L1 12 Z", konvaData: "M 0 -55.6 L 55.6 0 L 0 55.6 L -55.6 0 Z" },
];