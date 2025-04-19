type SizeSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function SizeSlider({ value, onChange }: SizeSliderProps) {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Size</h3>
      <input
        type="range"
        min="50"
        max="200"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
      />
      <p className="text-center mt-2">{value}%</p>
    </div>
  );
}
