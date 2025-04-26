import { useState } from "react";
import JoystickController from "./JoystickController";
import ModelGallery from "./ModelGallery";
import SizeControlSimple from "./SizeControlSimple";
import RotationJoystick from "./RotationJoystick";
import ColorPicker from "./ColorPicker";
import { useEmojiCustomization } from "../context/EmojiCustomizationContext";

export default function CustomizationMenu() {
  const {
    positionHead, setPositionHead,
    rotationHead, setRotationHead,
    sizeHead, setSizeHead,
    positionLeftEye, setPositionLeftEye,
    rotationLeftEye, setRotationLeftEye,
    sizeLeftEye, setSizeLeftEye,
    positionRightEye, setPositionRightEye,
    rotationRightEye, setRotationRightEye,
    sizeRightEye, setSizeRightEye,
    positionMouth, setPositionMouth,
    rotationMouth, setRotationMouth,
    sizeMouth, setSizeMouth,
    color, setColor,
    leftEyeColor, setLeftEyeColor,
    rightEyeColor, setRightEyeColor,
    mouthColor, setMouthColor,
  } = useEmojiCustomization();

  type EmojiPart = "Head" | "Left Eye" | "Right Eye" | "Mouth";
  const emojiParts: EmojiPart[] = ["Head", "Left Eye", "Right Eye", "Mouth"];

  type EditMode = "none" | "position" | "size" | "rotation" | "color";
  const editModes: EditMode[] = ["position", "size", "rotation", "color"];

  const [selectedPart, setSelectedPart] = useState<EmojiPart>("Head");
  const [mode, setMode] = useState<EditMode>("none");

  const renderEditControl = () => {
    switch (mode) {
      case "position":
        if (selectedPart === "Head") return <JoystickController position={positionHead} setPosition={setPositionHead} />;
        if (selectedPart === "Left Eye") return <JoystickController position={positionLeftEye} setPosition={setPositionLeftEye} />;
        if (selectedPart === "Right Eye") return <JoystickController position={positionRightEye} setPosition={setPositionRightEye} />;
        return <JoystickController position={positionMouth} setPosition={setPositionMouth} />;
      case "size":
        if (selectedPart === "Head") return <SizeControlSimple size={sizeHead} setSize={setSizeHead} />;
        if (selectedPart === "Left Eye") return <SizeControlSimple size={sizeLeftEye} setSize={setSizeLeftEye} />;
        if (selectedPart === "Right Eye") return <SizeControlSimple size={sizeRightEye} setSize={setSizeRightEye} />;
        return <SizeControlSimple size={sizeMouth} setSize={setSizeMouth} />;
      case "rotation":
        if (selectedPart === "Head") return <RotationJoystick rotation={rotationHead} setRotation={setRotationHead} />;
        if (selectedPart === "Left Eye") return <RotationJoystick rotation={rotationLeftEye} setRotation={setRotationLeftEye} />;
        if (selectedPart === "Right Eye") return <RotationJoystick rotation={rotationRightEye} setRotation={setRotationRightEye} />;
        return <RotationJoystick rotation={rotationMouth} setRotation={setRotationMouth} />;
      case "color":
        if (selectedPart === "Head") return <ColorPicker color={color} setColor={setColor} />;
        if (selectedPart === "Left Eye") return <ColorPicker color={leftEyeColor} setColor={setLeftEyeColor} />;
        if (selectedPart === "Right Eye") return <ColorPicker color={rightEyeColor} setColor={setRightEyeColor} />;
        if (selectedPart === "Mouth") return <p className="text-center text-gray-400 pt-4">Color customization not available for this part.</p>;
        return null;
      default: return null;
    }
  };

  // Disable color mode button for Mouth only
  const isColorDisabled = selectedPart === 'Mouth';

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
          const isDisabled = editMode === 'color' && selectedPart === 'Mouth';
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
        {renderEditControl()}
      </div>
    </div>
  );
}