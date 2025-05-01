import { ReactNode } from "react";
import { useEmojiCustomization, PartIdentifier } from "../../context/EmojiCustomizationContext";

interface SelectableItemProps {
  partId: PartIdentifier;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  forceSelected?: boolean;
  indicatorPosition?: "topleft" | "topright";
}

/**
 * A wrapper component that adds selection capabilities to items in multi-select mode
 */
const SelectableItem = ({ 
  partId, 
  children, 
  className = "", 
  onClick,
  forceSelected = false,
  indicatorPosition = "topright"
}: SelectableItemProps) => {
  const { 
    isMultiSelectMode, 
    isPartSelected, 
    togglePartSelection 
  } = useEmojiCustomization();

  const handleClick = () => {
    if (isMultiSelectMode) {
      togglePartSelection(partId);
    }
    
    // Still call the original onClick if provided
    if (onClick) onClick();
  };

  // Use forceSelected prop or check if part is selected
  const isSelected = forceSelected || (isMultiSelectMode && isPartSelected(partId));

  // Determine position class based on indicatorPosition prop
  const positionClass = indicatorPosition === "topleft" 
    ? "-top-1 -left-1" 
    : "-top-1 -right-1";

  return (
    <div 
      className={`relative ${className} ${isMultiSelectMode ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {isMultiSelectMode && (
        <div 
          className={`absolute ${positionClass} w-5 h-5 rounded-full z-10 border-2 border-gray-800 
          ${isSelected ? 'bg-indigo-500' : 'bg-gray-600'}`}
        >
          {isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full p-0.5 text-white" 
                viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default SelectableItem;