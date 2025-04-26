import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { HeadShapeType } from '../data/headModels';

interface EmojiCustomizationContextType {
    position: { x: number; y: number };
    setPosition: (pos: { x: number; y: number }) => void;
    rotation: number;
    setRotation: (rot: number) => void;
    size: { x: number; y: number };
    setSize: (size: { x: number; y: number }) => void;
    selectedHeadModel: HeadShapeType;
    setSelectedHeadModel: (model: HeadShapeType) => void;
    color: string;
    setColor: (color: string) => void;
}

// Create the context with a default value (can be null or a default state)
// Using '!' asserts that the context will be provided. Handle potential null if needed.
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
    const [size, _setSize] = useState({ x: 200, y: 200 }); // Initial size adjusted for example
    const [selectedHeadModel, _setSelectedHeadModel] = useState<HeadShapeType>("default");
    const [color, _setColor] = useState("#FFFFFF");

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

    const setSelectedHeadModel = useCallback((newModel: HeadShapeType) => {
        _setSelectedHeadModel(newModel);
    }, []);

    const setColor = useCallback((newColor: string) => {
        _setColor(newColor);
    }, []);

    const value = {
        position,
        setPosition,
        rotation,
        setRotation,
        size,
        setSize,
        selectedHeadModel,
        setSelectedHeadModel,
        color,
        setColor,
    };

    return (
        <EmojiCustomizationContext.Provider value={value}>
            {children}
        </EmojiCustomizationContext.Provider>
    );
};