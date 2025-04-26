import EmojiCanvas from "./components/EmojiCanvas";
import CustomizationMenu from "./components/CustomizationMenu";
import { EmojiCustomizationProvider } from "./context/EmojiCustomizationContext";

function App() {
  return (
    <EmojiCustomizationProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-800">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400 tracking-wider">
          Emoji Genie
        </h1>
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
          <div className="flex-shrink-0">
            <EmojiCanvas />
          </div>
          <div className="flex-shrink-0">
            <CustomizationMenu />
          </div>
        </div>
      </div>
    </EmojiCustomizationProvider>
  );
}

export default App;