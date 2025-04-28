import { useEmojiCustomization } from "../context/EmojiCustomizationContext";
import EmojiCustomizationMenu from "./emoji/EmojiCustomizationMenu";
import StickerCustomizationMenu from "./sticker/StickerCustomizationMenu";
import EmojiCanvas from "./emoji/EmojiCanvas";
import StickerCanvas from "./sticker/StickerCanvas";

/**
 * ModeSwitcher is a container component that renders different UI components
 * based on whether the user is in 'emoji' or 'sticker' mode.
 */
export function CustomizationMenuSwitcher() {
  const { emojiType } = useEmojiCustomization();
  
  return emojiType === 'emoji' 
    ? <EmojiCustomizationMenu /> 
    : <StickerCustomizationMenu />;
}

/**
 * CanvasSwitcher renders the appropriate canvas based on the selected mode
 */
export function CanvasSwitcher() {
  const { emojiType } = useEmojiCustomization();
  
  return emojiType === 'emoji' 
    ? <EmojiCanvas /> 
    : <StickerCanvas />;
}