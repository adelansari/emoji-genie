import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";
import SizeControlSimple from "./SizeControlSimple";
import RotationJoystick from "./RotationJoystick";
import ColorPicker from "./ColorPicker";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

export default function CustomizationMenu() {
  const { selectedHeadModel } = useEmojiCustomization();

  type EmojiPart = "Head" | "Left Eye" | "Right Eye" | "Mouth";
  const emojiParts: EmojiPart[] = ["Head", "Left Eye", "Right Eye", "Mouth"];

  type EditMode = "none" | "position" | "size" | "rotation" | "color";
  const editModes: EditMode[] = ["position", "size", "rotation", "color"];

  const [selectedPart, setSelectedPart] = useState<EmojiPart>("Head");
  const [mode, setMode] = useState<EditMode>("none");

  const renderEditControl = () => {
    switch (mode) {
      case "position": return <JoystickController />;
      case "size": return <SizeControlSimple />;
      case "rotation": return <RotationJoystick />;
      case "color":
        if (selectedPart === "Head") return <ColorPicker />;
        if (selectedPart === "Left Eye") return <ColorPicker />;
        if (selectedPart === "Right Eye") return <ColorPicker />;
        return <p className="text-center text-gray-400 pt-4">Color customization not available for Mouth yet.</p>;
      default: return null;
    }
  };

  const isColorDisabled = mode === 'color' && (selectedPart === 'Mouth' || (selectedPart === 'Head' && selectedHeadModel === 'default'));

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {emojiParts.map(part => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${selectedPart === part
                  ? "bg-yellow-500 text-gray-900 shadow-md"
                  : "bg-gray-700/60 hover:bg-gray-600/80"}`}
              >{part}</button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <ModelGallery selectedPart={selectedPart} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {editModes.map(editMode => {
          const isCurrent = mode === editMode;
          const isDisabled = editMode === 'color' && isColorDisabled;
          return (
            <button
              key={editMode}
              onClick={() => setMode(cur => cur === editMode ? 'none' : editMode)}
              disabled={isDisabled}
              className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize ${isCurrent && !isDisabled
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                : isDisabled
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700/60 hover:bg-gray-600/80"}`}
            >{editMode}</button>
          );
        })}
      </div>

      <div className="min-h-[200px]">
        {!isColorDisabled && renderEditControl()}
        {isColorDisabled && (
          <p className="text-center text-gray-400 pt-4">
            {selectedPart === 'Mouth'
              ? "Color customization not available for this part."
              : "Color customization is disabled for the default head shape."}
          </p>
        )}
      </div>
    </div>
  );
}