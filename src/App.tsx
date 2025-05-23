import { useState } from 'react';
import TypeToggleSwitch from "./components/TypeToggleSwitch";
import { CustomizationMenuSwitcher, CanvasSwitcher } from "./components/ModeSwitcher";
import { EmojiCustomizationProvider } from "./context/EmojiCustomizationContext";
import GamePage from "./components/game/GamePage";
import { GameProvider } from "./context/GameContext";
import { CharacterCollectionProvider } from "./context/CharacterCollectionContext";
import { CharacterCollection } from "./components/CharacterCollection";

type AppTab = 'customize' | 'play' | 'collection';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('customize');

  return (
    <EmojiCustomizationProvider>
      <CharacterCollectionProvider>
        <GameProvider>
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-800">
            <h1 className="text-4xl font-bold mb-2 text-yellow-400 tracking-wider">
              Emoji Genie
            </h1>
            <div className="mb-6 flex flex-col items-center">
              {/* Tab Navigation */}
              <div className="mt-6 bg-gray-700 rounded-full p-1 flex">
                {(['customize', 'collection', 'play'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab
                        ? "bg-yellow-500 text-gray-900 shadow"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {tab === 'customize' ? 'Customize' : 
                     tab === 'collection' ? 'My Collection' : 'Play Game'}
                  </button>
                ))}
              </div>
              {/* Emoji/Sticker toggle - only show in customize tab */}
              {activeTab === 'customize' && <TypeToggleSwitch className="mt-2" />}
            </div>
            
            {/* Page Content */}
            {activeTab === 'customize' ? (
              <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-start gap-8">
                <div className="flex-shrink-0">
                  <CanvasSwitcher />
                </div>
                <div className="flex-shrink-0">
                  <CustomizationMenuSwitcher />
                </div>
              </div>
            ) : activeTab === 'collection' ? (
              <div className="w-full max-w-6xl">
                <CharacterCollection />
              </div>
            ) : (
              <GamePage />
            )}
          </div>
        </GameProvider>
      </CharacterCollectionProvider>
    </EmojiCustomizationProvider>
  );
}

export default App;