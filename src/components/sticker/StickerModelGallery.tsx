import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { stickerModels } from "../../data/sticker/stickerModels";

/**
 * Gallery component specifically for displaying sticker models
 * Shows models relevant to the selected part (face, eyes, hair, others)
 */
export default function StickerModelGallery() {
  const {
    selectedStickerPart,
    selectedStickerModels,
    setSelectedStickerModel
  } = useEmojiCustomization();

  const models = stickerModels[selectedStickerPart];
  
  if (models.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center col-span-5 py-4">
        Models for {selectedStickerPart} not yet available.
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {models.map((model) => {
        const isSelected = selectedStickerModels[selectedStickerPart] === model.id;
        
        return (
          <button
            key={model.id}
            onClick={() => setSelectedStickerModel(selectedStickerPart, model.id)}
            className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
            title={model.name}
          >
            <model.SvgComponent
              width="32"
              height="32"
              fill={isSelected ? '#FACC15' : '#D1D5DB'}
            />
          </button>
        );
      })}
    </div>
  );
}