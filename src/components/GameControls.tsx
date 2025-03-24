import React from 'react';

interface GameControlsProps {
  onStartGame: () => void;
  level: number;
  speed: number;
  onLevelChange: (level: number) => void;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  gameEnded?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStartGame,
  level,
  speed,
  onLevelChange,
  onSpeedChange,
  isRunning,
  gameEnded = false
}) => {
  return (
    <div className="game-controls">
      <button onClick={onStartGame}>
        {isRunning ? 'リスタート' : 'スタート'}
      </button>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="level">game level: </label>
        <input
          style={{ display: 'inline-block' }}
          type="number"
          max={20}
          min={0}
          value={level}
          id="level"
          onChange={(e) => onLevelChange(parseInt(e.target.value, 10) || 0)}
          disabled={isRunning && !gameEnded}
        />
        <label htmlFor="speed">speed level: </label>
        <input
          style={{ display: 'inline-block' }}
          type="number"
          max={6}
          min={0}
          value={speed}
          id="speed"
          onChange={(e) => onSpeedChange(parseInt(e.target.value, 10) || 0)}
          disabled={isRunning && !gameEnded}
        />
      </form>
    </div>
  );
};

export default GameControls;