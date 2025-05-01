import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { stickerModels } from "../../data/sticker/stickerModels";
import ModelGalleryBase from "../shared/ModelGalleryBase";

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
  const currentModels = selectedStickerPart
    ? stickerModels[selectedStickerPart][selectedStickerSubcategory]
    : null;
  
  // Get the currently selected model ID for this part and subcategory
  const selectedModelId = selectedStickerPart
    ? selectedStickerModels[selectedStickerPart]?.[selectedStickerSubcategory]
    : null;
  
  return (
    <ModelGalleryBase
      models={currentModels}
      selectedModelId={selectedModelId}
      onSelectModel={(modelId) => setSelectedStickerModel(selectedStickerPart, selectedStickerSubcategory, modelId)}
      emptyStateMessage={`No models available for this option.`}
      partType={selectedStickerPart}
      subcategory={selectedStickerSubcategory}
    />
  );
}