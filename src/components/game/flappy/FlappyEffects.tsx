import { FC, useEffect, useState, memo } from 'react';
import { Group, Circle } from 'react-konva';
import Konva from 'konva';
import { EFFECTS } from './config';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

interface FlappyEffectsProps {
  active: boolean;
  x: number;
  y: number;
  onComplete?: () => void;
}

const FlappyEffects: FC<FlappyEffectsProps> = ({ active, x, y, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animation, setAnimation] = useState<Konva.Animation | null>(null);
  
  // Create particles when effect is activated
  useEffect(() => {
    if (active) {
      // Create new particles
      const newParticles: Particle[] = [];
      const { particleCount, colors, size, speed } = EFFECTS.death;
      
      for (let i = 0; i < particleCount; i++) {
        // Random angle in radians (0 to 2π)
        const angle = Math.random() * Math.PI * 2;
        // Random speed between min and max
        const particleSpeed = speed.min + Math.random() * (speed.max - speed.min);
        // Convert angle and speed to velocity components
        const vx = Math.cos(angle) * particleSpeed;
        const vy = Math.sin(angle) * particleSpeed;
        
        newParticles.push({
          id: i,
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          radius: size.min + Math.random() * (size.max - size.min),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1
        });
      }
      
      setParticles(newParticles);
      
      // Auto-cleanup after effect duration
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, EFFECTS.death.duration);
      
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, x, y, onComplete]);
  
  // Animation for particles
  useEffect(() => {
    if (particles.length > 0) {
      const anim = new Konva.Animation((frame) => {
        if (!frame || !frame.timeDiff) return;
        
        const timeDiff = frame.timeDiff / 1000; // Convert to seconds
        const decayRate = 1.5; // Opacity decay rate
        
        setParticles(prevParticles => 
          prevParticles
            .map(particle => {
              // Apply gravity
              const gravity = 0.5;
              
              return {
                ...particle,
                x: particle.x + particle.vx,
                y: particle.y + particle.vy + gravity,
                opacity: Math.max(0, particle.opacity - decayRate * timeDiff)
              };
            })
            .filter(particle => particle.opacity > 0)
        );
        
        // Stop animation when all particles are gone
        if (particles.length === 0) {
          anim.stop();
          setAnimation(null);
        }
        
        return true;
      });
      
      anim.start();
      setAnimation(anim);
      
      // Cleanup
      return () => {
        anim.stop();
        setAnimation(null);
      };
    }
  }, [particles.length]);
  
  if (!active && particles.length === 0) {
    return null;
  }
  
  return (
    <Group>
      {particles.map((particle) => (
        <Circle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          radius={particle.radius}
          fill={particle.color}
          opacity={particle.opacity}
        />
      ))}
    </Group>
  );
};

export default memo(FlappyEffects);