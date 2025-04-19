import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";

type CustomizationMenuProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: {
    x: number;
    y: number;
  };
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

  const renderEditControl = () => {
    switch (mode) {
      case "position":
        return <JoystickController setPosition={props.setPosition} position={props.position} />;
      case "size":
        return (
          <div className="p-4 bg-gray-700/50 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-2 text-yellow-300">Size</h3>
            <input
              type="range"
              min="50"
              max="200"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            <p className="text-center mt-2">{size}%</p>
          </div>
        );
      case "rotation":
        return (
          <div className="p-4 bg-gray-700/50 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-2 text-yellow-300">Rotation</h3>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            <p className="text-center mt-2">{rotation}°</p>
          </div>
        );
      case "color":
        return (
          <div className="p-4 bg-gray-700/50 rounded-lg mt-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-300">Color</h3>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10 p-1 bg-gray-600 border border-gray-500 rounded cursor-pointer"
            />
            <p className="text-center mt-2">{color}</p>
          </div>
        );
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
        <ModelGallery />
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
