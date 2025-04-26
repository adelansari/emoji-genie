import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { ModelIdType } from '../data/modelTypes';
import { EmojiPartType } from '../data/emoji/emojiModels';
import { StickerPartType } from '../data/sticker/stickerModels';

export type EmojiType = 'emoji' | 'sticker';

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
    const [position, _setPosition] = useState({ x: 300, y: 300 });
    const [rotation, _setRotation] = useState(0);
    const [size, _setSize] = useState({ x: 200, y: 200 }); 
    const [color, _setColor] = useState("#FFFFFF");
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
        face: null,
        eyes: null,
        hair: null,
        others: null
    });

    // Memoized setters
    const setPosition = useCallback((newPosition: { x: number; y: number }) => {
        _setPosition(newPosition);
    }, []);

    const setRotation = useCallback((newRotation: number) => {
        _setRotation(newRotation);
    }, []);

    const setSize = useCallback((newSize: { x: number; y: number }) => {
        _setSize(newSize);
    }, []);

    const setColor = useCallback((newColor: string) => {
        _setColor(newColor);
    }, []);
    
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

    const value = {
        position,
        setPosition,
        rotation,
        setRotation,
        size,
        setSize,
        color,
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