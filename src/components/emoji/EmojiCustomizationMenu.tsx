import { useState } from "react";
import JoystickController from "../shared/JoystickController";
import EmojiModelGallery from "./EmojiModelGallery";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { EmojiPartType } from "../../data/emoji/emojiModels";

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

/**
 * Emoji-specific customization menu with tabs for Head, Hat, Eyes, and Mouth
 */
export default function EmojiCustomizationMenu() {
  const {
    selectedEmojiPart, 
    setSelectedEmojiPart,
  } = useEmojiCustomization();

  const [mode, setMode] = useState<EditMode>("none");

  // Define emoji-specific parts
  const emojiParts: EmojiPartType[] = ["head", "hat", "eyes", "mouth"];
  
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

  // Check if color button should be disabled 
  // (Disable color for head in emoji mode)
  const isColorDisabled = (editMode: EditMode) => {
    return editMode === 'color' && selectedEmojiPart === 'head';
  };

  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
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

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <EmojiModelGallery />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => {
          const isDisabled = isColorDisabled(editMode);

          return (
            <button
              key={editMode}
              onClick={() => setMode(current => current === editMode ? "none" : editMode)}
              disabled={isDisabled}
              className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
                ${mode === editMode && !isDisabled
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                  : isDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                }`}
            >
              {editMode}
            </button>
          );
        })}
      </div>
      
      <div className="min-h-[200px]">
        {!(mode === 'color' && selectedEmojiPart === 'head') && renderEditControl()}
        {mode === 'color' && selectedEmojiPart === 'head' && (
          <p className="text-center text-gray-400 pt-4">Color customization is disabled for the base head shape.</p>
        )}
      </div>
    </div>
  );
}