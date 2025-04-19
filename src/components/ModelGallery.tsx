import { headModels, HeadShapeType } from "../data/headModels"; // Updated import path

type ModelGalleryProps = {
  selectedPart: "Head" | "Hat" | "Eyes" | "Mouth";
  onSelectModel: (part: "Head", modelId: HeadShapeType) => void;
  currentHeadModel: HeadShapeType | null;
};

const ShapePreview = ({ shape }: { shape: HeadShapeType }) => {
  const commonProps = {
    fill: "currentColor",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
  };

  switch (shape) {
    case "circle":
      return <svg {...commonProps}><circle cx="12" cy="12" r="10" /></svg>;
    case "square":
      return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
    case "rectangle":
      return <svg {...commonProps}><rect x="2" y="6" width="20" height="12" rx="2" /></svg>;
    case "triangle": // Equilateral
      return <svg {...commonProps}><path d="M12 2 L2 22 L22 22 Z" /></svg>;
    case "oval":
      return <svg {...commonProps}><ellipse cx="12" cy="12" rx="8" ry="10" /></svg>;
    case "roundedSquare":
      return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="5" /></svg>; // Increased rx
    case "tallRectangle":
      return <svg {...commonProps}><rect x="6" y="2" width="12" height="20" rx="2" /></svg>;
    case "wideRectangle":
      return <svg {...commonProps}><rect x="1" y="8" width="22" height="8" rx="2" /></svg>;
    case "roundedRectangle":
      return <svg {...commonProps}><rect x="2" y="6" width="20" height="12" rx="6" /></svg>; // Increased rx
    case "isoTriangleUp":
      return <svg {...commonProps}><path d="M12 3 L4 21 L20 21 Z" /></svg>; // Isosceles
    case "isoTriangleDown":
      return <svg {...commonProps}><path d="M12 21 L4 3 L20 3 Z" /></svg>;
    case "rightTriangleLeft":
      return <svg {...commonProps}><path d="M21 3 L21 21 L3 21 Z" /></svg>;
    case "rightTriangleRight":
      return <svg {...commonProps}><path d="M3 3 L3 21 L21 21 Z" /></svg>;
    case "tallOval":
      return <svg {...commonProps}><ellipse cx="12" cy="12" rx="6" ry="10" /></svg>;
    case "wideOval":
      return <svg {...commonProps}><ellipse cx="12" cy="12" rx="10" ry="6" /></svg>;
    case "pentagon":
      return <svg {...commonProps}><path d="M12 2 L22 8 L18 22 L6 22 L2 8 Z" /></svg>;
    case "hexagon":
      return <svg {...commonProps}><path d="M18 3 L6 3 L0 12 L6 21 L18 21 L24 12 Z" /></svg>;
    case "octagon":
      return <svg {...commonProps}><path d="M8 2 L16 2 L22 8 L22 16 L16 22 L8 22 L2 16 L2 8 Z" /></svg>;
    case "star":
      return <svg {...commonProps}><path d="M12 1 L15.09 8.26 L23 9.27 L17 14.14 L18.18 22 L12 18.31 L5.82 22 L7 14.14 L1 9.27 L8.91 8.26 Z" /></svg>;
    case "heart":
      return <svg {...commonProps}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
    case "egg":
      return <svg {...commonProps}><path d="M12 2C9 2 6 5 6 10 C6 17 12 22 12 22 S18 17 18 10 C18 5 15 2 12 2Z" /></svg>;
    case "eggUpsideDown":
      return <svg {...commonProps}><path d="M12 22C15 22 18 19 18 14 C18 7 12 2 12 2 S6 7 6 14 C6 19 9 22 12 22Z" /></svg>;
    case "bean":
      return <svg {...commonProps}><path d="M18 8 C18 4 15 2 12 2 C9 2 6 4 6 8 C6 12 8 16 10 18 C12 20 15 22 18 22 C21 22 22 19 22 16 C22 12 20 8 18 8Z" /></svg>;
    case "pear":
      return <svg {...commonProps}><path d="M12 2 C10 2 8 3 7 5 C5 8 4 12 4 15 C4 19 7 22 12 22 C17 22 20 19 20 15 C20 12 19 8 17 5 C16 3 14 2 12 2Z" /></svg>;
    case "apple":
      return <svg {...commonProps}><path d="M18 5 C18 2 15 1 12 3 C9 1 6 2 6 5 C3 6 2 10 2 14 C2 19 6 23 12 23 C18 23 22 19 22 14 C22 10 21 6 18 5Z M12 5 C13 4 14 4 15 5" /></svg>;
    case "blob1":
      return <svg {...commonProps}><path d="M10 2 C4 2 2 6 4 12 C6 18 10 22 16 22 C22 22 24 18 20 12 C16 6 14 2 10 2Z" /></svg>;
    case "blob2":
      return <svg {...commonProps}><path d="M14 2 C20 2 22 6 20 12 C18 18 14 22 8 22 C2 22 0 18 4 12 C8 6 10 2 14 2Z" /></svg>;
    case "roundTopFlatBottom":
      return <svg {...commonProps}><path d="M4 20 L20 20 L20 12 C20 6 16 2 12 2 C8 2 4 6 4 12 Z" /></svg>;
    case "flatTopRoundBottom":
      return <svg {...commonProps}><path d="M4 4 L20 4 L20 12 C20 18 16 22 12 22 C8 22 4 18 4 12 Z" /></svg>;
    case "diamond":
      return <svg {...commonProps}><path d="M12 1 L23 12 L12 23 L1 12 Z" /></svg>;
    default:
      return null;
  }
};


export default function ModelGallery({ selectedPart, onSelectModel, currentHeadModel }: ModelGalleryProps) {

  const renderHeadModels = () => {
    return headModels.map((model) => (
      <button
        key={model.id}
        onClick={() => onSelectModel("Head", model.id)}
        className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${currentHeadModel === model.id
          ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
          : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
          }`}
        title={model.name}
      >
        <ShapePreview shape={model.id} />
      </button>
    ));
  };

  const renderPlaceholders = (part: string) => (
    <p className="text-gray-400 text-sm text-center col-span-5 py-4">
      Models for {part} not yet available.
    </p>
  );

  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {selectedPart === "Head" && renderHeadModels()}
      {selectedPart === "Hat" && renderPlaceholders("Hat")}
      {selectedPart === "Eyes" && renderPlaceholders("Eyes")}
      {selectedPart === "Mouth" && renderPlaceholders("Mouth")}
    </div>
  );
}