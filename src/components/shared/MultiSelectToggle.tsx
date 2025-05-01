import { memo } from 'react';
import { Layers, LayoutGrid } from 'lucide-react';
import { useEmojiCustomization } from '../../context/EmojiCustomizationContext';

interface MultiSelectToggleProps {
  className?: string;
}

/**
 * Toggle switch for enabling/disabling multi-selection mode
 */
function MultiSelectToggle({ className = '' }: MultiSelectToggleProps) {
  const { isMultiSelectMode, toggleMultiSelectMode, selectedParts } = useEmojiCustomization();
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleMultiSelectMode}
        className={`flex items-center gap-2 py-2 px-3 rounded text-sm font-medium transition-colors duration-150 ${
          isMultiSelectMode
            ? "bg-indigo-500 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
        }`}
        title={isMultiSelectMode ? "Disable multi-select" : "Enable multi-select"}
      >
        {isMultiSelectMode ? <Layers size={16} /> : <LayoutGrid size={16} />}
        <span>
          {isMultiSelectMode ? 'Multi-Select: ON' : 'Multi-Select: OFF'}
        </span>
      </button>
      
      {isMultiSelectMode && selectedParts.length > 0 && (
        <span className="text-xs bg-indigo-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
          {selectedParts.length}
        </span>
      )}
    </div>
  );
}

export default memo(MultiSelectToggle);