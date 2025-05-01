import { useCallback, memo } from "react";
import { ChromePicker, TwitterPicker, ColorResult } from 'react-color';
import { useEmojiCustomization } from "../../context/EmojiCustomizationContext";
import TouchEventWrapper from "./TouchEventWrapper";

function ColorPickerComponent() {
  const { color, setColor } = useEmojiCustomization();

  const handleChangeComplete = useCallback((colorResult: ColorResult) => {
    setColor(colorResult.hex);
  }, [setColor]);

  const handleChange = useCallback((colorResult: ColorResult) => {
    setColor(colorResult.hex);
  }, [setColor]);

  return (
    <div className="bg-gray-700/50 rounded-lg flex flex-col items-center">
      <TouchEventWrapper className="chrome-picker-wrapper w-full">
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
      </TouchEventWrapper>
      <TouchEventWrapper>
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
      </TouchEventWrapper>
    </div>
  );
}

export default memo(ColorPickerComponent);