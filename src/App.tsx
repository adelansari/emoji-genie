import { useState } from "react";
import EmojiCanvas from "./components/EmojiCanvas";
import CustomizationMenu from "./components/CustomizationMenu";
import { HeadShapeType } from "./data/headModels";
import { EyeShapeType } from "./data/eyeModels";

function App() {
  const [position, setPosition] = useState({
    x: 300,
    y: 300,
  });
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState({
    x: 200,
    y: 200,
  });
  const [selectedHeadModel, setSelectedHeadModel] = useState<HeadShapeType>("default");
  const [selectedLeftEyeModel, setSelectedLeftEyeModel] = useState<EyeShapeType>("eye1");
  const [selectedRightEyeModel, setSelectedRightEyeModel] = useState<EyeShapeType>("eye1");
  const [headColor, setHeadColor] = useState("#facc15");
  const [leftEyeColor, setLeftEyeColor] = useState("#FFFFFF");
  const [rightEyeColor, setRightEyeColor] = useState("#FFFFFF");


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 tracking-wider">
        Emoji Genie
      </h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-shrink-0">
          <EmojiCanvas
            position={position}
            rotation={rotation}
            size={size}
            headShape={selectedHeadModel}
            leftEyeShape={selectedLeftEyeModel}
            rightEyeShape={selectedRightEyeModel}
            headColor={headColor}
            leftEyeColor={leftEyeColor}
            rightEyeColor={rightEyeColor}
          />
        </div>
        <div className="flex-shrink-0">
          <CustomizationMenu
            position={position}
            setPosition={setPosition}
            rotation={rotation}
            setRotation={setRotation}
            size={size}
            setSize={setSize}
            selectedHeadModel={selectedHeadModel}
            onSelectHeadModel={setSelectedHeadModel}
            selectedLeftEyeModel={selectedLeftEyeModel}
            onSelectLeftEyeModel={setSelectedLeftEyeModel}
            selectedRightEyeModel={selectedRightEyeModel}
            onSelectRightEyeModel={setSelectedRightEyeModel}
            headColor={headColor}
            setHeadColor={setHeadColor}
            leftEyeColor={leftEyeColor}
            setLeftEyeColor={setLeftEyeColor}
            rightEyeColor={rightEyeColor}
            setRightEyeColor={setRightEyeColor}
          />
        </div>
      </div>
    </div>
  );
}

export default App;