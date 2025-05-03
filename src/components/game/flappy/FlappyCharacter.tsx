import { FC, memo } from 'react';
import { Group, Circle, Rect, Image } from 'react-konva';

interface FlappyCharacterProps {
  x: number;
  y: number;
  size: number;
  rotation: number;
  emojiType: string;
  characterImage: HTMLImageElement | null;
  characterColor: string;
}

const FlappyCharacter: FC<FlappyCharacterProps> = ({ 
  x, 
  y, 
  size, 
  rotation,
  emojiType, 
  characterImage, 
  characterColor 
}) => {
  const charHalfSize = size / 2;
  const eyeRadius = size * 0.08;
  const eyeOffsetX = size * 0.18;
  const eyeOffsetY = -size * 0.1;
  
  // Render character based on type and available image
  if (characterImage) {
    const aspectRatio = characterImage.height / characterImage.width;
    const imgWidth = size;
    const imgHeight = imgWidth * aspectRatio;
    
    return (
      <Group x={x} y={y} rotation={rotation}>
        <Image
          image={characterImage}
          width={imgWidth}
          height={imgHeight}
          offsetX={imgWidth / 2}
          offsetY={imgHeight / 2}
        />
      </Group>
    );
  }
  
  return (
    <Group x={x} y={y} rotation={rotation}>
      {emojiType === 'emoji' ? (
        <>
          <Circle
            radius={charHalfSize}
            fill={characterColor}
            stroke="#333"
            strokeWidth={2}
          />
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle y={size * 0.15} radius={size * 0.2} fill="#333" />
          <Circle y={size * 0.1} radius={size * 0.2} fill={characterColor} />
        </>
      ) : (
        <>
          <Rect
            width={size}
            height={size}
            offsetX={charHalfSize}
            offsetY={charHalfSize}
            fill={characterColor}
            cornerRadius={size * 0.1}
            stroke="#333"
            strokeWidth={2}
          />
          <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
          <Rect
            x={-size * 0.2}
            y={size * 0.15}
            width={size * 0.4}
            height={size * 0.1}
            fill="#333"
            cornerRadius={size * 0.02}
          />
        </>
      )}
    </Group>
  );
};

export default memo(FlappyCharacter);