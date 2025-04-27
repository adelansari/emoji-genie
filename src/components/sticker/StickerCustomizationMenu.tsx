import { useState } from "react";
import JoystickController from "../shared/JoystickController";
import StickerModelGallery from "./StickerModelGallery";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { StickerPartType, subcategories, subcategoryNames } from "../../data/sticker/stickerModels";
import { useGame } from "../../context/GameContext";
import { exportElementAsImage, saveImageToLocalStorage, downloadImage } from "../../utils/exportUtils";
import { Save, ExternalLink, Download } from "lucide-react";

// Constants
const CHARACTER_IMAGE_KEY = 'flappyEmojiCharacter';

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

/**
 * Sticker-specific customization menu with tabs for Face, Eyes, Hair, and Others
 */
export default function StickerCustomizationMenu() {
  const {
    selectedStickerPart, 
    setSelectedStickerPart,
    selectedStickerSubcategory,
    setSelectedStickerSubcategory
  } = useEmojiCustomization();

  const { setCharacterImageUrl } = useGame();

  const [mode, setMode] = useState<EditMode>("none");
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  // Define sticker-specific parts
  const stickerParts: StickerPartType[] = ["face", "eyes", "hair", "others"];
  
  const renderEditControl = () => {
    switch (mode) {
      case "position":
        return <JoystickController />;
      case "size":
        return <SizeControlSimple />;
      case "rotation":
        return <RotationJoystick />;
      case "color":
        return <ColorPicker />;
      case "none":
      default:
        return null;
    }
  };

  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  // Get available subcategories for the current selected part
  const availableSubcategories = subcategories[selectedStickerPart];

  // Handle export to game
  const handleExportToGame = async () => {
    try {
      setExportStatus('exporting');
      
      // Export the canvas element
      const imageDataUrl = await exportElementAsImage('sticker-canvas-container');
      
      // Save to localStorage
      saveImageToLocalStorage(imageDataUrl, CHARACTER_IMAGE_KEY);
      
      // Update game context
      setCharacterImageUrl(imageDataUrl);
      
      setExportStatus('success');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to export sticker:', error);
      setExportStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    }
  };

  // Handle downloading the sticker image
  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      
      // Export the canvas element
      const imageDataUrl = await exportElementAsImage('sticker-canvas-container');
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `sticker-genie-${date}.png`;
      
      // Download the image
      downloadImage(imageDataUrl, filename);
      
      setDownloadStatus('success');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to download sticker:', error);
      setDownloadStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      {/* Main category tabs */}
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {stickerParts.map((part) => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedStickerPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
                  selectedStickerPart === part
                    ? "bg-yellow-500 text-gray-900 shadow-md"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                }`}
              >
                {formatPartName(part)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subcategory selection */}
      {availableSubcategories.length > 1 && (
        <nav className="bg-gray-900/30 rounded-md p-1">
          <ul className="flex justify-around gap-1">
            {availableSubcategories.map((subcategory) => (
              <li key={subcategory} className="flex-1">
                <button
                  onClick={() => setSelectedStickerSubcategory(subcategory)}
                  className={`w-full py-1.5 px-2 rounded text-xs font-medium transition-colors duration-150 ${
                    selectedStickerSubcategory === subcategory
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-700/40 hover:bg-gray-600/60 text-gray-300"
                  }`}
                >
                  {subcategoryNames[subcategory]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <StickerModelGallery />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => (
          <button
            key={editMode}
            onClick={() => setMode(current => current === editMode ? "none" : editMode)}
            className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
              ${mode === editMode
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
        
        {/* Sticker-specific instructions could go here */}
        {mode === "none" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm text-center">
              Select a customization option above
            </p>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        {/* Export to Game button */}
        <button
          onClick={handleExportToGame}
          disabled={exportStatus === 'exporting'}
          className={`py-3 px-4 rounded text-sm font-medium flex items-center justify-center gap-2
            ${exportStatus === 'exporting'
              ? "bg-gray-600 cursor-not-allowed"
              : exportStatus === 'success'
                ? "bg-green-600 hover:bg-green-700"
                : exportStatus === 'error'
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:text-gray-900"
            }`}
        >
          {exportStatus === 'exporting' ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Exporting...</span>
            </>
          ) : exportStatus === 'success' ? (
            <>
              <Save size={16} />
              <span>Saved to Game!</span>
            </>
          ) : exportStatus === 'error' ? (
            <>
              <span>Export Failed</span>
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              <span>Use in Game</span>
            </>
          )}
        </button>
        
        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloadStatus === 'downloading'}
          className={`py-3 px-4 rounded text-sm font-medium flex items-center justify-center gap-2
            ${downloadStatus === 'downloading'
              ? "bg-gray-600 cursor-not-allowed"
              : downloadStatus === 'success'
                ? "bg-green-600 hover:bg-green-700"
                : downloadStatus === 'error'
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {downloadStatus === 'downloading' ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Downloading...</span>
            </>
          ) : downloadStatus === 'success' ? (
            <>
              <Download size={16} />
              <span>Downloaded!</span>
            </>
          ) : downloadStatus === 'error' ? (
            <>
              <span>Download Failed</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download PNG</span>
            </>
          )}
        </button>
      </div>
      
      {/* Status messages */}
      {exportStatus === 'success' && (
        <p className="text-xs text-green-400 text-center mt-1">
          Your sticker is now ready to use in the game!
        </p>
      )}
      {downloadStatus === 'success' && (
        <p className="text-xs text-green-400 text-center mt-1">
          Your sticker has been saved to your downloads folder!
        </p>
      )}
    </div>
  );
}