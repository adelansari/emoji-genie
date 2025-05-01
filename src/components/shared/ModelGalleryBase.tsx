import { ReactNode } from "react";
import { useEmojiCustomization, PartIdentifier } from "../../context/EmojiCustomizationContext";
import SelectableItem from "./SelectableItem";

export interface ModelItem {
  id: string;
  name: string;
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ModelGalleryBaseProps {
  models: ModelItem[];
  selectedModelId: string | undefined | null;
  onSelectModel: (modelId: string) => void;
  emptyStateMessage?: string;
  selectionColor?: string;
  // No longer applying default colors to SVGs
  preserveOriginalColors?: boolean;
  // For multi-select mode
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
  selectionColor = '#FACC15', // Yellow for selection highlighting only
  preserveOriginalColors = true,
  partType = '',
  subcategory = 'default'
}: ModelGalleryBaseProps) {
  const { emojiType, isMultiSelectMode } = useEmojiCustomization();
  
  // Check if there are any models to display
  if (models.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4">
        {emptyStateMessage}
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto overflow-x-hidden p-1 h-48 items-center justify-center custom-scrollbar">
      {models.map((model) => {
        const isSelected = selectedModelId === model.id;
        
        // Create a unique part identifier for each model by including the model ID
        // This ensures each model in a subcategory is uniquely selectable
        const partId: PartIdentifier = {
          mode: emojiType,
          part: partType,
          subcategory: `${subcategory}-${model.id}`  // Make identifier unique per model
        };
        
        const modelButton = (
          <button
            onClick={() => onSelectModel(model.id)}
            className={`flex-shrink-0 w-16 h-16 flex items-center justify-center p-1 rounded border-2 transition-colors duration-150 ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white"
            }`}
            title={model.name}
          >
            <div className="flex items-center justify-center w-full h-full">
              <model.SvgComponent
                width="48"
                height="48"
                className="w-full h-full max-w-full max-h-full"
                // No fill prop - let SVG use its original colors
              />
            </div>
          </button>
        );
        
        // In multi-select mode, wrap buttons with SelectableItem
        return (
          <div key={model.id} className="relative">
            {partType && isMultiSelectMode ? (
              <SelectableItem
                partId={partId}
                onClick={() => onSelectModel(model.id)}
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