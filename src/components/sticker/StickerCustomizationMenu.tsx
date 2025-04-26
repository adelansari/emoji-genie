import { useState } from "react";
import JoystickController from "../shared/JoystickController";
import StickerModelGallery from "./StickerModelGallery";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { StickerPartType } from "../../data/sticker/stickerModels";

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

/**
 * Sticker-specific customization menu with tabs for Face, Eyes, Hair, and Others
 */
export default function StickerCustomizationMenu() {
  const {
    selectedStickerPart, 
    setSelectedStickerPart,
  } = useEmojiCustomization();

  const [mode, setMode] = useState<EditMode>("none");

  // Define sticker-specific parts
  const stickerParts: StickerPartType[] = ["face", "eyes", "hair", "others"];
  
  const renderEditControl = () => {
    switch (mode) {
      case "position":
        return <JoystickController />;
      case "size":
        return <SizeControlSimple />;
      case "rotation":
        return <RotationJoystick />;
      case "color":
        return <ColorPicker />;
      case "none":
      default:
        return null;
    }
  };

  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {stickerParts.map((part) => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedStickerPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
                  selectedStickerPart === part
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

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <StickerModelGallery />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => (
          <button
            key={editMode}
            onClick={() => setMode(current => current === editMode ? "none" : editMode)}
            className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
              ${mode === editMode
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                : "bg-gray-700/60 hover:bg-gray-600/80"
              }`}
          >
            {editMode}
          </button>
        ))}
      </div>
      
      <div className="min-h-[200px]">
        {renderEditControl()}
        
        {/* Sticker-specific instructions could go here */}
        {mode === "none" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm text-center">
              Select a customization option above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}