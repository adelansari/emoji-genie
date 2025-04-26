import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { emojiModels } from "../../data/emoji/emojiModels";

/**
 * Gallery component specifically for displaying emoji models
 */
export default function EmojiModelGallery() {
  const {
    selectedEmojiPart,
    selectedEmojiModels,
    setSelectedEmojiModel
  } = useEmojiCustomization();

  const models = emojiModels[selectedEmojiPart];
  
  if (models.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center col-span-5 py-4">
        Models for {selectedEmojiPart} not yet available.
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {models.map((model) => {
        const isSelected = selectedEmojiModels[selectedEmojiPart] === model.id;
        const fillColor = model.id === 'default'
          ? undefined
          : isSelected ? '#FACC15' : '#D1D5DB';

        return (
          <button
            key={model.id}
            onClick={() => setSelectedEmojiModel(selectedEmojiPart, model.id)}
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
              fill={fillColor}
            />
          </button>
        );
      })}
    </div>
  );
}