import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { EmojiPartType } from '../../data/emoji/emojiModels';
import EmojiModelGallery from "./EmojiModelGallery";
import { useGame } from "../../context/GameContext";
import { CHARACTER_IMAGE_KEYS } from "../../context/GameContext";
import CustomizationMenuBase, { EditMode } from "../shared/CustomizationMenuBase";

export default function EmojiCustomizationMenu() {
  const {
    selectedEmojiPart,
    setSelectedEmojiPart,
  } = useEmojiCustomization();

  const { setCharacterImageUrl } = useGame();

  // Define emoji-specific parts
  const emojiParts: EmojiPartType[] = ["head", "hat", "eyes", "mouth"];
  
  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  // Check if color button should be disabled for a part
  const isColorDisabled = (mode: EditMode) => {
    return mode === 'color' && selectedEmojiPart === 'head';
  };

  // Create navigation tabs component for emoji parts
  const navigationTabs = (
    <nav className="bg-gray-900/50 rounded-md p-1">
      <ul className="flex justify-around gap-1">
        {emojiParts.map((part) => (
          <li key={part} className="flex-1">
            <button
              onClick={() => setSelectedEmojiPart(part)}
              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
                selectedEmojiPart === part
                  ? "bg-yellow-500 text-gray-900 shadow-md"
                  : "bg-gray-700/60 hover:bg-gray-600/80"
              }`}
            >
              {formatPartName(part)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <CustomizationMenuBase
      title="Emoji Customization"
      selectedPart={selectedEmojiPart}
      canvasContainerId="emoji-canvas-container"
      storageKey={CHARACTER_IMAGE_KEYS.emoji}
      primaryColor="yellow"
      accentColor="yellow"
      navigationTabs={navigationTabs}
      galleryComponent={<EmojiModelGallery />}
      onSetCharacterImageUrl={setCharacterImageUrl}
      isColorDisabled={isColorDisabled}
      downloadFilePrefix="emoji-genie"
    />
  );
}