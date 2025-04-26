import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { stickerModels } from "../../data/sticker/stickerModels";

/**
 * Gallery component specifically for displaying sticker models
 * Shows models relevant to the selected part and subcategory
 */
export default function StickerModelGallery() {
  const {
    selectedStickerPart,
    selectedStickerSubcategory,
    selectedStickerModels,
    setSelectedStickerModel
  } = useEmojiCustomization();

  // Get models for the current part and subcategory
  const currentModels = stickerModels[selectedStickerPart][selectedStickerSubcategory];
  
  // Check if the current subcategory has any models
  if (currentModels.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4">
        No models available for this option.
      </p>
    );
  }
  
  // Get the currently selected model ID for this part and subcategory
  const selectedModelId = selectedStickerModels[selectedStickerPart][selectedStickerSubcategory];
  
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {currentModels.map((model) => {
        const isSelected = selectedModelId === model.id;
        
        return (
          <button
            key={model.id}
            onClick={() => setSelectedStickerModel(selectedStickerPart, selectedStickerSubcategory, model.id)}
            className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
            title={model.name}
          >
            <div className="flex items-center justify-center w-full h-full">
              <model.SvgComponent
                width="48"
                height="48"
                className="w-full h-full max-w-full max-h-full"
                fill={isSelected ? '#FACC15' : '#D1D5DB'}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}