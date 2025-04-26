import { ColorResult, ChromePicker, TwitterPicker } from 'react-color';
import { useCallback, memo } from 'react';
// Props for controlled color picker
interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

function ColorPickerComponent({ color, setColor }: ColorPickerProps) {
  const handleChangeComplete = useCallback((colorResult: ColorResult) => {
    setColor(colorResult.hex);
  }, [setColor]);

  const handleChange = useCallback((colorResult: ColorResult) => {
    setColor(colorResult.hex);
  }, [setColor]);

  return (
    <div className="bg-gray-700/50 rounded-lg flex flex-col items-center">
      <div className="chrome-picker-wrapper w-full">
        <ChromePicker
          color={color}
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
        color={color}
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

export default memo(ColorPickerComponent);
