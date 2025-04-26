import { memo, useState, useEffect, useCallback } from "react";
import { Lock, Unlock, RotateCcw } from 'lucide-react';

interface SizeControlSimpleProps {
    size: { x: number; y: number };
    setSize: (size: { x: number; y: number }) => void;
    minSize?: number;
    maxSize?: number;
}
const SizeControlSimpleComponent = ({ size, setSize, minSize = 1, maxSize = 500 }: SizeControlSimpleProps) => {
    const sizeX = size.x;
    const sizeY = size.y;

    const [isLocked, setIsLocked] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(sizeY !== 0 ? sizeX / sizeY : 1);

    useEffect(() => {
        if (!isLocked && sizeY !== 0) {
            setAspectRatio(sizeX / sizeY);
        }
    }, [sizeX, sizeY, isLocked]);

    const handleXChange = useCallback((newX: number) => {
        if (isLocked) {
            const newY = aspectRatio !== 0 ? Math.round(newX / aspectRatio) : sizeY;
            const clampedY = Math.max(minSize, Math.min(maxSize, newY));
            if (newY >= minSize && newY <= maxSize) {
                setSize({ x: newX, y: clampedY });
            } else {
                const limitedX = Math.round(clampedY * aspectRatio);
                setSize({ x: Math.max(minSize, Math.min(maxSize, limitedX)), y: clampedY });
            }
        } else {
            setSize({ x: newX, y: sizeY });
        }
    }, [isLocked, aspectRatio, sizeY, minSize, maxSize, setSize]);

    const handleYChange = useCallback((newY: number) => {
        if (isLocked) {
            const newX = Math.round(newY * aspectRatio);
            const clampedX = Math.max(minSize, Math.min(maxSize, newX));
            if (newX >= minSize && newX <= maxSize) {
                setSize({ x: clampedX, y: newY });
            } else {
                const limitedY = aspectRatio !== 0 ? Math.round(clampedX / aspectRatio) : sizeY;
                setSize({ x: clampedX, y: Math.max(minSize, Math.min(maxSize, limitedY)) });
            }
        } else {
            setSize({ x: sizeX, y: newY });
        }
    }, [isLocked, aspectRatio, sizeX, sizeY, minSize, maxSize, setSize]);

    const toggleLock = useCallback(() => {
        const nextLockedState = !isLocked;
        setIsLocked(nextLockedState);
        if (nextLockedState && sizeY !== 0) {
            setAspectRatio(sizeX / sizeY);
        }
    }, [isLocked, sizeX, sizeY]);

    const handleReset = useCallback(() => {
        setSize({ x: 100, y: 100 });
    }, [setSize]);

    const handleXInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleXChange(Number(e.target.value));
    }, [handleXChange]);

    const handleYInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleYChange(Number(e.target.value));
    }, [handleYChange]);

    const sliderClass = "w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50";
    const baseButtonClass = "p-1.5 rounded transition-colors duration-150 ease-in-out border";
    const lockButtonClass = `${baseButtonClass} ${isLocked ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-300 hover:text-white'}`;
    const resetButtonClass = `${baseButtonClass} bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-300 hover:text-white`;

    return (
        <div className="p-4 py-13 bg-gray-700/50 rounded-lg flex flex-col items-center gap-6">
            <div className="w-full flex justify-between items-center">
                <h3 className="text-lg font-semibold text-yellow-300">Size</h3>
                <div className="flex items-center gap-1">
                    <button onClick={toggleLock} className={lockButtonClass} title={isLocked ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}>
                        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button onClick={handleReset} className={resetButtonClass} title="Reset Size to 100%">
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
            <div className="w-full flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <label htmlFor="sizeXSliderSimple" className="font-medium text-sm w-4 text-gray-300">X:</label>
                    <input
                        id="sizeXSliderSimple"
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={sizeX}
                        onChange={handleXInputChange}
                        className={sliderClass}
                        aria-label="X Size"
                    />
                    <span className="text-sm w-10 text-right text-gray-300">{sizeX}%</span>
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="sizeYSliderSimple" className="font-medium text-sm w-4 text-gray-300">Y:</label>
                    <input
                        id="sizeYSliderSimple"
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={sizeY}
                        onChange={handleYInputChange}
                        className={sliderClass}
                        aria-label="Y Size"
                    />
                    <span className="text-sm w-10 text-right text-gray-300">{sizeY}%</span>
                </div>
            </div>
        </div>
    );
};

export default memo(SizeControlSimpleComponent);
