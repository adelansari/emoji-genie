/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { HeadShapeType } from '../data/headModels';
import { EyeShapeType } from '../data/eyeModels';
import { MouthShapeType } from '../data/mouthModels';

interface EmojiCustomizationContextType {
    // Head transformations
    positionHead: { x: number; y: number };
    setPositionHead: (pos: { x: number; y: number }) => void;
    rotationHead: number;
    setRotationHead: (rot: number) => void;
    sizeHead: { x: number; y: number };
    setSizeHead: (size: { x: number; y: number }) => void;
    selectedHeadModel: HeadShapeType;
    setSelectedHeadModel: (model: HeadShapeType) => void;
    color: string; // head color
    setColor: (color: string) => void; // set head color
    // Left Eye transformations
    positionLeftEye: { x: number; y: number };
    setPositionLeftEye: (pos: { x: number; y: number }) => void;
    rotationLeftEye: number;
    setRotationLeftEye: (rot: number) => void;
    sizeLeftEye: { x: number; y: number };
    setSizeLeftEye: (size: { x: number; y: number }) => void;
    selectedLeftEyeModel: EyeShapeType;
    setSelectedLeftEyeModel: (model: EyeShapeType) => void;
    leftEyeColor: string;
    setLeftEyeColor: (color: string) => void;
    // Right Eye transformations
    positionRightEye: { x: number; y: number };
    setPositionRightEye: (pos: { x: number; y: number }) => void;
    rotationRightEye: number;
    setRotationRightEye: (rot: number) => void;
    sizeRightEye: { x: number; y: number };
    setSizeRightEye: (size: { x: number; y: number }) => void;
    selectedRightEyeModel: EyeShapeType;
    setSelectedRightEyeModel: (model: EyeShapeType) => void;
    rightEyeColor: string;
    setRightEyeColor: (color: string) => void;
    // Mouth transformations
    positionMouth: { x: number; y: number };
    setPositionMouth: (pos: { x: number; y: number }) => void;
    rotationMouth: number;
    setRotationMouth: (rot: number) => void;
    sizeMouth: { x: number; y: number };
    setSizeMouth: (size: { x: number; y: number }) => void;
    selectedMouthModel: MouthShapeType;
    setSelectedMouthModel: (model: MouthShapeType) => void;
    mouthColor: string;
    setMouthColor: (color: string) => void;
}

interface EmojiCustomizationProviderProps {
    children: ReactNode;
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

export const EmojiCustomizationProvider: React.FC<EmojiCustomizationProviderProps> = ({ children }) => {
    // Head
    const [positionHead, _setPositionHead] = useState({ x: 300, y: 300 });
    const [rotationHead, _setRotationHead] = useState(0);
    const [sizeHead, _setSizeHead] = useState({ x: 200, y: 200 });
    // Left Eye
    const [positionLeftEye, _setPositionLeftEye] = useState({ x: 262, y: 276 }); // centered on head with offset
    const [rotationLeftEye, _setRotationLeftEye] = useState(0);
    const [sizeLeftEye, _setSizeLeftEye] = useState({ x: 40, y: 40 });
    // Right Eye
    const [positionRightEye, _setPositionRightEye] = useState({ x: 338, y: 276 }); // centered on head with offset
    const [rotationRightEye, _setRotationRightEye] = useState(0);
    const [sizeRightEye, _setSizeRightEye] = useState({ x: 40, y: 40 });
    // Mouth
    const [positionMouth, _setPositionMouth] = useState({ x: 300, y: 344 }); // centered on head with offset
    const [rotationMouth, _setRotationMouth] = useState(0);
    const [sizeMouth, _setSizeMouth] = useState({ x: 150, y: 60 });
    const [selectedHeadModel, _setSelectedHeadModel] = useState<HeadShapeType>("default");
    const [color, _setColor] = useState("#FFFFFF"); // head color
    const [selectedLeftEyeModel, _setSelectedLeftEyeModel] = useState<EyeShapeType>("eye1");
    const [selectedRightEyeModel, _setSelectedRightEyeModel] = useState<EyeShapeType>("eye1");
    const [leftEyeColor, _setLeftEyeColor] = useState("#896024");
    const [rightEyeColor, _setRightEyeColor] = useState("#896024");
    const [selectedMouthModel, _setSelectedMouthModel] = useState<MouthShapeType>("mouth1");
    const [mouthColor, _setMouthColor] = useState("#FFFFFF");

    // Memoized setters for head
    const setPositionHead = useCallback((newPosition: { x: number; y: number }) => {
        _setPositionHead(newPosition);
    }, []);

    const setRotationHead = useCallback((newRotation: number) => {
        _setRotationHead(newRotation);
    }, []);

    const setSizeHead = useCallback((newSize: { x: number; y: number }) => {
        _setSizeHead(newSize);
    }, []);

    const setSelectedHeadModel = useCallback((newModel: HeadShapeType) => {
        _setSelectedHeadModel(newModel);
    }, []);

    const setColor = useCallback((newColor: string) => {
        _setColor(newColor);
    }, []);

    // Left Eye setters
    const setPositionLeftEye = useCallback((newPosition: { x: number; y: number }) => {
        _setPositionLeftEye(newPosition);
    }, []);

    const setRotationLeftEye = useCallback((newRotation: number) => {
        _setRotationLeftEye(newRotation);
    }, []);

    const setSizeLeftEye = useCallback((newSize: { x: number; y: number }) => {
        _setSizeLeftEye(newSize);
    }, []);

    const setSelectedLeftEyeModel = useCallback((newModel: EyeShapeType) => {
        _setSelectedLeftEyeModel(newModel);
    }, []);

    const setLeftEyeColor = useCallback((newColor: string) => {
        _setLeftEyeColor(newColor);
    }, []);

    // Right Eye setters
    const setPositionRightEye = useCallback((newPosition: { x: number; y: number }) => {
        _setPositionRightEye(newPosition);
    }, []);

    const setRotationRightEye = useCallback((newRotation: number) => {
        _setRotationRightEye(newRotation);
    }, []);

    const setSizeRightEye = useCallback((newSize: { x: number; y: number }) => {
        _setSizeRightEye(newSize);
    }, []);

    const setSelectedRightEyeModel = useCallback((newModel: EyeShapeType) => {
        _setSelectedRightEyeModel(newModel);
    }, []);

    const setRightEyeColor = useCallback((newColor: string) => {
        _setRightEyeColor(newColor);
    }, []);

    // Mouth setters
    const setPositionMouth = useCallback((newPosition: { x: number; y: number }) => {
        _setPositionMouth(newPosition);
    }, []);

    const setRotationMouth = useCallback((newRotation: number) => {
        _setRotationMouth(newRotation);
    }, []);

    const setSizeMouth = useCallback((newSize: { x: number; y: number }) => {
        _setSizeMouth(newSize);
    }, []);

    const setSelectedMouthModel = useCallback((newModel: MouthShapeType) => {
        _setSelectedMouthModel(newModel);
    }, []);

    const setMouthColor = useCallback((newColor: string) => {
        _setMouthColor(newColor);
    }, []);

    const value = {
        positionHead,
        setPositionHead,
        rotationHead,
        setRotationHead,
        sizeHead,
        setSizeHead,
        selectedHeadModel,
        setSelectedHeadModel,
        color,
        setColor,
        positionLeftEye,
        setPositionLeftEye,
        rotationLeftEye,
        setRotationLeftEye,
        sizeLeftEye,
        setSizeLeftEye,
        selectedLeftEyeModel,
        setSelectedLeftEyeModel,
        leftEyeColor,
        setLeftEyeColor,
        positionRightEye,
        setPositionRightEye,
        rotationRightEye,
        setRotationRightEye,
        sizeRightEye,
        setSizeRightEye,
        selectedRightEyeModel,
        setSelectedRightEyeModel,
        rightEyeColor,
        setRightEyeColor,
        positionMouth,
        setPositionMouth,
        rotationMouth,
        setRotationMouth,
        sizeMouth,
        setSizeMouth,
        selectedMouthModel,
        setSelectedMouthModel,
        mouthColor,
        setMouthColor,
    };

    return (
        <EmojiCustomizationContext.Provider value={value}>
            {children}
        </EmojiCustomizationContext.Provider>
    );
}