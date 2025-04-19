
import { ColorResult, ChromePicker, TwitterPicker } from 'react-color';
type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const handleChangeComplete = (color: ColorResult) => {
    onChange(color.hex);
  };

  const handleChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <div className="bg-gray-700/50 rounded-lg flex flex-col items-center">
      <div className="chrome-picker-wrapper w-full">
        <ChromePicker
          color={value}
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
          disableAlpha={true}
          styles={{
            default: {
              picker: {
                width: '100%',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                color: "white",
              },
              saturation: {
                width: '100%',
                paddingBottom: '30%',
                position: 'relative',
                overflow: 'hidden',
              },
            },
          }}
        />
      </div>
      <TwitterPicker
        color={value}
        onChangeComplete={handleChangeComplete}
        triangle='hide'
        styles={{
          default: {
            card: {
              width: '100%',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: "white",
              marginTop: '-10px',
            },
            input: {
              backgroundColor: 'white',
              opacity: 0.7,
              color: 'black',
              height: '30px',
            },
          },
        }}
      />
    </div>
  );
}
