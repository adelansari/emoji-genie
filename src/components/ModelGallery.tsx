import { headModels, HeadShapeType, HeadModel } from "../data/headModels";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

type ModelGalleryProps = {
  selectedPart: "Head" | "Hat" | "Eyes" | "Mouth";
  onSelectModel: (part: "Head", modelId: HeadShapeType) => void;
};

export default function ModelGallery({ selectedPart, onSelectModel }: ModelGalleryProps) {
  const { selectedHeadModel } = useEmojiCustomization();

  const renderHeadModels = () => {
    return headModels.map((model: HeadModel) => {
      if (!model.SvgComponent) return null;

      const fillColor = model.id === 'default'
        ? undefined
        : selectedHeadModel === model.id ? '#FACC15' : '#D1D5DB';

      return (
        <button
          key={model.id}
          onClick={() => onSelectModel("Head", model.id)}
          className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${selectedHeadModel === model.id
            ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
            : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
          title={model.name}
        >
          <model.SvgComponent
            width="32"
            height="32"
            fill={fillColor}
          />
        </button>
      );
    });
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