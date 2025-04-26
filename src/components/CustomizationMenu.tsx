import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";
import SizeControlSimple from "./SizeControlSimple";
import RotationJoystick from "./RotationJoystick";
import ColorPicker from "./ColorPicker";
import { HeadShapeType } from "../data/headModels";
import { EyeShapeType } from "../data/eyeModels";
import { MouthShapeType } from "../data/mouthModels";

type CustomizationMenuProps = {
  setPosition: (position: { x: number; y: number }) => void;
  position: { x: number; y: number };
  setRotation: (rotation: number) => void;
  rotation: number;
  setSize: (size: { x: number; y: number }) => void;
  size: { x: number; y: number };
  selectedHeadModel: HeadShapeType;
  onSelectHeadModel: (modelId: HeadShapeType) => void;
  selectedLeftEyeModel: EyeShapeType;
  onSelectLeftEyeModel: (modelId: EyeShapeType) => void;
  selectedRightEyeModel: EyeShapeType;
  onSelectRightEyeModel: (modelId: EyeShapeType) => void;
  selectedMouthModel: MouthShapeType;
  onSelectMouthModel: (modelId: MouthShapeType) => void;
  headColor: string;
  setHeadColor: (color: string) => void;
  leftEyeColor: string;
  setLeftEyeColor: (color: string) => void;
  rightEyeColor: string;
  setRightEyeColor: (color: string) => void;
  mouthColor: string;
  setMouthColor: (color: string) => void;
};


type EmojiPart = "Head" | "Left Eye" | "Right Eye" | "Mouth";
const emojiParts: EmojiPart[] = ["Head", "Left Eye", "Right Eye", "Mouth"];

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

export default function CustomizationMenu(props: CustomizationMenuProps) {
  const [selectedPart, setSelectedPart] = useState<EmojiPart>("Head");
  const [mode, setMode] = useState<EditMode>("none");

  const handleSelectModel = (part: EmojiPart, modelId: string) => {
    if (part === "Head") {
      props.onSelectHeadModel(modelId as HeadShapeType);
    } else if (part === "Left Eye") {
      props.onSelectLeftEyeModel(modelId as EyeShapeType);
    } else if (part === "Right Eye") {
      props.onSelectRightEyeModel(modelId as EyeShapeType);
    } else if (part === "Mouth") {
      props.onSelectMouthModel(modelId as MouthShapeType);
    }
  };

  const renderEditControl = () => {
    switch (mode) {
      case "position":
        return <JoystickController setPosition={props.setPosition} position={props.position} />;
      case "size":
        return <SizeControlSimple sizeX={props.size.x} sizeY={props.size.y} onChange={props.setSize} />;
      case "rotation":
        return <RotationJoystick value={props.rotation} onChange={props.setRotation} />;
      case "color":
        switch (selectedPart) {
          case "Head":
            return <ColorPicker value={props.headColor} onChange={props.setHeadColor} />;
          case "Left Eye":
            return <ColorPicker value={props.leftEyeColor} onChange={props.setLeftEyeColor} />;
          case "Right Eye":
            return <ColorPicker value={props.rightEyeColor} onChange={props.setRightEyeColor} />;
          case "Mouth":
            return <ColorPicker value={props.mouthColor} onChange={props.setMouthColor} />;
          default:
            return <p className="text-center text-gray-400 pt-4">Color customization not available for this part.</p>;
        }
      case "none":
      default:
        return null;
    }
  };

  const isColorModeDisabled = () => {
    if (mode !== 'color') return false;
    if (selectedPart === 'Head' && props.selectedHeadModel === 'default') return true;
    return false;
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
          currentLeftEyeModel={props.selectedLeftEyeModel}
          currentRightEyeModel={props.selectedRightEyeModel}
          currentMouthModel={props.selectedMouthModel}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => {
          const isCurrentMode = mode === editMode;
          let isDisabled = false;
          const buttonText = editMode;

          if (editMode === 'color') {
            if (selectedPart === 'Head' && props.selectedHeadModel === 'default') {
              isDisabled = true;
            }
          }

          return (
            <button
              key={editMode}
              onClick={() => setMode(current => current === editMode ? "none" : editMode)}
              disabled={isDisabled}
              className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
                ${isCurrentMode && !isDisabled
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                  : isDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                }`}
            >
              {buttonText}
            </button>
          );
        })}
      </div>
      <div className="min-h-[200px]">
        {!isColorModeDisabled() && renderEditControl()}
        {isColorModeDisabled() && (
          <p className="text-center text-gray-400 pt-4">
            {selectedPart === 'Head' ? "Color customization is disabled for the default head shape." : "Color customization not available for this part."}
          </p>
        )}
      </div>
    </div>
  );
}