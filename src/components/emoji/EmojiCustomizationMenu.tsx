import { useState } from "react";
import JoystickController from "../shared/JoystickController";
import EmojiModelGallery from "./EmojiModelGallery";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { EmojiPartType } from "../../data/emoji/emojiModels";
import { useGame } from "../../context/GameContext";
import { exportElementAsImage, saveImageToLocalStorage, downloadImage } from "../../utils/exportUtils";
import { Save, ExternalLink, Download } from "lucide-react";

// Constants
const CHARACTER_IMAGE_KEY = 'flappyEmojiCharacter';

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

/**
 * Emoji-specific customization menu with tabs for Head, Hat, Eyes, and Mouth
 */
export default function EmojiCustomizationMenu() {
  const {
    selectedEmojiPart, 
    setSelectedEmojiPart,
  } = useEmojiCustomization();

  const { setCharacterImageUrl } = useGame();

  const [mode, setMode] = useState<EditMode>("none");
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  // Define emoji-specific parts
  const emojiParts: EmojiPartType[] = ["head", "hat", "eyes", "mouth"];
  
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

  // Check if color button should be disabled 
  // (Disable color for head in emoji mode)
  const isColorDisabled = (editMode: EditMode) => {
    return editMode === 'color' && selectedEmojiPart === 'head';
  };

  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  // Handle export to game
  const handleExportToGame = async () => {
    try {
      setExportStatus('exporting');
      
      // Export the canvas element
      const imageDataUrl = await exportElementAsImage('emoji-canvas-container');
      
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
      console.error('Failed to export emoji:', error);
      setExportStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    }
  };

  // Handle downloading the emoji image
  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      
      // Export the canvas element
      const imageDataUrl = await exportElementAsImage('emoji-canvas-container');
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `emoji-genie-${date}.png`;
      
      // Download the image
      downloadImage(imageDataUrl, filename);
      
      setDownloadStatus('success');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to download emoji:', error);
      setDownloadStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="flex-shrink-0 w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white">
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {emojiParts.map((part) => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedEmojiPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
                  selectedEmojiPart === part
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

      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <EmojiModelGallery />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {editModes.map((editMode) => {
          const isDisabled = isColorDisabled(editMode);

          return (
            <button
              key={editMode}
              onClick={() => setMode(current => current === editMode ? "none" : editMode)}
              disabled={isDisabled}
              className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
                ${mode === editMode && !isDisabled
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                  : isDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                }`}
            >
              {editMode}
            </button>
          );
        })}
      </div>
      
      <div className="min-h-[200px]">
        {!(mode === 'color' && selectedEmojiPart === 'head') && renderEditControl()}
        {mode === 'color' && selectedEmojiPart === 'head' && (
          <p className="text-center text-gray-400 pt-4">Color customization is disabled for the base head shape.</p>
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
          Your emoji is now ready to use in the game!
        </p>
      )}
      {downloadStatus === 'success' && (
        <p className="text-xs text-green-400 text-center mt-1">
          Your emoji has been saved to your downloads folder!
        </p>
      )}
    </div>
  );
}