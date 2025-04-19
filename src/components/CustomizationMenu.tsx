import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";
import SizeSlider from "./SizeSlider";
import RotationSlider from "./RotationSlider";
import ColorPicker from "./ColorPicker";
import { HeadShapeType } from "../data/headModels"; // Updated import path

type CustomizationMenuProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: { x: number; y: number };
  selectedHeadModel: HeadShapeType;
  onSelectHeadModel: (modelId: HeadShapeType) => void;
};

type EmojiPart = "Head" | "Hat" | "Eyes" | "Mouth";
const emojiParts: EmojiPart[] = ["Head", "Hat", "Eyes", "Mouth"];

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

export default function CustomizationMenu(props: CustomizationMenuProps) {
  const [selectedPart, setSelectedPart] = useState<EmojiPart>("Head");
  const [mode, setMode] = useState<EditMode>("none");

  const [size, setSize] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("#FFA500");

  const handleSelectModel = (part: EmojiPart, modelId: HeadShapeType) => {
    if (part === "Head") {
      props.onSelectHeadModel(modelId);
    }
  };

  const renderEditControl = () => {
    switch (mode) {
      case "position":
        return <JoystickController setPosition={props.setPosition} position={props.position} />;
      case "size":
        return <SizeSlider value={size} onChange={setSize} />;
      case "rotation":
        return <RotationSlider value={rotation} onChange={setRotation} />;
      case "color":
        return <ColorPicker value={color} onChange={setColor} />;
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
          currentHeadModel={props.selectedHeadModel}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => (
          <button
            key={editMode}
            onClick={() => setMode(current => current === editMode ? "none" : editMode)}
            className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize ${mode === editMode
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
      </div>
    </div>
  );
}