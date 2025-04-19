import { headModels, HeadShapeType } from "./headModels";

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
    case "triangle":
      return <svg {...commonProps}><path d="M12 2 L2 22 L22 22 Z" /></svg>;
    case "oval":
      return <svg {...commonProps}><ellipse cx="12" cy="12" rx="8" ry="10" /></svg>;
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
