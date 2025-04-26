import { memo, useCallback } from 'react';

type RotationSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

function RotationSlider({ value, onChange }: RotationSliderProps) {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  return (
    <div className="p-4 bg-gray-700/50 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Rotation</h3>
      <input
        type="range"
        min="0"
        max="360"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
      />
      <p className="text-center mt-2">{value}°</p>
    </div>
  );
}

export default memo(RotationSlider);
