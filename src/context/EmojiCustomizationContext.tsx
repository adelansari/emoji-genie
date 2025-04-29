import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { ModelIdType } from '../data/modelTypes';
import { EmojiPartType } from '../data/emoji/emojiModels';
import { StickerPartType, StickerSubcategoryType, subcategories } from '../data/sticker/stickerModels';

export type EmojiType = 'emoji' | 'sticker';

interface Transform {
    position: { x: number; y: number };
    rotation: number;
    size: { x: number; y: number };
    color: string;
}

// Use relative positioning (0.5, 0.5) for the center instead of fixed values
// The actual pixel values will be calculated in the canvas components
const defaultTransform: Transform = {
    position: { x: 0.5, y: 0.5 }, // Center position as a ratio (0.5, 0.5 = center)
    rotation: 0,
    size: { x: 200, y: 200 },
    color: "#FFFFFF" 
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
    const updateCurrentTransform = useCallback((updates: Partial<Transform>) => {
        const currentMode = emojiType;
        const { part, subcategory } = getCurrentPartAndSubcategory();
        
        setTransforms(prev => {
            // Ensure nested structure exists
            const currentModeTransforms = prev[currentMode] || {};
            const currentPartTransforms = currentModeTransforms[part] || {};
            
            return {
                ...prev,
                [currentMode]: {
                    ...currentModeTransforms,
                    [part]: {
                        ...currentPartTransforms,
                        [subcategory]: {
                            ...((currentPartTransforms[subcategory] || defaultTransform)),
                            ...updates
                        }
                    }
                }
            };
        });
    }, [emojiType, getCurrentPartAndSubcategory]);

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
    }, []);
    
    const setSelectedEmojiPart = useCallback((part: EmojiPartType) => {
        _setSelectedEmojiPart(part);
    }, []);
    
    const setSelectedEmojiModel = useCallback((part: EmojiPartType, modelId: ModelIdType | null) => {
        _setSelectedEmojiModels(prev => ({
            ...prev,
            [part]: modelId
        }));
    }, []);
    
    const setSelectedStickerPart = useCallback((part: StickerPartType) => {
        _setSelectedStickerPart(part);
        // Set default subcategory when changing part
        _setSelectedStickerSubcategory(subcategories[part][0]);
    }, []);
    
    const setSelectedStickerSubcategory = useCallback((subcategory: StickerSubcategoryType) => {
        _setSelectedStickerSubcategory(subcategory);
    }, []);
    
    const setSelectedStickerModel = useCallback((part: StickerPartType, subcategory: StickerSubcategoryType, modelId: ModelIdType | null) => {
        _setSelectedStickerModels(prev => ({
            ...prev,
            [part]: {
                ...prev[part],
                [subcategory]: modelId
            }
        }));
    }, []);
    
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