import { GameField, Medic, MedicineAndBugType, MoveFlags } from '../types';
import { MedicineAndBug } from './MedicineAndBug';

export class Field {
  // インスタンス系
  ctx: CanvasRenderingContext2D | null = null;
  gameField: GameField = [];
  color = ['black', 'red', 'blue', 'yellow'];
  downTimer?: NodeJS.Timeout;
  speedUpTimer?: NodeJS.Timeout;
  image = [new Image(), new Image()];
  bacteriaImage = [new Image(), new Image(), new Image()];

  // イベント系
  dropDownTimer?: NodeJS.Timeout;
  clearDownTimer?: NodeJS.Timeout;

  // 数値
  medic: Medic = { x_1: 0, y_1: 0, x_2: 0, y_2: 0 };
  timer = 700;

  // フラグ系
  flagMove: MoveFlags = { up: false, down: false, left: false, right: false };
  timerFlag = false;
  gameOverFlag = false;
  gameClearFlag = false;
  
  // コールバック
  onGameOver: () => void;
  onGameClear: () => void;

  constructor(
    canvasRef: HTMLCanvasElement,
    level: number,
    speed: number,
    onGameOver: () => void,
    onGameClear: () => void
  ) {
    this.onGameOver = onGameOver;
    this.onGameClear = onGameClear;
    this.ctx = canvasRef.getContext('2d');
    if (!this.ctx) return;

    this.setupEventListeners();
    this.timer -= 100 * speed;

    // Load images
    this.image[0].src = '/img/gameover.png';
    this.image[1].src = '/img/gameclear.png';

    this.bacteriaImage[0].src = '/img/akakin.png';
    this.bacteriaImage[1].src = '/img/aokin.png';
    this.bacteriaImage[2].src = '/img/kikin.png';

    this.ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(1, 1, 133, 90);
    this.ctx.fillRect(226, 1, 133, 90);

    // Initialize game field
    var gameField: GameField = Array(20).fill(null).map(() => Array(8).fill(null));
    
    gameField[0][3] = new MedicineAndBug();
    gameField[0][4] = new MedicineAndBug();

    this.gameField = gameField;

    this.bacterialOutbreak(level);
    this.startSpeedUpTimer();
    this.newMedicine();
    this.fieldCheck('Down');
  }

  setupEventListeners() {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (this.timerFlag) this.moveMedic(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }

  // 菌配置メソッド
  bacterialOutbreak(level: number) {
    const gameField = this.gameField;
    const bacterialCount = 4 + (4 * level);
    let createCount = 0;

    const rundField = (level: number): [number, number] => {
      const lBound = 15 - Math.ceil(level / 2);
      const row = lBound + Math.floor(Math.random() * (18 - lBound));
      const col = Math.floor(Math.random() * 8);
      return [row, col];
    };

    do {
      const [row, col] = rundField(level);
      if (!gameField[row][col]) {
        gameField[row][col] = new MedicineAndBug();
        
        // Check surrounding cells
        const sameColorAbove = gameField[row - 2]?.[col]?.color === gameField[row][col]?.color;
        const sameColorLeft = gameField[row]?.[col - 2]?.color === gameField[row][col]?.color;
        const sameColorBelow = gameField[row + 2]?.[col]?.color === gameField[row][col]?.color;
        const sameColorRight = gameField[row]?.[col + 2]?.color === gameField[row][col]?.color;
        
        if (sameColorAbove || sameColorLeft || sameColorBelow || sameColorRight) {
          gameField[row][col] = null;
        } else {
          createCount++;
        }
      }
    } while (createCount < bacterialCount);
  }

  // 移動アクション後、次の動きに対する制限チェック
  updateMoveFlag() {
    const gameField = this.gameField;
    const flagMove = this.flagMove;
    const { x_1, x_2, y_1, y_2 } = this.medic;

    const up = x_1 - 1;
    const down = Math.max(x_1, x_2) + 1;
    const left = Math.min(y_1, y_2) - 1;
    const right = Math.max(y_1, y_2) + 1;

    flagMove.up = Boolean(gameField[up]?.[left + 1]);
    flagMove.down = Boolean(gameField[down]?.[y_1] || gameField[down]?.[y_2] || down === 18);
    flagMove.left = Boolean(gameField[x_1]?.[left] || gameField[x_2]?.[left] || left === -1);
    flagMove.right = Boolean(gameField[x_1]?.[right] || gameField[x_2]?.[right] || right === 8);
  }

  // 新しい薬の配置と、ゲームオーバーチェック
  newMedicine() {
    const gameField = this.gameField;
    
    if (gameField[2][3]) this.gameOverFlag = true;
    if (gameField[2][4]) this.gameOverFlag = true;
    
    this.medic = { x_1: 2, y_1: 3, x_2: 2, y_2: 4 };
    this.updateMoveFlag();

    const { x_1, x_2, y_1, y_2 } = this.medic;

    gameField[x_1][y_1] = Object.assign({}, gameField[0][3]);
    gameField[x_2][y_2] = Object.assign({}, gameField[0][4]);

    gameField[0][3] = new MedicineAndBug();
    gameField[0][4] = new MedicineAndBug();
  }

  // fieldの状態を確認して次の動作を決定する。
  fieldCheck(key: string) {
    if (!this.ctx) return;
    
    const gameField = this.gameField;
    const downFlag = this.flagMove.down;

    this.updateMoveFlag();

    const { x_1, x_2, y_1, y_2 } = this.medic;

    if (downFlag && this.flagMove.down && key.indexOf('Down') >= 0) {
      gameField[1] = new Array(8).fill(null);

      if (gameField[x_1][y_1] && gameField[x_2][y_2]) {
        const cell1 = gameField[x_1][y_1] as MedicineAndBugType;
        const cell2 = gameField[x_2][y_2] as MedicineAndBugType;
        
        cell1.pair_x = this.medic.x_2;
        cell1.pair_y = this.medic.y_2;
        cell2.pair_x = this.medic.x_1;
        cell2.pair_y = this.medic.y_1;
      } else {
        const maxX = Math.max(x_1, x_2);
        if (gameField[maxX][y_1]) {
          (gameField[maxX][y_1] as MedicineAndBugType).move = true;
        }
      }

      this.medic = { x_1: 0, y_1: 0, x_2: 0, y_2: 0 };
      this.stopTimer();
      this.checkContinue4();
    } else if (!this.timerFlag) {
      this.startTimer();
    }
    
    this.fieldUpdate();
  }

  // 2次元配列の状態をキャンバスにupdateする
  fieldUpdate() {
    if (!this.ctx) return;
    if (this.gameClearFlag) return;
    
    const gameField = this.gameField;
    let gameClearFlag = true;

    const { x_1, y_1, x_2, y_2 } = this.medic;
    
    gameField.forEach((rows, row) => {
      rows.forEach((cell, col) => {
        if (row === 1) return true;
        
        if (cell) {
          if (cell.pair_x || cell.move || (x_1 === row && y_1 === col) || (x_2 === row && y_2 === col) || row === 0) {
            if (this.ctx) {
              this.ctx.fillStyle = this.color[cell.color];
              this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
            }
          } else {
            if (this.ctx && cell.color - 1 >= 0 && cell.color - 1 < this.bacteriaImage.length) {
              this.ctx.drawImage(this.bacteriaImage[cell.color - 1], 1 + (col * 45), 1 + (row * 45), 43, 43);
              gameClearFlag = false;
            }
          }
        } else if (row !== 0 || col !== 0) {
          if (this.ctx) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
          }
        }
      });
    });
    
    this.gameClearFlag = gameClearFlag;
    
    if (this.gameOverFlag) {
      if (this.ctx) {
        this.ctx.drawImage(this.image[0], 1, 300, 358, 150);
      }
      
      clearInterval(this.speedUpTimer);
      clearInterval(this.dropDownTimer);
      this.onGameOver();
    } else if (this.gameClearFlag) {
      if (this.ctx) {
        this.ctx.drawImage(this.image[1], 1, 300, 358, 150);
      }
      
      clearInterval(this.speedUpTimer);
      this.onGameClear();
    }
  }

  // 薬、菌の消去後、下に動けるものを動かすメソッドに対するタイマー
  startClearDownTimer() {
    this.clearDownTimer = setInterval(() => this.dropdown(), this.timer);
  }

  // スピードアップさせるためのタイマー
  startSpeedUpTimer() {
    this.speedUpTimer = setInterval(() => this.resetTimer(), 60000);
  }

  // 落下速度の再設定
  resetTimer() {
    if (this.timer === 200) {
      clearInterval(this.speedUpTimer);
    } else {
      this.timer -= 100;
      if (this.timerFlag) {
        this.stopTimer();
        this.startTimer();
      }
    }
  }

  // 通常時の落下タイマー
  startTimer() {
    this.dropDownTimer = setInterval(() => this.moveMedic(), this.timer);
    this.timerFlag = true;
  }

  // 通常時の落下タイマー削除
  stopTimer() {
    clearInterval(this.dropDownTimer);
    this.timerFlag = false;
  }

  // 4つ以上同じ色の菌、薬が連続する場合削除するメソッド
  checkContinue4() {
    const clearField: [number, number][] = [];
    const gameField = this.gameField;

    // Check horizontal continuity
    gameField.forEach((rows, row) => {
      let start = 0;
      let end = 4;
      let count = 3;

      do {
        const continueBox = rows.slice(start, end);
        let continueFlag = true;
        
        for (let i = 0; i <= count; i++) {
          if (continueBox[0]?.color !== continueBox[i]?.color || !continueBox[0] || !continueBox[i]) {
            continueFlag = false;
          }
        }
        
        if (continueFlag) {
          end++;
          count++;
        }
        
        if (!continueFlag || end === 9) {
          if (count >= 4) {
            for (let i = start; i < end - 1; i++) {
              clearField.push([row, i]);
            }
            start = end - 1;
            end += 3;
            count = 3;
          } else {
            start++;
            end++;
          }
        }
      } while (end <= 9);
    });

    // Check vertical continuity
    for (let col = 0; col < 8; col++) {
      const cols = gameField.map((rows) => rows[col]);
      let start = 0;
      let end = 4;
      let count = 3;

      do {
        const continueBox = cols.slice(start, end);
        let continueFlag = true;
        
        for (let i = 0; i <= count; i++) {
          if (continueBox[0]?.color !== continueBox[i]?.color || !continueBox[0] || !continueBox[i]) {
            continueFlag = false;
          }
        }
        
        if (continueFlag) {
          end++;
          count++;
        }
        
        if (!continueFlag || end === 19) {
          if (count >= 4) {
            for (let i = start; i < end - 1; i++) {
              clearField.push([i, col]);
            }
            start = end - 1;
            end += 3;
            count = 3;
          } else {
            start++;
            end++;
          }
        }
      } while (end <= 19);
    }
    
    // Clear cells
    clearField.forEach(([row, col]) => {
      if (gameField[row][col] === null) return false;
      
      const cell = gameField[row][col] as MedicineAndBugType;
      const { pair_x, pair_y } = cell;
      
      if (pair_x !== null && pair_y !== null && gameField[pair_x][pair_y]) {
        (gameField[pair_x][pair_y] as MedicineAndBugType).move = true;
        (gameField[pair_x][pair_y] as MedicineAndBugType).pair_x = null;
      }
      
      gameField[row][col] = null;
    });
    
    this.fieldUpdate();
    
    if (this.gameClearFlag) {
      if (this.ctx) {
        this.ctx.drawImage(this.image[1], 1, 300, 358, 150);
      }
      clearInterval(this.speedUpTimer);
      this.onGameClear();
    } else if (clearField.length > 0) {
      this.startClearDownTimer();
    } else {
      this.newMedicine();
      this.fieldUpdate();
      if (!this.timerFlag) this.startTimer();
    }
  }

  // キーの情報を取得して薬を操作するメソッド
  moveMedic(key: string = 'Down') {
    if (this.gameOverFlag || this.gameClearFlag) return;
    
    const gameField = this.gameField;
    let { x_1, x_2, y_1, y_2 } = this.medic;
    const { right, left, up, down } = this.flagMove;

    const cell_1 = Object.assign({}, gameField[x_1][y_1]);
    const cell_2 = Object.assign({}, gameField[x_2][y_2]);

    gameField[x_1][y_1] = gameField[x_2][y_2] = null;

    switch (key) {
      case 'ArrowRight':
        if (y_1 + y_2 < 13 && !right) {
          y_1++;
          y_2++;
        }
        break;
      case 'ArrowLeft':
        if (y_1 + y_2 > 1 && !left) {
          y_1--;
          y_2--;
        }
        break;
      case 'ArrowDown':
        if (!down) this.stopTimer();
      case 'Down':
        if (x_1 + x_2 < 33 && !down) {
          x_1++;
          x_2++;
        }
        break;
      case 'ArrowUp':
        if (y_1 === y_2) {
          if (left && right) break;
          if (x_1 < x_2) {
            x_1++;
            y_1++;
          } else {
            x_2++;
            y_2++;
          }
        } else {
          if (up) break;
          if (y_1 < y_2) {
            x_1--;
            y_2--;
          } else {
            x_2--;
            y_1--;
          }
        }
        if (y_1 + y_2 === 14 || (y_1 !== y_2 && right)) {
          y_1--;
          y_2--;
        }
    }
    
    gameField[x_1][y_1] = cell_1;
    gameField[x_2][y_2] = cell_2;

    this.medic = { x_1, y_1, x_2, y_2 };

    this.fieldCheck(key);
  }

  // 菌、薬が削除された後に、動ける薬が落ちるメソッド
  dropdown() {
    const gameField = this.gameField;
    let loopFlag = false;
    let underRows: (MedicineAndBugType | null)[] | undefined;

    for (let row = 17; row > 1; row--) {
      const rows = gameField[row];
      
      rows.forEach((cell, col) => {
        if (!underRows) return false;
        
        if (cell && !underRows[col]) {
          if (cell.move) {
            underRows[col] = Object.assign({}, cell);
            gameField[row][col] = null;
            loopFlag = true;
          } else if (
            cell.pair_x !== null &&
            cell.pair_y !== null &&
            (!gameField[cell.pair_x + 1]?.[cell.pair_y] || 
             (gameField[cell.pair_x][cell.pair_y] as MedicineAndBugType)?.pair_y === cell.pair_y)
          ) {
            underRows[col] = Object.assign({}, cell);
            gameField[row][col] = null;
            
            if (cell.pair_x !== null && cell.pair_y !== null) {
              gameField[cell.pair_x + 1][cell.pair_y] = Object.assign({}, gameField[cell.pair_x][cell.pair_y]);
              gameField[cell.pair_x][cell.pair_y] = null;

              if (underRows[col]) {
                (underRows[col] as MedicineAndBugType).pair_x = (cell.pair_x || 0) + 1;
              }
              
              if (gameField[cell.pair_x + 1][cell.pair_y]) {
                (gameField[cell.pair_x + 1][cell.pair_y] as MedicineAndBugType).pair_x = (cell.pair_x || 0) + 1;
              }
            }

            loopFlag = true;
          }
        }
      });
      
      underRows = rows;
    }
    
    if (loopFlag) {
      this.fieldUpdate();
    } else {
      clearInterval(this.clearDownTimer);
      this.checkContinue4();
    }
  }

  // Clean up method
  cleanup() {
    clearInterval(this.dropDownTimer);
    clearInterval(this.speedUpTimer);
    clearInterval(this.clearDownTimer);
  }
}