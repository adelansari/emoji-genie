import { useState, useEffect } from "react"; 
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import { StickerPartType, StickerSubcategoryType, subcategories as stickerSubcategories } from '../../data/sticker/stickerModels'; 
import StickerModelGallery from "./StickerModelGallery";
import JoystickController from "../shared/JoystickController";
import SizeControlSimple from "../shared/SizeControlSimple";
import RotationJoystick from "../shared/RotationJoystick";
import ColorPicker from "../shared/ColorPicker";
import { useGame } from "../../context/GameContext";
import { exportElementAsImage, saveImageToLocalStorage, downloadImage } from "../../utils/exportUtils";
import { Save, Download, SlidersHorizontal, X } from "lucide-react"; 

// Constants
const CHARACTER_IMAGE_KEY = 'flappyStickerCharacter'; // Use a different key for sticker

type EditMode = "none" | "position" | "size" | "rotation" | "color";
const editModes: EditMode[] = ["position", "size", "rotation", "color"];

// Function to calculate responsive size (same as in StickerCanvas)
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
 * Sticker-specific customization menu with tabs for Face, Eyes, Hair, Others
 */
export default function StickerCustomizationMenu() {
  const {
    selectedStickerPart, 
    setSelectedStickerPart,
    selectedStickerSubcategory,
    setSelectedStickerSubcategory,
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

  // Define sticker-specific parts
  const stickerParts: StickerPartType[] = ["face", "eyes", "hair", "others"];

  // Get current subcategories for the selected part
  const currentSubcategories = stickerSubcategories[selectedStickerPart] || [];

  // Reset subcategory when part changes
  useEffect(() => {
    if (currentSubcategories.length > 0) {
      setSelectedStickerSubcategory(currentSubcategories[0] as StickerSubcategoryType);
    } else {
      setSelectedStickerSubcategory('default');
    }
    setMode('none'); // Reset edit mode when part changes
    setIsAdjustDrawerOpen(false); // Close drawer when part changes
  }, [selectedStickerPart, currentSubcategories, setSelectedStickerSubcategory]);

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
        // Color might be applicable to all sticker parts, adjust if needed
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

  // Format part/subcategory name for display (capitalize)
  const formatName = (name: string) => {
    if (!name) return '';
    // Handle camelCase like 'eyeShape' -> 'Eye Shape'
    const spaced = name.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  // Handle export to game
  const handleExportToGame = async () => {
    try {
      setExportStatus('exporting');
      const imageDataUrl = await exportElementAsImage('sticker-canvas-container');
      saveImageToLocalStorage(imageDataUrl, CHARACTER_IMAGE_KEY);
      setCharacterImageUrl(imageDataUrl);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to export sticker:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  // Handle downloading the sticker image
  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      const imageDataUrl = await exportElementAsImage('sticker-canvas-container');
      const date = new Date().toISOString().split('T')[0];
      const filename = `sticker-genie-${date}.png`;
      downloadImage(imageDataUrl, filename);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to download sticker:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  return (
    // Adjusted padding for mobile, maintain overall structure
    <div className="relative flex-shrink-0 w-full md:w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-3 md:p-4 flex flex-col gap-3 md:gap-4 text-white">
      {/* Part selection tabs */}
      <nav className="bg-gray-900/50 rounded-md p-1">
        <ul className="flex justify-around gap-1">
          {stickerParts.map((part) => (
            <li key={part} className="flex-1">
              <button
                onClick={() => setSelectedStickerPart(part)}
                className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${selectedStickerPart === part
                    ? "bg-pink-500 text-gray-900 shadow-md"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
              >
                {formatName(part)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subcategory selection tabs (if applicable) */}
      {currentSubcategories.length > 1 && (
        <nav className="bg-gray-900/50 rounded-md p-1">
          <ul className="flex flex-wrap justify-center gap-1">
            {currentSubcategories.map((subcat) => (
              <li key={subcat} className="flex-grow sm:flex-grow-0">
                <button
                  onClick={() => setSelectedStickerSubcategory(subcat)}
                  className={`w-full py-1.5 px-2.5 rounded text-xs font-medium transition-colors duration-150 ${selectedStickerSubcategory === subcat
                      ? "bg-purple-500 text-white shadow-sm"
                      : "bg-gray-700/60 hover:bg-gray-600/80"
                    }`}
                >
                  {formatName(subcat)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Gallery container */}
      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        <StickerModelGallery />
      </div>

      {/* --- Desktop Edit Controls --- */} 
      {/* Hidden on small screens, shown on medium+ */}
      <div className="hidden md:flex flex-col gap-3">
        {/* Edit mode buttons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {editModes.map((editMode) => {
            const isActive = mode === editMode;
            return (
              <button
                key={editMode}
                onClick={() => setMode(current => (current === editMode ? "none" : editMode))}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize ${isActive
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
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
                  : "bg-pink-500 hover:bg-pink-600 text-gray-900 hover:text-gray-900"
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
            const isActive = mode === editMode;
            return (
              <button
                key={editMode}
                onClick={() => setMode(current => (current === editMode ? "none" : editMode))}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize ${isActive
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
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