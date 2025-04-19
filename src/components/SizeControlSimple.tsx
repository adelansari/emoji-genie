import { useState, useEffect } from "react";
import { Lock, Unlock } from 'lucide-react';

type SizeControlSimpleProps = {
    sizeX: number;
    sizeY: number;
    onChange: (newSize: { x: number; y: number }) => void;
    minSize?: number;
    maxSize?: number;
};

const SizeControlSimple = ({
    sizeX,
    sizeY,
    onChange,
    minSize = 1,
    maxSize = 500,
}: SizeControlSimpleProps) => {
    const [isLocked, setIsLocked] = useState(true); // Start locked by default
    const [aspectRatio, setAspectRatio] = useState(sizeY !== 0 ? sizeX / sizeY : 1);

    // Update aspect ratio when size changes *only if unlocked*
    useEffect(() => {
        if (!isLocked && sizeY !== 0) {
            setAspectRatio(sizeX / sizeY);
        }
        // If locked, the ratio used is the one stored when it was last unlocked or initialized
    }, [sizeX, sizeY, isLocked]);

    const handleXChange = (newX: number) => {
        if (isLocked) {
            const newY = aspectRatio !== 0 ? Math.round(newX / aspectRatio) : sizeY;
            const clampedY = Math.max(minSize, Math.min(maxSize, newY));
            // Ensure we don't exceed bounds when calculating linked value
            if (newY >= minSize && newY <= maxSize) {
                onChange({ x: newX, y: clampedY });
            } else {
                // If linked Y is out of bounds, only update X up to the limit allowed by Y's bounds
                const limitedX = Math.round(clampedY * aspectRatio);
                onChange({ x: Math.max(minSize, Math.min(maxSize, limitedX)), y: clampedY });
            }
        } else {
            onChange({ x: newX, y: sizeY });
        }
    };

    const handleYChange = (newY: number) => {
        if (isLocked) {
            const newX = Math.round(newY * aspectRatio);
            const clampedX = Math.max(minSize, Math.min(maxSize, newX));
            // Ensure we don't exceed bounds when calculating linked value
            if (newX >= minSize && newX <= maxSize) {
                onChange({ x: clampedX, y: newY });
            } else {
                // If linked X is out of bounds, only update Y up to the limit allowed by X's bounds
                const limitedY = aspectRatio !== 0 ? Math.round(clampedX / aspectRatio) : sizeY;
                onChange({ x: clampedX, y: Math.max(minSize, Math.min(maxSize, limitedY)) });
            }
        } else {
            onChange({ x: sizeX, y: newY });
        }
    };

    const toggleLock = () => {
        const nextLockedState = !isLocked;
        setIsLocked(nextLockedState);
        // When locking, recalculate and store the current aspect ratio
        if (nextLockedState && sizeY !== 0) {
            setAspectRatio(sizeX / sizeY);
        }
    };

    const sliderClass = "w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50";
    const buttonClass = `p-1.5 rounded transition-colors duration-150 ease-in-out border ${isLocked ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-300 hover:text-white'}`;

    return (
        <div className="p-4 bg-gray-700/50 rounded-lg mt-4 flex flex-col items-center gap-4">
            <div className="w-full flex justify-between items-center">
                <h3 className="text-lg font-semibold text-yellow-300">Size</h3>
                <button onClick={toggleLock} className={buttonClass} title={isLocked ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}>
                    {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
            </div>
            <div className="w-full flex flex-col gap-3">
                {/* X Slider */}
                <div className="flex items-center gap-3">
                    <label htmlFor="sizeXSliderSimple" className="font-medium text-sm w-4 text-gray-300">X:</label>
                    <input
                        id="sizeXSliderSimple"
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={sizeX}
                        onChange={(e) => handleXChange(Number(e.target.value))}
                        className={sliderClass}
                        aria-label="X Size"
                    />
                    <span className="text-sm w-10 text-right text-gray-300">{sizeX}%</span>
                </div>
                {/* Y Slider */}
                <div className="flex items-center gap-3">
                    <label htmlFor="sizeYSliderSimple" className="font-medium text-sm w-4 text-gray-300">Y:</label>
                    <input
                        id="sizeYSliderSimple"
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={sizeY}
                        onChange={(e) => handleYChange(Number(e.target.value))}
                        className={sliderClass}
                        aria-label="Y Size"
                    />
                    <span className="text-sm w-10 text-right text-gray-300">{sizeY}%</span>
                </div>
            </div>
        </div>
    );
};

export default SizeControlSimple;
