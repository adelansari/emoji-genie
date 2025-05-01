import { useState, useEffect, useRef, ReactNode } from "react";
import JoystickController from "./JoystickController";
import SizeControlSimple from "./SizeControlSimple";
import RotationJoystick from "./RotationJoystick";
import ColorPicker from "./ColorPicker";
import MultiSelectToggle from "./MultiSelectToggle";
import { exportElementAsImage, saveImageToLocalStorage, downloadImage } from "../../utils/exportUtils";
import { Save, Download, SlidersHorizontal, X, CheckSquare } from "lucide-react";
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";

export type EditMode = "none" | "position" | "size" | "rotation" | "color";
export const EDIT_MODES: EditMode[] = ["position", "size", "rotation", "color"];

// Function to calculate responsive size
export const getResponsiveCanvasSize = () => {
  const padding = 32;
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight * 0.6;
  const maxSize = 600;
  const minSize = 300;
  return Math.max(minSize, Math.min(maxSize, availableWidth, availableHeight));
};

export interface CustomizationMenuBaseProps {
  // Core props
  title: string;
  selectedPart: string;
  selectedSubcategory?: string;
  canvasContainerId: string;
  storageKey: string;
  primaryColor: string;
  accentColor: string;
  
  // Children components
  navigationTabs: ReactNode;
  subcategoryTabs?: ReactNode;
  galleryComponent: ReactNode;
  
  // Callbacks
  onSetCharacterImageUrl: (url: string) => void;
  onSelectModeChange?: (mode: EditMode) => void;
  
  // Optional customizations
  isColorDisabled?: (mode: EditMode) => boolean;
  downloadFilePrefix?: string; 
}

export default function CustomizationMenuBase({
  title,
  selectedPart,
  selectedSubcategory,
  canvasContainerId,
  storageKey,
  primaryColor,
  accentColor,
  navigationTabs,
  subcategoryTabs,
  galleryComponent,
  onSetCharacterImageUrl,
  onSelectModeChange,
  isColorDisabled = () => false,
  downloadFilePrefix = "emoji-genie"
}: CustomizationMenuBaseProps) {
  const { 
    isMultiSelectMode,
    selectedParts,
    clearSelectedParts
  } = useEmojiCustomization();
  
  const [mode, setMode] = useState<EditMode>("none");
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  
  // State for canvas size to pass to joystick
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());
  const [isAdjustDrawerOpen, setIsAdjustDrawerOpen] = useState(false);
  const [drawerAnimation, setDrawerAnimation] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const drawerTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getResponsiveCanvasSize());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => {
      window.removeEventListener('resize', handleResize);
      if (drawerTimeoutRef.current) clearTimeout(drawerTimeoutRef.current);
    };
  }, []);

  // Close drawer when switching parts and not in multi-select mode
  useEffect(() => {
    if (!isMultiSelectMode) {
      setMode('none'); // Reset mode when part changes in single-select mode
      
      // Close drawer on part change with animation
      if (isAdjustDrawerOpen) {
        handleCloseDrawer();
      }
    }
  }, [selectedPart, selectedSubcategory, isMultiSelectMode]);

  // Handle opening drawer with animation
  const handleOpenDrawer = () => {
    // First set it to exited state with translateY(100%)
    setDrawerAnimation('exited');
    setIsAdjustDrawerOpen(true);
    
    // Force a DOM reflow to ensure the initial position is applied
    // before starting the animation
    setTimeout(() => {
      setDrawerAnimation('entering');
      
      // After animation completes, mark as fully entered
      drawerTimeoutRef.current = window.setTimeout(() => {
        setDrawerAnimation('entered');
      }, 300);
    }, 10);
  };

  // Handle closing drawer with animation
  const handleCloseDrawer = () => {
    setDrawerAnimation('exiting');
    
    // After animation completes, actually remove from DOM
    drawerTimeoutRef.current = window.setTimeout(() => {
      setIsAdjustDrawerOpen(false);
      setDrawerAnimation('exited');
    }, 300); // Match this to the CSS transition duration
  };

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
        // Check if color is disabled
        if (isColorDisabled(mode)) {
          return <p className="text-center text-gray-400 pt-4">Color customization is disabled for this element.</p>;
        }
        return <ColorPicker />;
      case "none":
      default:
        return (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-gray-400 text-sm text-center">
              {isMultiSelectMode 
                ? "Select parts to customize, then choose an adjustment option above" 
                : "Select a customization option above"
              }
            </p>
          </div>
        );
    }
  };

  // Format part name for display (capitalize)
  const formatPartName = (part: string) => {
    if (!part) return '';
    // Handle camelCase like 'eyeShape' -> 'Eye Shape'
    const spaced = part.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  // Handle export to game
  const handleExportToGame = async () => {
    try {
      setExportStatus('exporting');
      const imageDataUrl = await exportElementAsImage(canvasContainerId);
      saveImageToLocalStorage(imageDataUrl, storageKey);
      onSetCharacterImageUrl(imageDataUrl);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to export:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  // Handle downloading the image
  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      const imageDataUrl = await exportElementAsImage(canvasContainerId);
      const date = new Date().toISOString().split('T')[0];
      const filename = `${downloadFilePrefix}-${date}.png`;
      downloadImage(imageDataUrl, filename);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to download:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  // Function to handle selecting an edit mode (used in both layouts)
  const handleSelectMode = (editMode: EditMode) => {
    // If clicking the currently active mode, toggle it off, otherwise set the new mode
    const newMode = mode === editMode ? "none" : editMode;
    setMode(newMode);
    if (onSelectModeChange) {
      onSelectModeChange(newMode);
    }
  };

  // Get part name for display
  const partName = formatPartName(selectedPart);
  const subcatName = selectedSubcategory ? formatPartName(selectedSubcategory) : '';
  
  // Generate appropriate title based on selection mode
  const getDisplayTitle = () => {
    if (isMultiSelectMode) {
      if (selectedParts.length === 0) {
        return "Select parts to customize";
      } else {
        return `Adjust ${selectedParts.length} selected part${selectedParts.length === 1 ? '' : 's'}`;
      }
    } else {
      // Original single-selection title
      return selectedSubcategory && selectedSubcategory !== 'default' 
        ? `Adjust ${subcatName} (${partName})`
        : `Adjust ${partName}`;
    }
  };
  
  const displayTitle = getDisplayTitle();

  return (
    <div className="flex-shrink-0 w-full md:w-96 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-4 flex flex-col gap-4 text-white relative md:static">
      {/* Add multi-select toggle above navigation tabs */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <MultiSelectToggle />
      </div>
      
      {/* Navigation tabs */}
      {navigationTabs}
      
      {/* Selection status and clear button */}
      {isMultiSelectMode && selectedParts.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-900/30 p-2 rounded-md border border-indigo-700/30">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-indigo-400" />
            <span className="text-sm text-indigo-200">
              {selectedParts.length} part{selectedParts.length === 1 ? '' : 's'} selected
            </span>
          </div>
          <button 
            onClick={clearSelectedParts}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Clear
          </button>
        </div>
      )}
      
      {/* Subcategory tabs (if provided) */}
      {subcategoryTabs}

      {/* Gallery container */}
      <div className="bg-gray-900/50 rounded-md p-2 min-h-[100px]">
        {galleryComponent}
      </div>

      {/* --- Desktop Edit Controls --- */}
      <div className="hidden md:block"> {/* Hide on mobile, show on medium+ */}
        {/* Add header to match mobile drawer experience */}
        <div className="mb-3 px-2 flex items-center justify-between">
          <h3 className={`text-lg font-semibold text-${accentColor}-300`}>
            {displayTitle}
          </h3>
          <button
            onClick={() => setMode("none")}
            className="p-1 text-gray-400 hover:text-white opacity-70 hover:opacity-100"
            title="Clear selection"
          >
            {mode !== "none" && <X size={16} />}
          </button>
        </div>

        {/* Make edit mode buttons responsive: grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EDIT_MODES.map((editMode) => {
            const disabled = isColorDisabled(editMode);
            const isActive = mode === editMode && !disabled;

            return (
              <button
                key={editMode}
                onClick={() => !disabled && handleSelectMode(editMode)}
                disabled={disabled || (isMultiSelectMode && selectedParts.length === 0)}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : disabled || (isMultiSelectMode && selectedParts.length === 0)
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700/60 hover:bg-gray-600/80"
                  }`}
                title={
                  disabled 
                    ? "This adjustment is not available for this element" 
                    : isMultiSelectMode && selectedParts.length === 0
                    ? "Select at least one part first"
                    : undefined
                }
              >
                {editMode}
              </button>
            );
          })}
        </div>
        
        {/* Container for edit controls */}
        <div className="mt-4 bg-gray-800/50 p-3 rounded-md border border-gray-700/30 min-h-[200px]">
          {renderEditControl()}
        </div>
      </div>

      {/* --- Mobile "Adjust" Button --- */}
      <div className="md:hidden flex justify-center mt-2"> {/* Show only on mobile */}
        <button 
          onClick={handleOpenDrawer}
          disabled={isMultiSelectMode && selectedParts.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 shadow-md ${
            isMultiSelectMode && selectedParts.length === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <SlidersHorizontal size={18} />
          {isMultiSelectMode
            ? selectedParts.length > 0
              ? `Adjust ${selectedParts.length} Selected Part${selectedParts.length > 1 ? 's' : ''}`
              : "Select Parts First"
            : "Adjust Details"
          }
        </button>
      </div>

      {/* --- Mobile Adjust Drawer --- */}
      {isAdjustDrawerOpen && (
        <div 
          className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 rounded-t-lg shadow-2xl p-4 flex flex-col gap-4 
                     transform transition-transform duration-300 ease-out"
          style={{ 
            transform: drawerAnimation === 'entering' || drawerAnimation === 'entered' 
              ? 'translateY(0)' 
              : 'translateY(100%)'
          }}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className={`text-lg font-semibold text-indigo-300`}>
              {displayTitle}
            </h3>
            <button onClick={handleCloseDrawer} className="p-1 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Edit Mode Buttons (inside drawer) */}
          <div className="grid grid-cols-4 gap-2">
            {EDIT_MODES.map((editMode) => {
              const disabled = isColorDisabled(editMode);
              const isActive = mode === editMode && !disabled;

              return (
                <button
                  key={editMode}
                  onClick={() => !disabled && handleSelectMode(editMode)}
                  disabled={disabled || (isMultiSelectMode && selectedParts.length === 0)}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors duration-150 capitalize
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                      : disabled || (isMultiSelectMode && selectedParts.length === 0)
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-700/60 hover:bg-gray-600/80"
                    }`}
                  title={
                    disabled 
                      ? "This adjustment is not available for this element" 
                      : isMultiSelectMode && selectedParts.length === 0
                      ? "Select at least one part first"
                      : undefined
                  }
                >
                  {editMode}
                </button>
              );
            })}
          </div>
          
          {/* Edit Control Area (inside drawer) */}
          <div className="min-h-[200px]">
            {renderEditControl()}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="mt-auto pt-4 grid grid-cols-2 gap-3"> {/* Use mt-auto to push to bottom if needed */}
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
                  : `bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-gray-900 hover:text-gray-900`
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
    </div>
  );
}