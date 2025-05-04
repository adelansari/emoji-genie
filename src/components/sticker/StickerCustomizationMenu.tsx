import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { StickerPartType, StickerSubcategoryType, subcategories as stickerSubcategories } from '../../data/sticker/stickerModels';
import StickerModelGallery from "./StickerModelGallery";
import { useGame } from "../../context/GameContext";
import { CHARACTER_IMAGE_KEYS } from "../../context/GameContext";
import CustomizationMenuBase from "../shared/CustomizationMenuBase";

/**
 * Sticker-specific customization menu with tabs for Face, Eyes, Hair, Others
 */
export default function StickerCustomizationMenu() {
  const {
    selectedStickerPart,
    setSelectedStickerPart,
    selectedStickerSubcategory,
    setSelectedStickerSubcategory,
  } = useEmojiCustomization();

  const { setCharacterImageUrl } = useGame();

  // Define sticker-specific parts
  const stickerParts: StickerPartType[] = ["face", "eyes", "hair", "others"];

  // Get current subcategories for the selected part
  const currentSubcategories = stickerSubcategories[selectedStickerPart] || [];

  // Format part/subcategory name for display (capitalize)
  const formatName = (name: string) => {
    if (!name) return '';
    // Handle camelCase like 'eyeShape' -> 'Eye Shape'
    const spaced = name.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  // Create navigation tabs component for sticker parts
  const navigationTabs = (
    <nav className="bg-gray-900/50 rounded-md p-1">
      <ul className="flex justify-around gap-1">
        {stickerParts.map((part) => (
          <li key={part} className="flex-1">
            <button
              onClick={() => setSelectedStickerPart(part)}
              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
                selectedStickerPart === part
                  ? "bg-pink-500 text-gray-900 shadow-md"
                  : "bg-gray-700/60 hover:bg-gray-600/80"
              }`}
            >
              {formatName(part)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Create subcategory tabs component if there are subcategories
  const subcategoryTabs = currentSubcategories.length > 1 ? (
    <nav className="bg-gray-900/50 rounded-md p-1">
      <ul className="flex flex-wrap justify-center gap-1">
        {currentSubcategories.map((subcat) => (
          <li key={subcat} className="flex-grow sm:flex-grow-0">
            <button
              onClick={() => setSelectedStickerSubcategory(subcat)}
              className={`w-full py-1.5 px-2.5 rounded text-xs font-medium transition-colors duration-150 ${
                selectedStickerSubcategory === subcat
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-700/60 hover:bg-gray-600/80"
              }`}
            >
              {formatName(subcat)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;

  return (
    <CustomizationMenuBase
      title="Sticker Customization"
      selectedPart={selectedStickerPart}
      selectedSubcategory={selectedStickerSubcategory}
      canvasContainerId="sticker-canvas-container"
      storageKey={CHARACTER_IMAGE_KEYS.sticker}
      primaryColor="pink"
      accentColor="purple"
      navigationTabs={navigationTabs}
      subcategoryTabs={subcategoryTabs}
      galleryComponent={<StickerModelGallery />}
      onSetCharacterImageUrl={setCharacterImageUrl}
      downloadFilePrefix="sticker-genie"
    />
  );
}