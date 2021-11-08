class Dr_mari {
    game;
    onClick() {
        var game = this.game;
        var level = document.getElementById('level').value;
        if(level > 24) level = 24;
        const speed = document.getElementById('speed').value;
        if(game) {
            game.stopTimer();
        }
        this.game = new Field(level, speed);
    }
}

class Field {
    // インスタンス系
    ctx;
    gameField;
    color = ['black', 'red', 'blue', 'yellow'];
    downTimer;
    speedUpTimer;
    image = [new Image(), new Image()];
    bacteriaImage = [new Image(), new Image(), new Image()];

    // イベント系
    dropDownTimer;
    speedUpTimer;
    clearDownTimer;

    // 数値
    medic = {x_1 : 0, y_1 : 0, x_2 : 0, y_2 : 0};
    timer = 700;

    // フラグ系
    flagMove = {up : false, down : false, left : false, right : false};
    timerFlag = false;
    gameOverFlag = false;
    gameClearFlag = false;

    constructor(level, speed) {
        window.onkeydown = (event) => {
            if(this.timerFlag) this.moveMedic(event.code);
        }

        this.timer -= 100 * speed;

        this.image[0].src = "../docMarri/img/gameover.png";
        this.image[1].src = "../docMarri/img/gameclear.png";

        this.bacteriaImage[0].src = "../docMarri/img/akakin.png";
        this.bacteriaImage[1].src = "../docMarri/img/aokin.png";
        this.bacteriaImage[2].src = "../docMarri/img/kikin.png";

        const canvas = document.querySelector('canvas');
        this.ctx = canvas.getContext('2d');

        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(1, 1, 133, 90);
        this.ctx.fillRect(226, 1, 133, 90);
        
        var gameField = new Array(20);
        for(var r = 0; r < gameField.length; r ++) {
            gameField[r] = new Array(8);
        }

        gameField[0][3] = new MedicineAndBug();
        gameField[0][4] = new MedicineAndBug();

        this.gameField = gameField;

        this.bacterialOutbreak(level);
        this.startSpeedUpTimer();
        this.newMedicine();
        this.fieldCheck('down');
    } 

    // 菌配置メソッド
    bacterialOutbreak(level) {
        var gameField = this.gameField;
        var bacterialCount = 4 + (4 * level);
        var createCount = 0;

        const rundField = (level) => {
            var lBound = 15 - Math.ceil(level / 2);
            var row = lBound + Math.floor(Math.random() * (18 - lBound));
            var col = Math.floor(Math.random() * 8);
            return [row, col];
        }

        do {
            var [row, col] = rundField(level);
            if(!gameField[row][col]) {
                gameField[row][col] = new MedicineAndBug();
                if(gameField[row - 2][col]?.color == gameField[row][col].color ||
                gameField[row][col - 2]?.color == gameField[row][col].color ||
                gameField[row + 2][col]?.color == gameField[row][col].color ||
                gameField[row][col + 2]?.color == gameField[row][col].color) {
                    gameField[row][col] = null;
                } else {
                    createCount ++;
                }
            }
        } while (createCount < bacterialCount );
    }

    // 移動アクション後、次の動きに対する制限チェック
    updateMoveFlag() {
        var gameField = this.gameField;
        var flagMove = this.flagMove

        var {x_1, x_2, y_1, y_2} = this.medic;

        var up = x_1 - 1;
        var down = Math.max(x_1, x_2) + 1;
        var left = Math.min(y_1, y_2) - 1;
        var right = Math.max(y_1, y_2) + 1;

        flagMove['up'] = Boolean(gameField[up][left + 1]);
        flagMove['down'] = (gameField[down][y_1] || gameField[down][y_2] || down === 18);
        flagMove['left'] = (gameField[x_1][left] || gameField[x_2][left] || left === -1);
        flagMove['right'] = (gameField[x_1][right] || gameField[x_2][right] || right === 8);
    }

    // 新しい薬の配置と、ゲームオーバーチェック
    newMedicine () {
        var gameField = this.gameField;
        
        if(gameField[2][3]) this.gameOverFlag = true;
        if(gameField[2][4]) this.gameOverFlag = true;
        
        this.medic = {x_1 : 2, y_1 : 3, x_2 : 2, y_2 : 4};
        this.updateMoveFlag();

        var {x_1, x_2, y_1, y_2} = this.medic;

        gameField[x_1][y_1] = Object.assign({}, gameField[0][3]);
        gameField[x_2][y_2] = Object.assign({}, gameField[0][4]);

        gameField[0][3] = new MedicineAndBug(2);
        gameField[0][4] = new MedicineAndBug(2);
    }

    // fieldの状態を確認して次の動作を決定する。
    fieldCheck(key) {
        var gameField = this.gameField;
        var downFlag = this.flagMove['down'];

        this.updateMoveFlag();

        var {x_1, x_2, y_1, y_2} = this.medic;

        if(downFlag && this.flagMove['down'] && key.indexOf('Down') >= 0){
            gameField[1] = new Array(8);

            if(gameField[x_1][y_1] && gameField[x_2][y_2]) {
                gameField[x_1][y_1].pair_x = this.medic.x_2;
                gameField[x_1][y_1].pair_y = this.medic.y_2;
                gameField[x_2][y_2].pair_x = this.medic.x_1;
                gameField[x_2][y_2].pair_y = this.medic.y_1;
            } else {
                x_1 = Math.max(x_1, x_2);
                gameField[x_1][y_1].move = true;
            }
            

            this.medic = {x_1 : 0, y_1 : 0, x_2 : 0, y_2 : 0};
            this.stopTimer();
            this.checkContinue4();
        } else if(!this.timerFlag) {
            this.startTimer();
        }
        this.fieldUpdate();
    }

    // 2次元配列の状態をキャンバスにupdateする
    fieldUpdate() {
        if(this.gameClearFlag) return;
        var gameField = this.gameField;
        var gameClearFlag = true;

        var {x_1, y_1, x_2, y_2} = this.medic;
        gameField.forEach((rows, row) => {
            rows.forEach((cell , col) => {
                if(row == 1) return true;
                if(cell) {
                    if(cell.pair_x || cell.move || (x_1 == row && y_1 == col) || (x_2 == row && y_2 == col) || row == 0) {
                        this.ctx.fillStyle = this.color[cell.color];
                        this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
                    } else {
                        this.ctx.drawImage(this.bacteriaImage[cell?.color - 1], 1 + (col * 45), 1 + (row * 45), 43, 43);
                        gameClearFlag = false;
                    }
                } else if(row != 0 || col != 0) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
                }
            });
        });
        this.gameClearFlag = gameClearFlag;
        if(this.gameOverFlag){
            this.ctx.drawImage(this.image[0], 1, 300, 358, 150);
            clearInterval(this.speedUpTimer);
            clearInterval(this.dropDownTimer);
        }
    }

    // 薬、菌の消去後、下に動けるものを動かすメソッドに対するタイマー
    startClearDownTimer() {
        this.clearDownTimer = setInterval(this.dropdown.bind(this), this.timer);
    }

    // スピードアップさせるためのタイマー
    startSpeedUpTimer() {
        this.speedUpTimer = setInterval(this.resetTimer.bind(this), 60000);
    }

    // 落下速度の再設定
    resetTimer() {
        if(this.timer == 200) {
            clearInterval(this.speedUpTimer);
        } else {
            this.timer -= 100;
            if(this.timerFlag) {
                this.stopTimer();
                this.startTimer();
            }
        }
    }

    // 通常時の落下タイマー
    startTimer() {
        this.dropDownTimer = setInterval(this.moveMedic.bind(this), this.timer);
        this.timerFlag = true;
    }

    // 通常時の落下タイマー削除
    stopTimer() {
        clearInterval(this.dropDownTimer);
        this.timerFlag = false;
    }

    // 4つ以上同じ色の菌、薬が連続する場合削除するメソッド
    checkContinue4() {
        var clearField = [];
        var gameField = this.gameField;

        gameField.forEach((rows, row) => {
            var start = 0;
            var end = 4;
            var count = 3;

            do {
                var continueBox = rows.slice(start, end);
                var continueFlag = true;
                for(var i = 0; i <= count; i++) {
                    if(continueBox[0]?.color != continueBox[i]?.color || 
                        !continueBox[0] || !continueBox[i]) continueFlag = false;
                }
                if(continueFlag) {
                    end++;
                    count++;
                } 
                if(!continueFlag || end == 9){
                    if(count >= 4) {
                        for(var i = start; i < end - 1; i ++) {
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
        for(var col = 0; col < 8; col ++) {
            var cols = gameField.map((rows) => rows[col]);
            var start = 0;
            var end = 4;
            var count = 3;

            do {
                var continueBox = cols.slice(start, end);
                var continueFlag = true;
                for(var i = 0; i <= count; i++) {
                    if(continueBox[0]?.color != continueBox[i]?.color || 
                        !continueBox[0] || !continueBox[i]) continueFlag = false;
                }
                if(continueFlag) {
                    end++;
                    count++;
                } 
                if(!continueFlag || end == 19){
                    if(count >= 4) {
                        for(var i = start; i < end - 1; i ++) {
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
        
        clearField.forEach((address) => {
            if(gameField[address[0]][address[1]] == null) return false;
            const {pair_x, pair_y} = gameField[address[0]][address[1]];
            if(pair_x) {
                gameField[pair_x][pair_y].move = true;
                gameField[pair_x][pair_y].pair_x = null;
            }
            gameField[address[0]][address[1]] = null;
        });
        this.fieldUpdate();
        if(this.gameClearFlag) {
            this.ctx.drawImage(this.image[1], 1, 300, 358, 150);
            clearInterval(this.speedUpTimer);
        } else if(clearField[0]) {
            this.startClearDownTimer();
        } else  {
            this.newMedicine();
            this.fieldUpdate();
            if(!this.timerFlag)this.startTimer();
        }
    }

    // キーの情報を取得して薬を操作するメソッド
    moveMedic (key = 'Down') {   
        if(this.gameOverFlag || this.gameClearFlag) return;
        var gameField = this.gameField;

        var {x_1, x_2, y_1, y_2} = this.medic;
        var {right, left, up, down} = this.flagMove;


        var cell_1 = Object.assign({}, gameField[x_1][y_1]);
        var cell_2 = Object.assign({}, gameField[x_2][y_2]);

        gameField[x_1][y_1] = gameField[x_2][y_2] = null;

        switch(key) {
            case 'ArrowRight':
                if(y_1 + y_2 < 13 && !right) {
                    y_1 ++;
                    y_2 ++;
                }
                break;
            case 'ArrowLeft':
                if(y_1 + y_2 > 1  && !left) {
                    y_1 --;
                    y_2 --;
                }
                break;
            case 'ArrowDown':
                if(!down) this.stopTimer();
            case 'Down':
                if(x_1 + x_2 < 33 && !down) {
                    x_1 ++;
                    x_2 ++;
                }
                break;
            case 'ArrowUp':
                if(y_1 == y_2) {
                    if(left && right) break;
                    if(x_1 < x_2) {
                        x_1++;
                        y_1++;
                    }else{
                        x_2++;
                        y_2++;
                    }
                }else{
                    if(up) break;
                    if(y_1 < y_2) {
                        x_1--;
                        y_2--;
                    }else{
                        x_2--;
                        y_1--;
                    }
                }
                if(y_1 + y_2 == 14 || (y_1 != y_2 && right)) {
                    y_1 --;
                    y_2 --;
                }
        }
        
        gameField[x_1][y_1] = cell_1;
        gameField[x_2][y_2] = cell_2;

        this.medic = {x_1, y_1, x_2, y_2};
        if(x_1 == 0) {
            console.log('A');
        }

        this.fieldCheck(key);
    }

    // 菌、薬が削除された後に、動ける薬が落ちるメソッド
    dropdown () {
        var gameField = this.gameField;
        var loopFlag;
        var underRows;

        for(var row = 17; row > 1; row --) {
            var rows = gameField[row];
            rows.forEach((cell, col) => {
                if(!underRows) return false;
                if(cell && !underRows[col]){
                    if(cell?.move) {
                        underRows[col] = Object.assign({}, cell);
                        gameField[row][col] = null;
                        loopFlag = true;
                    } else if(cell.pair_x &&
                            (!gameField[cell.pair_x + 1][cell.pair_y] || gameField[cell.pair_x][cell.pair_y].pair_y == cell.pair_y)) {
                        underRows[col] = Object.assign({}, cell);
                        gameField[row][col] = null;
                        gameField[cell.pair_x + 1][cell.pair_y] = Object.assign({}, gameField[cell.pair_x][cell.pair_y]);
                        gameField[cell.pair_x][cell.pair_y] = null;

                        underRows[col].pair_x++;
                        gameField[cell.pair_x + 1][cell.pair_y].pair_x++;

                        loopFlag = true;
                    }
                }
            });
            underRows = rows;
        }
        if(loopFlag) {
            this.fieldUpdate();
        } else {
            clearInterval(this.clearDownTimer);
            this.checkContinue4();
        }
    }
}

class MedicineAndBug {
    move = false;
    color = 0;
    pair_x = null;
    pair_y = null;

    constructor(i) {
        this.color = (i == undefined)? Math.floor(Math.random() * 3 + 1): i;
    }
}