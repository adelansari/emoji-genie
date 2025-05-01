import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { emojiModels } from "../../data/emoji/emojiModels";
import ModelGalleryBase from "../shared/ModelGalleryBase";

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
  
  return (
    <ModelGalleryBase
      models={models}
      selectedModelId={selectedEmojiModels[selectedEmojiPart]}
      onSelectModel={(modelId) => setSelectedEmojiModel(selectedEmojiPart, modelId)}
      emptyStateMessage={`Models for ${selectedEmojiPart} not yet available.`}
    />
  );
}