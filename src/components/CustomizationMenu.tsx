import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";
import SizeControlSimple from "./SizeControlSimple";
import RotationJoystick from "./RotationJoystick";
import ColorPicker from "./ColorPicker";
import { HeadShapeType } from "../data/headModels";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

type EmojiPart = "Head" | "Hat" | "Eyes" | "Mouth";
const emojiParts: EmojiPart[] = ["Head", "Hat", "Eyes", "Mouth"];

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

export default function CustomizationMenu() {
  const {
    setSelectedHeadModel,
  } = useEmojiCustomization();

  const [selectedPart, setSelectedPart] = useState<EmojiPart>("Head");
  const [mode, setMode] = useState<EditMode>("none");

  const handleSelectModel = (part: EmojiPart, modelId: HeadShapeType) => {
    if (part === "Head") {
      setSelectedHeadModel(modelId);
    }
  };

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

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {emojiParts.map((part) => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${selectedPart === part
                  ? "bg-yellow-500 text-gray-900 shadow-md"
                  : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
              >
                {part}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <ModelGallery
          selectedPart={selectedPart}
          onSelectModel={handleSelectModel}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => {
          const isColorButton = editMode === 'color';
          const isHeadSelected = selectedPart === 'Head';
          const isDisabled = isColorButton && isHeadSelected;

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
        {!(mode === 'color' && selectedPart === 'Head') && renderEditControl()}
        {mode === 'color' && selectedPart === 'Head' && (
          <p className="text-center text-gray-400 pt-4">Color customization is disabled for the base head shape.</p>
        )}
      </div>
    </div>
  );
}