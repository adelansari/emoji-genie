import { useState } from "react";
import EmojiCanvas from "./components/EmojiCanvas"
import CustomizationMenu from "./components/CustomizationMenu";

function App() {
  const [position, setPosition] = useState({
    x: 300,
    y: 300,
  });
  const [rotation, setRotation] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 tracking-wider">
        Emoji Genie
      </h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
        <CustomizationMenu
          setPosition={setPosition}
          position={position}
          setRotation={setRotation}
          rotation={rotation}
        />
        <div className="flex-shrink-0">
          <EmojiCanvas position={position} rotation={rotation} />
        </div>
      </div>
    </div>
  )
}

export default App
