import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { ModelIdType } from '../data/modelTypes';
import { EmojiPartType } from '../data/emoji/emojiModels';
import { StickerPartType, StickerSubcategoryType, subcategories } from '../data/sticker/stickerModels';
import { canvasConfig, getAdaptiveScale } from '../utils/canvasConfig';

export type EmojiType = 'emoji' | 'sticker';

// Define a type for part identification in multi-select mode
export type PartIdentifier = {
  mode: EmojiType;
  part: string;
  subcategory: string;
}

interface Transform {
    position: { x: number; y: number };
    rotation: number;
    size: { x: number; y: number };
    color: string;
}

const defaultTransform: Transform = {
    position: { x: 0.5, y: 0.5 }, // Center position as a ratio (0.5, 0.5 = center)
    rotation: 0,
    size: { x: 100, y: 100 }, // Base size percentage (will be combined with adaptive scaling)
    color: canvasConfig.defaultColor
};

interface EmojiCustomizationContextType {
    position: { x: number; y: number };
    setPosition: (pos: { x: number; y: number }) => void;
    rotation: number;
    setRotation: (rot: number) => void;
    size: { x: number; y: number };
    setSize: (size: { x: number; y: number }) => void;
    color: string;
    setColor: (color: string) => void;
    
    // Multi-select mode
    isMultiSelectMode: boolean;
    toggleMultiSelectMode: () => void;
    selectedParts: PartIdentifier[];
    togglePartSelection: (partId: PartIdentifier) => void;
    removePartSelection: (partId: PartIdentifier) => void;  // New function to remove selection
    clearSelectedParts: () => void;
    isPartSelected: (partId: PartIdentifier) => boolean;
    
    // Emoji type toggle
    emojiType: EmojiType;
    setEmojiType: (type: EmojiType) => void;
    
    // Emoji mode selections
    selectedEmojiPart: EmojiPartType;
    setSelectedEmojiPart: (part: EmojiPartType) => void;
    selectedEmojiModels: Record<EmojiPartType, ModelIdType | null>;
    setSelectedEmojiModel: (part: EmojiPartType, modelId: ModelIdType | null) => void;
    
    // Sticker mode selections
    selectedStickerPart: StickerPartType;
    setSelectedStickerPart: (part: StickerPartType) => void;
    selectedStickerSubcategory: StickerSubcategoryType;
    setSelectedStickerSubcategory: (subcategory: StickerSubcategoryType) => void;
    selectedStickerModels: Record<StickerPartType, Record<StickerSubcategoryType, ModelIdType | null>>;
    setSelectedStickerModel: (part: StickerPartType, subcategory: StickerSubcategoryType, modelId: ModelIdType | null) => void;
    
    // Get transforms for specific part types
    getTransform: (mode: EmojiType, part: string, subcategory?: StickerSubcategoryType) => Transform;
    
    // Legacy prop for backward compatibility during refactoring
    selectedHeadModel: ModelIdType;
    setSelectedHeadModel: (model: ModelIdType) => void;
}

// Create the context with a default value
const EmojiCustomizationContext = createContext<EmojiCustomizationContextType>(null!);

export const useEmojiCustomization = () => {
    const context = useContext(EmojiCustomizationContext);
    if (!context) {
        throw new Error('useEmojiCustomization must be used within an EmojiCustomizationProvider');
    }
    return context;
};

interface EmojiCustomizationProviderProps {
    children: ReactNode;
}

export const EmojiCustomizationProvider: React.FC<EmojiCustomizationProviderProps> = ({ children }) => {
    const [emojiType, _setEmojiType] = useState<EmojiType>("sticker");
    
    // Multi-select mode
    const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
    const [selectedParts, setSelectedParts] = useState<PartIdentifier[]>([]);
    
    // Emoji mode states
    const [selectedEmojiPart, _setSelectedEmojiPart] = useState<EmojiPartType>('head');
    const [selectedEmojiModels, _setSelectedEmojiModels] = useState<Record<EmojiPartType, ModelIdType | null>>({
        head: 'default',
        hat: null,
        eyes: null,
        mouth: null
    });
    
    // Sticker mode states
    const [selectedStickerPart, _setSelectedStickerPart] = useState<StickerPartType>('face');
    const [selectedStickerSubcategory, _setSelectedStickerSubcategory] = useState<StickerSubcategoryType>('shape');
    
    // Initialize with the proper structure for all subcategories
    const [selectedStickerModels, _setSelectedStickerModels] = useState<Record<StickerPartType, Record<StickerSubcategoryType, ModelIdType | null>>>({
        face: {
            shape: 'shape01', // Keep the face shape as default
            mouth: null,
            eyeShape: null,
            eyebrows: null,
            default: null
        },
        eyes: {
            shape: null,
            mouth: null,
            eyeShape: null, // Changed from 'eyeShape01' to null
            eyebrows: null, // Changed from 'eyebrows01' to null
            default: null
        },
        hair: {
            shape: null,
            mouth: null,
            eyeShape: null,
            eyebrows: null,
            default: null  // Changed from 'hair01' to null
        },
        others: {
            shape: null,
            mouth: null,
            eyeShape: null,
            eyebrows: null,
            default: null  // Changed from 'accessory01' to null
        }
    });
    
    // Store transforms by mode, part type, and subcategory
    // Using a map structure: transforms[mode][partType][subcategory] = { position, rotation, size, color }
    const [transforms, setTransforms] = useState<Record<EmojiType, Record<string, Record<string, Transform>>>>({
        emoji: {
            head: { default: { ...defaultTransform } },
            hat: { default: { ...defaultTransform } },
            eyes: { default: { ...defaultTransform } },
            mouth: { default: { ...defaultTransform } }
        },
        sticker: {
            face: { 
                shape: { ...defaultTransform },
                mouth: { ...defaultTransform }
            },
            eyes: { 
                eyeShape: { ...defaultTransform }, 
                eyebrows: { ...defaultTransform }
            },
            hair: { 
                default: { ...defaultTransform } 
            },
            others: { 
                default: { ...defaultTransform } 
            }
        }
    });

    // Multi-selection mode handlers
    const toggleMultiSelectMode = useCallback(() => {
        setIsMultiSelectMode(prev => !prev);
        // Clear selections when toggling mode
        setSelectedParts([]);
    }, []);

    const isPartSelected = useCallback((partId: PartIdentifier) => {
        return selectedParts.some(p => 
            p.mode === partId.mode && 
            p.part === partId.part && 
            p.subcategory === partId.subcategory
        );
    }, [selectedParts]);

    // Modified to enforce "one part per subcategory" rule
    const togglePartSelection = useCallback((partId: PartIdentifier) => {
        setSelectedParts(prev => {
            // Check if this part is already selected
            const isAlreadySelected = prev.some(p => 
                p.mode === partId.mode && 
                p.part === partId.part && 
                p.subcategory === partId.subcategory
            );
            
            if (isAlreadySelected) {
                // If selected, remove it
                return prev.filter(p => 
                    !(p.mode === partId.mode && 
                      p.part === partId.part && 
                      p.subcategory === partId.subcategory)
                );
            } else {
                // Extract the base subcategory without model ID
                const baseSubcategory = partId.subcategory.includes('-') 
                    ? partId.subcategory.split('-')[0] 
                    : partId.subcategory;
                
                // Remove any existing selection from the same part+subcategory combination
                const filteredParts = prev.filter(p => {
                    // Extract the base subcategory for comparison
                    const pBaseSubcategory = p.subcategory.includes('-') 
                        ? p.subcategory.split('-')[0] 
                        : p.subcategory;
                    
                    // Keep if it's not the same part type or base subcategory
                    return !(p.mode === partId.mode && 
                           p.part === partId.part && 
                           pBaseSubcategory === baseSubcategory);
                });
                
                // Add the new selection
                return [...filteredParts, partId];
            }
        });
    }, []);

    const removePartSelection = useCallback((partId: PartIdentifier) => {
        setSelectedParts(prev => 
            prev.filter(p => 
                !(p.mode === partId.mode && 
                  p.part === partId.part && 
                  p.subcategory === partId.subcategory)
            )
        );
    }, []);

    const clearSelectedParts = useCallback(() => {
        setSelectedParts([]);
    }, []);

    // Helper to get current active part and subcategory based on mode
    const getCurrentPartAndSubcategory = useCallback(() => {
        if (emojiType === 'emoji') {
            return { part: selectedEmojiPart, subcategory: 'default' as StickerSubcategoryType };
        } else {
            return { part: selectedStickerPart, subcategory: selectedStickerSubcategory };
        }
    }, [emojiType, selectedEmojiPart, selectedStickerPart, selectedStickerSubcategory]);

    // Get transform for a specific mode, part and subcategory
    const getTransform = useCallback((mode: EmojiType, part: string, subcategory?: StickerSubcategoryType): Transform => {
        const subcat = subcategory || (mode === 'emoji' ? 'default' : 'shape');
        
        if (transforms[mode]?.[part]?.[subcat]) {
            return transforms[mode][part][subcat];
        }
        
        // Fallback to default transform if not found
        return defaultTransform;
    }, [transforms]);
    
    // Get current active transform
    const getCurrentTransform = useCallback(() => {
        const currentMode = emojiType;
        const { part, subcategory } = getCurrentPartAndSubcategory();
        return getTransform(currentMode, part, subcategory);
    }, [emojiType, getCurrentPartAndSubcategory, getTransform]);

    // Update transform for current active part and subcategory
    // Enhanced to handle multi-selection with unique part identifiers
    const updateCurrentTransform = useCallback((updates: Partial<Transform>) => {
        const currentMode = emojiType;
        
        setTransforms(prev => {
            // Create a copy of the transforms to modify
            const updatedTransforms = {...prev};
            
            // In multi-select mode, update all selected parts
            if (isMultiSelectMode && selectedParts.length > 0) {
                // Apply updates to all selected parts
                selectedParts.forEach(({ mode, part, subcategory }) => {
                    // Extract the actual subcategory name without the model ID if present
                    // Example: "eyeShape-model01" -> "eyeShape"
                    const actualSubcategory = subcategory.includes('-') 
                        ? subcategory.split('-')[0] 
                        : subcategory;
                    
                    // Ensure the structures exist
                    if (!updatedTransforms[mode]) updatedTransforms[mode] = {};
                    if (!updatedTransforms[mode][part]) updatedTransforms[mode][part] = {};
                    if (!updatedTransforms[mode][part][actualSubcategory]) {
                        updatedTransforms[mode][part][actualSubcategory] = {...defaultTransform};
                    }
                    
                    // Apply the updates
                    updatedTransforms[mode][part][actualSubcategory] = {
                        ...updatedTransforms[mode][part][actualSubcategory],
                        ...updates
                    };
                });
            } else {
                // Single selection mode - update only the current part
                const { part, subcategory } = getCurrentPartAndSubcategory();
                
                // Ensure the structures exist
                if (!updatedTransforms[currentMode]) updatedTransforms[currentMode] = {};
                if (!updatedTransforms[currentMode][part]) updatedTransforms[currentMode][part] = {};
                if (!updatedTransforms[currentMode][part][subcategory]) {
                    updatedTransforms[currentMode][part][subcategory] = {...defaultTransform};
                }
                
                // Apply the updates
                updatedTransforms[currentMode][part][subcategory] = {
                    ...updatedTransforms[currentMode][part][subcategory],
                    ...updates
                };
            }
            
            return updatedTransforms;
        });
    }, [emojiType, isMultiSelectMode, selectedParts, getCurrentPartAndSubcategory]);

    // Memoized setters
    const setPosition = useCallback((newPosition: { x: number; y: number }) => {
        updateCurrentTransform({ position: newPosition });
    }, [updateCurrentTransform]);

    const setRotation = useCallback((newRotation: number) => {
        updateCurrentTransform({ rotation: newRotation });
    }, [updateCurrentTransform]);

    const setSize = useCallback((newSize: { x: number; y: number }) => {
        updateCurrentTransform({ size: newSize });
    }, [updateCurrentTransform]);

    const setColor = useCallback((newColor: string) => {
        updateCurrentTransform({ color: newColor });
    }, [updateCurrentTransform]);
    
    const setEmojiType = useCallback((newType: EmojiType) => {
        _setEmojiType(newType);
        // Clear multi-selections when switching mode
        clearSelectedParts();
    }, [clearSelectedParts]);
    
    const setSelectedEmojiPart = useCallback((part: EmojiPartType) => {
        _setSelectedEmojiPart(part);
        
        // In single selection mode, update the current part
        if (!isMultiSelectMode) {
            clearSelectedParts();
        }
    }, [isMultiSelectMode, clearSelectedParts]);
    
    const setSelectedEmojiModel = useCallback((part: EmojiPartType, modelId: ModelIdType | null) => {
        _setSelectedEmojiModels(prev => {
            // In multi-select mode, don't toggle - just update the model
            if (isMultiSelectMode) {
                return {
                    ...prev,
                    [part]: modelId
                };
            }
            
            // In single-select mode, toggle behavior
            if (prev[part] === modelId) {
                return {
                    ...prev,
                    [part]: null
                };
            }
            return {
                ...prev,
                [part]: modelId
            };
        });
    }, [isMultiSelectMode]);
    
    const setSelectedStickerPart = useCallback((part: StickerPartType) => {
        _setSelectedStickerPart(part);
        // Set default subcategory when changing part
        _setSelectedStickerSubcategory(subcategories[part][0]);
        
        // In single selection mode, update the current part
        if (!isMultiSelectMode) {
            clearSelectedParts();
        }
    }, [isMultiSelectMode, clearSelectedParts]);
    
    const setSelectedStickerSubcategory = useCallback((subcategory: StickerSubcategoryType) => {
        _setSelectedStickerSubcategory(subcategory);
        
        // In single selection mode, update the current subcategory
        if (!isMultiSelectMode) {
            clearSelectedParts();
        }
    }, [isMultiSelectMode, clearSelectedParts]);
    
    const setSelectedStickerModel = useCallback((part: StickerPartType, subcategory: StickerSubcategoryType, modelId: ModelIdType | null) => {
        _setSelectedStickerModels(prev => {
            // In multi-select mode, don't toggle - just update the model
            if (isMultiSelectMode) {
                return {
                    ...prev,
                    [part]: {
                        ...prev[part],
                        [subcategory]: modelId
                    }
                };
            }
            
            // In single-select mode, toggle behavior
            if (prev[part]?.[subcategory] === modelId) {
                return {
                    ...prev,
                    [part]: {
                        ...prev[part],
                        [subcategory]: null
                    }
                };
            }
            return {
                ...prev,
                [part]: {
                    ...prev[part],
                    [subcategory]: modelId
                }
            };
        });
    }, [isMultiSelectMode]);
    
    // Legacy setter for backward compatibility
    const setSelectedHeadModel = useCallback((modelId: ModelIdType) => {
        setSelectedEmojiModel('head', modelId);
    }, [setSelectedEmojiModel]);

    // Get current transform values for the provider
    const currentTransform = getCurrentTransform();

    const value = {
        position: currentTransform.position,
        setPosition,
        rotation: currentTransform.rotation,
        setRotation,
        size: currentTransform.size,
        setSize,
        color: currentTransform.color,
        setColor,
        
        // Multi-select mode
        isMultiSelectMode,
        toggleMultiSelectMode,
        selectedParts,
        togglePartSelection,
        removePartSelection,
        clearSelectedParts,
        isPartSelected,
        
        emojiType,
        setEmojiType,
        selectedEmojiPart,
        setSelectedEmojiPart,
        selectedEmojiModels,
        setSelectedEmojiModel,
        selectedStickerPart,
        setSelectedStickerPart,
        selectedStickerSubcategory,
        setSelectedStickerSubcategory,
        selectedStickerModels,
        setSelectedStickerModel,
        getTransform,
        // Legacy props for backward compatibility
        selectedHeadModel: selectedEmojiModels.head || 'default',
        setSelectedHeadModel
    };

    return (
        <EmojiCustomizationContext.Provider value={value}>
            {children}
        </EmojiCustomizationContext.Provider>
    );
};