import { memo, useState } from 'react';
import { Smile, Sticker } from 'lucide-react';
import { useEmojiCustomization } from '../context/EmojiCustomizationContext';

interface TypeToggleSwitchProps {
  className?: string;
}

const TypeToggleSwitch = ({ className = '' }: TypeToggleSwitchProps) => {
  const { emojiType, setEmojiType } = useEmojiCustomization();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleType = () => {
    setEmojiType(emojiType === 'emoji' ? 'sticker' : 'emoji');
  };

  const isTooltipOnLeft = emojiType === 'sticker'; // If in sticker mode, tooltip will be on left (to switch to emoji)
  
  return (
    <div className={`inline-flex items-center relative ${className}`}>
      <button 
        onClick={toggleType}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-700 shadow-inner transition-all duration-300 focus:outline-none cursor-pointer hover:bg-gray-600"
        aria-pressed={emojiType === 'sticker'}
        aria-label="Toggle emoji type"
      >
        <span className="sr-only">
          {emojiType === 'emoji' ? 'Switch to sticker mode' : 'Switch to emoji mode'}
        </span>
        
        {/* The circle that slides from left to right */}
        <span 
          className={`absolute left-0 z-10 flex h-10 w-10 transform items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow transition-transform duration-300 ease-in-out ${
            emojiType === 'sticker' ? 'translate-x-10' : 'translate-x-0'
          }`}
        >
          {emojiType === 'emoji' ? 
            <Smile size={18} aria-hidden="true" /> : 
            <Sticker size={18} aria-hidden="true" />
          }
        </span>
        
        {/* Background icons - visible when not selected */}
        <span className="relative z-0 flex h-full w-full items-center justify-between px-2.5">
          <span 
            className={`flex items-center ${emojiType === 'emoji' ? 'invisible' : 'text-gray-300'}`}
            aria-hidden="true"
          >
            <Smile size={16} />
          </span>
          <span 
            className={`flex items-center ${emojiType === 'sticker' ? 'invisible' : 'text-gray-300'}`}
            aria-hidden="true"
          >
            <Sticker size={16} />
          </span>
        </span>
      </button>
      
      {/* Custom tooltip that appears on left or right side */}
      {showTooltip && (
        <div 
          className={`absolute top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg z-50 border border-gray-700 min-w-max ${
            isTooltipOnLeft 
              ? 'right-[calc(100%+10px)]' 
              : 'left-[calc(100%+10px)]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {emojiType === 'emoji' ? <Sticker size={14} className="text-yellow-400" /> : <Smile size={14} className="text-yellow-400" />}
            <span>Switch to {emojiType === 'emoji' ? 'Sticker' : 'Emoji'} mode</span>
          </div>
          <div 
            className={`absolute top-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800 ${
              isTooltipOnLeft
                ? 'right-[-4px] border-t border-r border-gray-700'
                : 'left-[-4px] border-l border-b border-gray-700' 
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default memo(TypeToggleSwitch);