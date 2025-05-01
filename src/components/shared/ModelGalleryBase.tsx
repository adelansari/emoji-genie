import { ReactNode, useState, useEffect } from "react";
import { useEmojiCustomization, PartIdentifier } from "../../context/EmojiCustomizationContext";
import SelectableItem from "./SelectableItem";
import { X, Trash2 } from "lucide-react";

export interface ModelItem {
  id: string;
  name: string;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ModelGalleryBaseProps {
  models: ModelItem[];
  selectedModelId: string | undefined | null;
  onSelectModel: (modelId: string | null) => void;
  emptyStateMessage?: string;
  selectionColor?: string;
  preserveOriginalColors?: boolean;
  partType?: string; 
  subcategory?: string;
}

/**
 * Base component for model galleries used in both emoji and sticker components
 */
export default function ModelGalleryBase({
  models,
  selectedModelId,
  onSelectModel,
  emptyStateMessage = "No models available.",
  selectionColor = '#FACC15',
  preserveOriginalColors = true,
  partType = '',
  subcategory = 'default'
}: ModelGalleryBaseProps) {
  const { emojiType, isMultiSelectMode, selectedParts, removePartSelection } = useEmojiCustomization();
  
  // Track which item is being hovered for showing remove button
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  
  // Check if there are any models to display
  if (models.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4">
        {emptyStateMessage}
      </p>
    );
  }
  
  // Helper to check if any part is selected from this subcategory in multi-select mode
  const getSelectedPartFromSubcategory = () => {
    if (!isMultiSelectMode) return null;
    
    // Find if any part with this part+subcategory base is already selected
    return selectedParts.find(p => {
      // Check if this part matches the current part type
      if (p.mode !== emojiType || p.part !== partType) {
        return false;
      }
      
      // Extract base subcategory (without model ID) for comparison
      const pBaseSubcategory = p.subcategory.includes('-') 
          ? p.subcategory.split('-')[0] 
          : p.subcategory;
          
      return pBaseSubcategory === subcategory;
    });
  };
  
  // Get the model ID from the selected part, if any
  const selectedPartInSubcategory = getSelectedPartFromSubcategory();
  const selectedModelIdFromMultiSelect = selectedPartInSubcategory?.subcategory?.split('-')[1];
  
  // Handle removing a model and its selection marker
  const handleRemoveModel = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the main button click
    
    // If in multi-select mode, also remove the selection
    if (isMultiSelectMode && selectedPartInSubcategory) {
      // Remove the selection marker for this part
      removePartSelection({
        mode: emojiType,
        part: partType,
        subcategory: selectedPartInSubcategory.subcategory
      });
    }
    
    // Explicitly pass null to remove the model
    onSelectModel(null);
  };

  // Handle model selection based on mode (single or multi-select)
  const handleModelSelect = (modelId: string) => {
    if (isMultiSelectMode) {
      // In multi-select mode, don't deselect anything
      // Just update the model for this specific subcategory
      onSelectModel(modelId);
    } else {
      // In single-select mode, use toggle behavior
      if (modelId === selectedModelId) {
        // Toggle off if clicking the same model
        onSelectModel(null);
      } else {
        // Select new model
        onSelectModel(modelId);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {models.map((model) => {
        // Model is selected if it's the active model in regular mode
        const isSelected = selectedModelId === model.id;
        const isHovered = hoveredItemId === model.id;
        const isSelectedInMultiSelect = isMultiSelectMode && model.id === selectedModelIdFromMultiSelect;
        
        // Create a unique part identifier for each model
        const partId: PartIdentifier = {
          mode: emojiType,
          part: partType,
          subcategory: `${subcategory}-${model.id}`
        };
        
        const modelButton = (
          <button
            onClick={() => handleModelSelect(model.id)}
            onMouseEnter={() => setHoveredItemId(model.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 relative ${
              isSelected || isSelectedInMultiSelect
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
            title={!isMultiSelectMode && isSelected ? `Click to deselect ${model.name}` : model.name}
          >
            {/* Show remove button when hovering over a selected item in single select mode */}
            {!isMultiSelectMode && isSelected && isHovered && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-10 shadow-md cursor-pointer hover:bg-red-600"
                onClick={handleRemoveModel}
                title={`Remove ${model.name}`}
              >
                <X size={14} className="text-white" />
              </div>
            )}
            
            {/* Show remove button when hovering over a selected item in multi-select mode */}
            {isMultiSelectMode && isSelectedInMultiSelect && isHovered && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-20 shadow-md cursor-pointer hover:bg-red-600"
                onClick={handleRemoveModel}
                title={`Remove ${model.name} from canvas`}
              >
                <Trash2 size={14} className="text-white" />
              </div>
            )}
            
            <div className="flex items-center justify-center w-full h-full">
              <model.SvgComponent
                width="48"
                height="48"
                className="w-full h-full max-w-full max-h-full"
              />
            </div>
          </button>
        );
        
        // In multi-select mode, only show selection indicator for this model
        // if it's the selected model in this subcategory
        const showSelectionIndicator = isMultiSelectMode && model.id === selectedModelIdFromMultiSelect;
        
        return (
          <div key={model.id} className="relative">
            {partType && isMultiSelectMode ? (
              <SelectableItem
                partId={partId}
                onClick={() => handleModelSelect(model.id)}
                forceSelected={showSelectionIndicator}
                indicatorPosition="topleft" // Position the selection indicator on the top-left
              >
                {modelButton}
              </SelectableItem>
            ) : (
              modelButton
            )}
          </div>
        );
      })}
    </div>
  );
}