import React, { useRef, useEffect, useState } from 'react';
import { Field } from '../gameLogic/Field';

interface GameCanvasProps {
  level: number;
  speed: number;
  isRunning: boolean;
  onGameOver: () => void;
  onGameClear: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  level, 
  speed, 
  isRunning, 
  onGameOver, 
  onGameClear 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameField, setGameField] = useState<Field | null>(null);
  
  // Initialize or reset game field when isRunning changes
  useEffect(() => {
    if (isRunning && canvasRef.current) {
      const field = new Field(canvasRef.current, level, speed, onGameOver, onGameClear);
      setGameField(field);
      
      return () => {
        field.cleanup();
      };
    } else if (!isRunning && gameField) {
      gameField.cleanup();
      setGameField(null);
    }
  }, [isRunning, level, speed, onGameOver, onGameClear]);

  return (
    <canvas 
      ref={canvasRef} 
      width={360} 
      height={810} 
    />
  );
};

export default GameCanvas;