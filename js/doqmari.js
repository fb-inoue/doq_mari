class Doqmari {
    game;
    onClick() {
        var game = this.game;
        const txtbox = document.getElementById('level');
        if(game) {
            game.stopTimer();
        }
        this.game = new Field(txtbox.value);
    }
}

const color = ['black', 'red', 'blue', 'yellow'];

class Field {
    // インスタンス系
    ctx;
    gameField;
    color = color;
    downTimer;
    image = [new Image(), new Image()];
    bacteriaImage = [new Image(), new Image(), new Image()];

    // 数値
    medic = {x_1 : 0, y_1 : 0, x_2 : 0, y_2 : 0};
    timer = 700;

    // フラグ系
    flagMove = {up : false, down : false, left : false, right : false};
    timerFlag = false;
    gameOverFlag = false;
    gameClearFlag = false;

    constructor(level) {
        window.onkeydown = (event) => {
            this.moveMedic(event.code);
        }

        this.image[0].src = "../doq_mari/img/gameover.png";
        this.image[1].src = "../doq_mari/img/gameclear.png";

        this.bacteriaImage[0].src = "../doq_mari/img/akakin.png";
        this.bacteriaImage[1].src = "../doq_mari/img/aokin.png";
        this.bacteriaImage[2].src = "../doq_mari/img/kikin.png";



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
        
        this.newMedicine();
        this.fieldCheck('down');
    } 

    bacterialOutbreak(level) {
        var gameField = this.gameField;
        var bacterialCount = 4 + (4 * level);

        const rundField = (level) => {
            var lBound = 16 - Math.ceil(level / 2);
            var row = lBound + Math.floor(Math.random() * (18 - lBound));
            var col = Math.floor(Math.random() * 8);
            return [row, col];
        }

        for(var i = 0; i < bacterialCount; i++) {
            var createFlag = true;
            do {
                var [row, col] = rundField(level);
                if(!gameField[row][col]) {
                    gameField[row][col] = new MedicineAndBug();
                    createFlag = false;
                }
            } while (createFlag);
        }
    }

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

    newMedicine () {
        var gameField = this.gameField;
        
        if(gameField[2][3]) this.gameOverFlag = true;
        if(gameField[2][4]) this.gameOverFlag = true;
        
        this.medic = {x_1 : 2, y_1 : 3, x_2 : 2, y_2 : 4};
        this.updateMoveFlag();

        var {x_1, x_2, y_1, y_2} = this.medic;

        gameField[x_1][y_1] = Object.assign({}, gameField[0][3]);
        gameField[x_2][y_2] = Object.assign({}, gameField[0][4]);

        gameField[0][3] = new MedicineAndBug();
        gameField[0][4] = new MedicineAndBug();
    }

    fieldCheck(key) {
        var gameField = this.gameField;
        var downFlag = this.flagMove['down'];

        this.updateMoveFlag();

        var {x_1, x_2, y_1, y_2} = this.medic;

        if(downFlag && this.flagMove['down'] && key.indexOf('Down') >= 0){
            gameField[x_1][y_1].pair_x = this.medic.x_2;
            gameField[x_1][y_1].pair_y = this.medic.y_2;
            gameField[x_2][y_2].pair_x = this.medic.x_1;
            gameField[x_2][y_2].pair_y = this.medic.y_1;

            this.medic = {x_1 : 0, y_1 : 0, x_2 : 0, y_2 : 0};

            var loopFlag = false;
            loopFlag = this.checkContinue4()
            do {
                this.dropdown();

                loopFlag = this.checkContinue4()
            } while(loopFlag);
            this.newMedicine();
        }

        this.fieldUpdate();

        if(this.gameOverFlag){
            this.stopTimer();
            this.ctx.drawImage(this.image[0], 1, 300, 358, 150);
        } else if(this.gameClearFlag) {
            this.stopTimer();
            this.ctx.drawImage(this.image[1], 1, 300, 358, 150);
        }else if (!this.timerFlag) {
            this.startTimer();
        }
    }

    fieldUpdate() {
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
                } else {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
                }
            });
        });
        this.gameClearFlag = gameClearFlag;
    }

    startTimer() {
        this.downTimer = setInterval(this.moveMedic.bind(this), this.timer);
        this.timerFlag = true;
    }

    stopTimer() {
        clearInterval(this.downTimer);
        this.timerFlag = false;
    }

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
        var flag = false;
        if(clearField[0]) flag = true;

        return flag;
    }

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

        this.fieldCheck(key);
    }

    dropdown () {
        var gameField = this.gameField;
        var loopFlag;
        var underRows;
        do {
            // doではスコープが効かない気がします。
            underRows = null;
            loopFlag = false;
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
            // if(loopFlag) {
            //     this.fieldUpdate();
            //     this.sleep();
            // }
        } while(loopFlag);
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