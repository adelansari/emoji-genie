import { memo } from 'react';
import { ListChecks, List } from 'lucide-react';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";

interface MultiSelectToggleProps {
  className?: string;
}

/**
 * Component that toggles between single and multi-selection modes
 */
const MultiSelectToggle = ({ className = '' }: MultiSelectToggleProps) => {
  const { isMultiSelectMode, toggleMultiSelectMode } = useEmojiCustomization();
  
  return (
    <div className={`inline-flex ${className}`}>
      <button
        onClick={toggleMultiSelectMode}
        className={`p-1.5 rounded transition-colors duration-150 flex items-center gap-2 ${
          isMultiSelectMode 
            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
            : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        }`}
        title={isMultiSelectMode ? "Switch to single selection" : "Switch to multi selection"}
      >
        {isMultiSelectMode ? (
          <>
            <ListChecks size={16} />
            <span className="text-sm">Multi-select</span>
          </>
        ) : (
          <>
            <List size={16} />
            <span className="text-sm">Single select</span>
          </>
        )}
      </button>
    </div>
  );
};

export default memo(MultiSelectToggle);