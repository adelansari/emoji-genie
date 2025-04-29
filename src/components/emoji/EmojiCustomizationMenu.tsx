import { useState, useEffect } from "react"; 
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { EmojiPartType } from '../../data/emoji/emojiModels'; // Import from correct source
import EmojiModelGallery from "./EmojiModelGallery";
import JoystickController from "../shared/JoystickController";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useGame } from "../../context/GameContext";
import { exportElementAsImage, saveImageToLocalStorage, downloadImage } from "../../utils/exportUtils";
// Import icons for Adjust button and Close button
import { Save, Download, SlidersHorizontal, X } from "lucide-react"; 

// Constants
const CHARACTER_IMAGE_KEY = 'flappyEmojiCharacter';

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

// Function to calculate responsive size (same as in EmojiCanvas)
// We need the size here to pass it down to the JoystickController
const getResponsiveCanvasSize = () => {
  const padding = 32; 
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.6; 
  const maxSize = 600; 
  const minSize = 300; 
  return Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
};


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
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  
  // State for the adjustment drawer visibility
  const [isAdjustDrawerOpen, setIsAdjustDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Define emoji-specific parts
  const emojiParts: EmojiPartType[] = ["head", "hat", "eyes", "mouth"];
  
  // renderEditControl remains the same, it will be rendered inside the drawer on mobile
  const renderEditControl = () => {
    switch (mode) {
      case "position":
        // Pass canvasSize to JoystickController
        return <JoystickController canvasSize={canvasSize} />; 
      case "size":
        return <SizeControlSimple />;
      case "rotation":
        return <RotationJoystick />;
      case "color":
        // Check if color should be rendered based on part selection
        if (selectedEmojiPart === 'head') {
          return <p className="text-center text-gray-400 pt-4">Color customization is disabled for the base head shape.</p>;
        }
        return <ColorPicker />;
      case "none":
      default:
        return (
           <div className="flex items-center justify-center h-full min-h-[200px]"> 
            <p className="text-gray-400 text-sm text-center">
              Select a customization option above
            </p>
          </div>
        );
    }
  };

  // Check if color button should be disabled 
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
      const imageDataUrl = await exportElementAsImage('emoji-canvas-container');
      saveImageToLocalStorage(imageDataUrl, CHARACTER_IMAGE_KEY);
      setCharacterImageUrl(imageDataUrl);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to export emoji:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  // Handle downloading the emoji image
  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      const imageDataUrl = await exportElementAsImage('emoji-canvas-container');
      const date = new Date().toISOString().split('T')[0];
      const filename = `emoji-genie-${date}.png`;
      downloadImage(imageDataUrl, filename);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to download emoji:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  // Close drawer when switching parts
  useEffect(() => {
    setIsAdjustDrawerOpen(false);
    setMode('none'); // Also reset mode when part changes
  }, [selectedEmojiPart]);

  return (
    // Adjusted padding for mobile, maintain overall structure
    <div className="relative flex-shrink-0 w-full md:w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-3 md:p-4 flex flex-col gap-3 md:gap-4 text-white">
      {/* Part selection tabs */}
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

      {/* Gallery container */}
      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <EmojiModelGallery />
      </div>
      
      {/* --- Desktop Edit Controls --- */} 
      {/* Hidden on small screens, shown on medium+ */}
      <div className="hidden md:flex flex-col gap-3">
        {/* Edit mode buttons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {editModes.map((editMode) => {
            const isDisabled = isColorDisabled(editMode);
            // Use mode state for active check
            const isActive = mode === editMode && !isDisabled;

            return (
              <button
                key={editMode}
                // Toggle logic: if clicking active, set to none, else set to clicked mode
                onClick={() => setMode(current => (current === editMode ? "none" : editMode))}
                disabled={isDisabled}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : isDisabled
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
                title={isDisabled ? "Color cannot be changed for the base head" : undefined}
              >
                {editMode}
              </button>
            );
          })}
        </div>
        
        {/* Container for edit controls */}
        <div className="min-h-[200px]"> 
          {renderEditControl()}
        </div>
      </div>

      {/* --- Mobile "Adjust" Button --- */} 
      {/* Shown only on small screens (block) */}
      <div className="md:hidden mt-2">
        <button 
          onClick={() => setIsAdjustDrawerOpen(true)}
          className="w-full py-3 px-4 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <SlidersHorizontal size={16} /> Adjust Properties
        </button>
      </div>

      {/* Action buttons (Export/Download) - Always visible at the bottom */}
      <div className="mt-auto pt-3 md:pt-2 grid grid-cols-2 gap-3">
        {/* Export to Game button */}
        <button
          onClick={handleExportToGame}
          disabled={exportStatus === 'exporting'}
          className={`py-3 px-4 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150
            ${exportStatus === 'exporting'
              ? "bg-gray-600 cursor-not-allowed"
              : exportStatus === 'success'
                ? "bg-green-600 hover:bg-green-700"
                : exportStatus === 'error'
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-500 hover:bg-yellow-600 text-gray-900 hover:text-gray-900"
            }`}
        >
          {exportStatus === 'idle' && <><Save size={16} /> Export to Game</>}
          {exportStatus === 'exporting' && 'Exporting...'}
          {exportStatus === 'success' && 'Exported!'}
          {exportStatus === 'error' && 'Export Failed'}
        </button>
        
        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloadStatus === 'downloading'}
          className={`py-3 px-4 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150
            ${downloadStatus === 'downloading'
              ? "bg-gray-600 cursor-not-allowed"
              : downloadStatus === 'success'
                ? "bg-green-600 hover:bg-green-700"
                : downloadStatus === 'error'
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {downloadStatus === 'idle' && <><Download size={16} /> Download</>}
          {downloadStatus === 'downloading' && 'Downloading...'}
          {downloadStatus === 'success' && 'Downloaded!'}
          {downloadStatus === 'error' && 'Download Failed'}
        </button>
      </div>

      {/* --- Mobile Adjustment Drawer --- */} 
      {/* Conditionally rendered overlay drawer */}
      {isAdjustDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setIsAdjustDrawerOpen(false)} // Close on overlay click
        ></div>
      )}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg p-4 z-50 transform transition-transform duration-300 ease-in-out md:hidden 
          ${isAdjustDrawerOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-yellow-300">Adjust Properties</h3>
          <button 
            onClick={() => setIsAdjustDrawerOpen(false)}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        {/* Edit mode buttons grid (inside drawer) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {editModes.map((editMode) => {
            const isDisabled = isColorDisabled(editMode);
            // Use mode state for active check
            const isActive = mode === editMode && !isDisabled;

            return (
              <button
                key={editMode}
                // Toggle logic: if clicking active, set to none, else set to clicked mode
                onClick={() => setMode(current => (current === editMode ? "none" : editMode))}
                disabled={isDisabled}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize 
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : isDisabled
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
                title={isDisabled ? "Color cannot be changed for the base head" : undefined}
              >
                {editMode}
              </button>
            );
          })}
        </div>
        
        {/* Container for edit controls (inside drawer) */}
        <div className="min-h-[200px]"> 
          {renderEditControl()}
        </div>
      </div>
    </div>
  );
}