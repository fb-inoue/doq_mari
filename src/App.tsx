import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';

const App: React.FC = () => {
  // ゲーム設定状態
  const [configLevel, setConfigLevel] = useState(0);
  const [configSpeed, setConfigSpeed] = useState(0);
  
  // ゲーム実行状態
  const [activeGame, setActiveGame] = useState<{
    level: number;
    speed: number;
    key: number;
    running: boolean;
  } | null>(null);

  // ゲーム状態
  const [gameEnded, setGameEnded] = useState(false);

  // ゲーム開始/リスタート処理
  const handleStartGame = useCallback(() => {
    setGameEnded(false);
    
    if (activeGame) {
      // リスタート：ゲームキーを更新して再マウント
      setActiveGame({
        level: configLevel,
        speed: configSpeed,
        key: activeGame.key + 1,
        running: true
      });
    } else {
      // 初回開始
      setActiveGame({
        level: configLevel, 
        speed: configSpeed,
        key: 1,
        running: true
      });
    }
  }, [configLevel, configSpeed, activeGame]);

  // ゲーム終了時のコールバック
  const handleGameOver = useCallback(() => {
    console.log('Game Over!');
    setGameEnded(true);
  }, []);

  const handleGameClear = useCallback(() => {
    console.log('Game Clear!');
    setGameEnded(true);
  }, []);

  // レベルと速度の変更ハンドラ
  const handleLevelChange = useCallback((newLevel: number) => {
    const validLevel = Math.max(0, Math.min(24, newLevel));
    setConfigLevel(validLevel);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    const validSpeed = Math.max(0, Math.min(6, newSpeed));
    setConfigSpeed(validSpeed);
  }, []);

  return (
    <div>
      <h3>ドクターまりおもどき</h3>
      <div className="game-container">
        {activeGame && (
          <GameCanvas
            key={activeGame.key}
            level={activeGame.level}
            speed={activeGame.speed}
            isRunning={activeGame.running}
            onGameOver={handleGameOver}
            onGameClear={handleGameClear}
          />
        )}
        <GameControls
          onStartGame={handleStartGame}
          level={configLevel}
          speed={configSpeed}
          onLevelChange={handleLevelChange}
          onSpeedChange={handleSpeedChange}
          isRunning={Boolean(activeGame)}
          gameEnded={gameEnded}
        />
      </div>
    </div>
  );
};

export default App;