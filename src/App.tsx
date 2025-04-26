import { useState, useCallback } from "react";
import EmojiCanvas from "./components/EmojiCanvas";
import CustomizationMenu from "./components/CustomizationMenu";
import { HeadShapeType } from "./data/headModels";

function App() {
  const [position, _setPosition] = useState({
    x: 300,
    y: 300,
  });
  const [rotation, _setRotation] = useState(0);
  const [size, _setSize] = useState({
    x: 200,
    y: 200,
  });
  const [selectedHeadModel, _setSelectedHeadModel] = useState<HeadShapeType>("default");
  const [color, _setColor] = useState("#FFFFFF");

  const setPosition = useCallback((newPosition: { x: number; y: number }) => {
    _setPosition(newPosition);
  }, []);

  const setRotation = useCallback((newRotation: number) => {
    _setRotation(newRotation);
  }, []);

  const setSize = useCallback((newSize: { x: number; y: number }) => {
    _setSize(newSize);
  }, []);

  const setSelectedHeadModel = useCallback((newModel: HeadShapeType) => {
    _setSelectedHeadModel(newModel);
  }, []);

  const setColor = useCallback((newColor: string) => {
    _setColor(newColor);
  }, []);

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
            color={color}
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
            color={color}
            setColor={setColor}
          />
        </div>
      </div>
    </div>
  );
}

export default App;