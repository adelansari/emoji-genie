type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg mt-4 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 text-yellow-300">Color</h3>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 h-10 p-1 bg-gray-600 border border-gray-500 rounded cursor-pointer"
      />
      <p className="text-center mt-2">{value}</p>
    </div>
  );
}
