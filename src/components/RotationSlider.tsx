import { memo, useCallback } from 'react';
import { useEmojiCustomization } from "../context/EmojiCustomizationContext"; // Import the hook

function RotationSlider() {
  const { rotation, setRotation } = useEmojiCustomization();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(e.target.value));
  }, [setRotation]);

  return (
    <div className="p-4 bg-gray-700/50 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Rotation</h3>
      <input
        type="range"
        min="0"
        max="360"
        value={rotation}
        onChange={handleChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
      />
      <p className="text-center mt-2">{rotation}°</p>
    </div>
  );
}

export default memo(RotationSlider);
