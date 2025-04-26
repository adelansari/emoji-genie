import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { ModelIdType } from '../data/modelTypes';
import { EmojiPartType } from '../data/emoji/emojiModels';
import { StickerPartType } from '../data/sticker/stickerModels';

export type EmojiType = 'emoji' | 'sticker';

interface Transform {
    position: { x: number; y: number };
    rotation: number;
    size: { x: number; y: number };
    color: string;
}

const defaultTransform: Transform = {
    position: { x: 300, y: 300 },
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
    selectedStickerModels: Record<StickerPartType, ModelIdType | null>;
    setSelectedStickerModel: (part: StickerPartType, modelId: ModelIdType | null) => void;
    
    // Get transforms for specific part types
    getTransform: (mode: EmojiType, part: string) => Transform;
    
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
    const [emojiType, _setEmojiType] = useState<EmojiType>("emoji");
    
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
    const [selectedStickerModels, _setSelectedStickerModels] = useState<Record<StickerPartType, ModelIdType | null>>({
        face: 'shape01',
        eyes: null,
        hair: null,
        others: null
    });
    
    // Store transforms by mode and part type
    // Using a map structure: transforms[mode][partType] = { position, rotation, size, color }
    const [transforms, setTransforms] = useState<Record<EmojiType, Record<string, Transform>>>({
        emoji: {
            head: { ...defaultTransform },
            hat: { ...defaultTransform },
            eyes: { ...defaultTransform },
            mouth: { ...defaultTransform }
        },
        sticker: {
            face: { ...defaultTransform },
            eyes: { ...defaultTransform },
            hair: { ...defaultTransform },
            others: { ...defaultTransform }
        }
    });

    // Helper to get current active part based on mode
    const getCurrentPart = useCallback(() => {
        return emojiType === 'emoji' ? selectedEmojiPart : selectedStickerPart;
    }, [emojiType, selectedEmojiPart, selectedStickerPart]);

    // Get transform for a specific mode and part
    const getTransform = useCallback((mode: EmojiType, part: string) => {
        return transforms[mode][part] || defaultTransform;
    }, [transforms]);
    
    // Get current active transform
    const getCurrentTransform = useCallback(() => {
        const currentMode = emojiType;
        const currentPart = getCurrentPart();
        return getTransform(currentMode, currentPart);
    }, [emojiType, getCurrentPart, getTransform]);

    // Update transform for current active part
    const updateCurrentTransform = useCallback((updates: Partial<Transform>) => {
        const currentMode = emojiType;
        const currentPart = getCurrentPart();
        
        setTransforms(prev => ({
            ...prev,
            [currentMode]: {
                ...prev[currentMode],
                [currentPart]: {
                    ...prev[currentMode][currentPart],
                    ...updates
                }
            }
        }));
    }, [emojiType, getCurrentPart]);

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
    }, []);
    
    const setSelectedStickerModel = useCallback((part: StickerPartType, modelId: ModelIdType | null) => {
        _setSelectedStickerModels(prev => ({
            ...prev,
            [part]: modelId
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