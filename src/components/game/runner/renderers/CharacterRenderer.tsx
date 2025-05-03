import { memo, useEffect, useState, useRef } from 'react';
import { Group, Circle, Rect, Image } from 'react-konva';
import { CHARACTER_SIZE } from '../engine/RunnerGameEngine';

interface CharacterRendererProps {
  x: number;
  y: number;
  isJumping: boolean;
  emojiType: 'emoji' | 'sticker';
  characterImageUrl: string | null;
}

const CharacterRenderer = ({ x, y, isJumping, emojiType, characterImageUrl }: CharacterRendererProps) => {
  const [characterImage, setCharacterImage] = useState<HTMLImageElement | null>(null);
  const [runningFrame, setRunningFrame] = useState(0);
  const frameIntervalRef = useRef<number | null>(null);
  
  // Load custom character image if available
  useEffect(() => {
    if (characterImageUrl) {
      const img = new window.Image();
      img.src = characterImageUrl;
      img.onload = () => setCharacterImage(img);
      img.onerror = () => {
        console.error("Failed to load character image.");
        setCharacterImage(null);
      };
    } else {
      setCharacterImage(null);
    }
  }, [characterImageUrl]);
  
  // Running animation - cycles through frames when not jumping
  useEffect(() => {
    // If jumping, freeze animation
    if (isJumping) {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      return;
    }
    
    // Start running animation when on ground
    if (!frameIntervalRef.current) {
      const intervalId = window.setInterval(() => {
        setRunningFrame(prev => (prev + 1) % 4); // 4 frames of running animation
      }, 120); // Animation speed
      
      frameIntervalRef.current = intervalId;
    }
    
    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isJumping]);

  // Default character color based on emoji type
  const characterColor = emojiType === 'emoji' ? '#FACC15' : '#FF6B6B';
  
  const charSize = CHARACTER_SIZE;
  const charHalfSize = charSize / 2;
  
  // Calculate the leg positions based on running frame
  const getLegPositions = () => {
    if (isJumping) {
      // Legs both back in jumping position
      return {
        leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: 30 },
        rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: 30 }
      };
    }
    
    // Running animation
    switch (runningFrame) {
      case 0: // Left forward, right back
        return {
          leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: -30 },
          rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: 30 }
        };
      case 1: // Both centered
        return {
          leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: 0 },
          rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: 0 }
        };
      case 2: // Left back, right forward
        return {
          leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: 30 },
          rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: -30 }
        };
      case 3: // Both centered
        return {
          leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: 0 },
          rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: 0 }
        };
      default:
        return {
          leftLeg: { x: -charSize * 0.15, y: charSize * 0.3, angle: 0 },
          rightLeg: { x: charSize * 0.15, y: charSize * 0.3, angle: 0 }
        };
    }
  };

  // If custom image is available, render it
  if (characterImage) {
    const aspectRatio = characterImage.height / characterImage.width;
    const imgWidth = charSize;
    const imgHeight = imgWidth * aspectRatio;
    
    return (
      <Group
        x={x}
        y={y}
        rotation={isJumping ? -15 : 0}
      >
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
  
  // Get leg positions based on animation frame
  const { leftLeg, rightLeg } = getLegPositions();
  
  // Default character rendering based on emoji type
  const eyeRadius = charSize * 0.08;
  const eyeOffsetX = charSize * 0.18;
  const eyeOffsetY = -charSize * 0.1;
  
  if (emojiType === 'emoji') {
    // Emoji (Circle) character
    return (
      <Group
        x={x}
        y={y}
        rotation={isJumping ? -15 : 0}
      >
        {/* Body */}
        <Circle
          radius={charHalfSize}
          fill={characterColor}
          stroke="#333"
          strokeWidth={2}
        />
        
        {/* Eyes */}
        <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
        <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
        
        {/* Mouth */}
        <Circle y={charSize * 0.15} radius={charSize * 0.2} fill="#333" />
        <Circle y={charSize * 0.1} radius={charSize * 0.2} fill={characterColor} />
        
        {/* Legs - animated during running */}
        <Rect
          x={leftLeg.x}
          y={leftLeg.y}
          width={charSize * 0.1}
          height={charSize * 0.4}
          fill="#333"
          rotation={leftLeg.angle}
          cornerRadius={3}
          offsetX={0}
          offsetY={0}
        />
        <Rect
          x={rightLeg.x}
          y={rightLeg.y}
          width={charSize * 0.1}
          height={charSize * 0.4}
          fill="#333"
          rotation={rightLeg.angle}
          cornerRadius={3}
          offsetX={0}
          offsetY={0}
        />
      </Group>
    );
  } else {
    // Sticker (Rounded Rect) character
    return (
      <Group
        x={x}
        y={y}
        rotation={isJumping ? -15 : 0}
      >
        {/* Body */}
        <Rect
          width={charSize}
          height={charSize}
          offsetX={charHalfSize}
          offsetY={charHalfSize}
          fill={characterColor}
          cornerRadius={charSize * 0.1}
          stroke="#333"
          strokeWidth={2}
        />
        
        {/* Eyes */}
        <Circle x={-eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
        <Circle x={eyeOffsetX} y={eyeOffsetY} radius={eyeRadius} fill="#333" />
        
        {/* Mouth */}
        <Rect
          x={-charSize * 0.2}
          y={charSize * 0.15}
          width={charSize * 0.4}
          height={charSize * 0.1}
          fill="#333"
          cornerRadius={charSize * 0.02}
        />
        
        {/* Legs - animated during running */}
        <Rect
          x={leftLeg.x}
          y={leftLeg.y}
          width={charSize * 0.1}
          height={charSize * 0.4}
          fill="#333"
          rotation={leftLeg.angle}
          cornerRadius={3}
          offsetX={0}
          offsetY={0}
        />
        <Rect
          x={rightLeg.x}
          y={rightLeg.y}
          width={charSize * 0.1}
          height={charSize * 0.4}
          fill="#333"
          rotation={rightLeg.angle}
          cornerRadius={3}
          offsetX={0}
          offsetY={0}
        />
      </Group>
    );
  }
};

export default memo(CharacterRenderer);