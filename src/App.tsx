import { useState } from "react";
import EmojiCanvas from "./components/EmojiCanvas";
import CustomizationMenu from "./components/CustomizationMenu";
import { HeadShapeType } from "./components/headModels"; // Import HeadShapeType

function App() {
  const [position, setPosition] = useState({
    x: 300,
    y: 300,
  });
  const [selectedHeadModel, setSelectedHeadModel] = useState<HeadShapeType>("square"); // Default to square

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 tracking-wider">
        Emoji Genie
      </h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-shrink-0">
          <EmojiCanvas
            position={position}
            headShape={selectedHeadModel} // Pass selected head shape
          />
        </div>
        <div className="flex-shrink-0">
          <CustomizationMenu
            setPosition={setPosition}
            position={position}
            selectedHeadModel={selectedHeadModel}
            onSelectHeadModel={setSelectedHeadModel}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
