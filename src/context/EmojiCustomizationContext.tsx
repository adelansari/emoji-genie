/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { HeadShapeType } from '../data/headModels';
import { EyeShapeType } from '../data/eyeModels';

interface EmojiCustomizationContextType {
    position: { x: number; y: number };
    setPosition: (pos: { x: number; y: number }) => void;
    rotation: number;
    setRotation: (rot: number) => void;
    size: { x: number; y: number };
    setSize: (size: { x: number; y: number }) => void;
    selectedHeadModel: HeadShapeType;
    setSelectedHeadModel: (model: HeadShapeType) => void;
    color: string; // head color
    setColor: (color: string) => void; // set head color
    selectedLeftEyeModel: EyeShapeType;
    setSelectedLeftEyeModel: (model: EyeShapeType) => void;
    selectedRightEyeModel: EyeShapeType;
    setSelectedRightEyeModel: (model: EyeShapeType) => void;
    leftEyeColor: string;
    setLeftEyeColor: (color: string) => void;
    rightEyeColor: string;
    setRightEyeColor: (color: string) => void;
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
    const [color, _setColor] = useState("#FFFFFF"); // head color
    const [selectedLeftEyeModel, _setSelectedLeftEyeModel] = useState<EyeShapeType>("eye1");
    const [selectedRightEyeModel, _setSelectedRightEyeModel] = useState<EyeShapeType>("eye1");
    const [leftEyeColor, _setLeftEyeColor] = useState("#FFFFFF");
    const [rightEyeColor, _setRightEyeColor] = useState("#FFFFFF");

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
    const setSelectedLeftEyeModel = useCallback((newModel: EyeShapeType) => {
        _setSelectedLeftEyeModel(newModel);
    }, []);
    const setSelectedRightEyeModel = useCallback((newModel: EyeShapeType) => {
        _setSelectedRightEyeModel(newModel);
    }, []);
    const setLeftEyeColor = useCallback((newColor: string) => {
        _setLeftEyeColor(newColor);
    }, []);
    const setRightEyeColor = useCallback((newColor: string) => {
        _setRightEyeColor(newColor);
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
        selectedLeftEyeModel,
        setSelectedLeftEyeModel,
        selectedRightEyeModel,
        setSelectedRightEyeModel,
        leftEyeColor,
        setLeftEyeColor,
        rightEyeColor,
        setRightEyeColor,
    };

    return (
        <EmojiCustomizationContext.Provider value={value}>
            {children}
        </EmojiCustomizationContext.Provider>
    );
};