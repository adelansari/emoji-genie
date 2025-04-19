import { headModels, HeadShapeType } from "./headModels"; // Import head models data

type ModelGalleryProps = {
  selectedPart: "Head" | "Hat" | "Eyes" | "Mouth";
  onSelectModel: (part: "Head", modelId: HeadShapeType) => void; // Callback for selection
  currentHeadModel: HeadShapeType | null; // To highlight the selected model
};

export default function ModelGallery({ selectedPart, onSelectModel, currentHeadModel }: ModelGalleryProps) {

  const renderHeadModels = () => {
    return headModels.map((model) => (
      <button
        key={model.id}
        onClick={() => onSelectModel("Head", model.id)}
        className={`p-2 rounded border-2 transition-colors duration-150 ${currentHeadModel === model.id
          ? "border-yellow-400 bg-yellow-400/20"
          : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80"
          }`}
        title={model.name}
      >
        {/* Basic text representation for now, replace with actual previews later */}
        <span className="text-xs">{model.name}</span>
      </button>
    ));
  };

  const renderPlaceholders = (part: string) => (
    <p className="text-gray-400 text-sm text-center col-span-full">
      Models for {part} not yet available.
    </p>
  );

  return (
    <div className="grid grid-cols-4 gap-2 items-center justify-center">
      {selectedPart === "Head" && renderHeadModels()}
      {selectedPart === "Hat" && renderPlaceholders("Hat")}
      {selectedPart === "Eyes" && renderPlaceholders("Eyes")}
      {selectedPart === "Mouth" && renderPlaceholders("Mouth")}
    </div>
  );
}
