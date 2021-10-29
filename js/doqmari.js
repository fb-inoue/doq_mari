class Doqmari {
    game;
    onClick() {
        var game = this.game;
        if(game) {
            game.stopTimer();
        }
        this.game = new Field();
    }
}

const color = ['black', 'red', 'blue', 'yellow'];

class Field {
    // インスタンス系
    ctx;
    gameField;
    color = color;
    downTimer;
    image;

    // 数値
    medic = {x_1 : 0, y_1 : 0, x_2 : 0, y_2 : 0};
    x_1;
    y_1;
    x_2;
    y_2;
    timer = 1000;

    // フラグ系
    flagMove = {up : false, down : false, left : false, right : false};
    timerFlag = false;
    gameOverFlag = false;

    constructor() {
        window.onkeydown = (event) => {
            this.moveMedic(event.code);
        }

        this.image = new Image();
        this.image.src = "../doq_mari/img/gameover.jpg";

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
        this.gameField = gameField;
        
        this.newMedicine();
        this.fieldCheck('down');
    } 

    updateMoveFlag() {
        var gameField = this.gameField;

        var {x_1, x_2, y_1, y_2} = this.medic;

        var up = x_1 + 1;
        var down = Math.max(x_1, x_2) + 1;
        var left = Math.min(y_1, y_2) - 1;
        var right = Math.max(y_1, y_2) + 1;

        this.flagMove['up'] = Boolean(gameField[up][left]);
        this.flagMove['down'] = (gameField[down][y_1] || gameField[down][y_2] || down === 18);
        this.flagMove['left'] = (gameField[x_1][left] || gameField[x_2][left] || left === -1);
        this.flagMove['right'] = (gameField[x_1][right] || gameField[x_2][right] || right === 8);
    }

    newMedicine () {
        var gameField = this.gameField;
        
        if(gameField[2][3]) this.gameOverFlag = true;
        if(gameField[2][4]) this.gameOverFlag = true;

        var color_1 = gameField[0][3]?.color? gameField[0][3]?.color: undefined;
        var color_2 = gameField[0][4]?.color? gameField[0][4]?.color: undefined;
        
        this.medic = {x_1 : 2, y_1 : 3, x_2 : 2, y_2 : 4};
        this.updateMoveFlag();

        var {x_1, x_2, y_1, y_2} = this.medic;

        gameField[x_1][y_1] = new MedicineAndBug(color_1);
        gameField[x_2][y_2] = new MedicineAndBug(color_2);

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

            this.checkContinue4();
            this.newMedicine();
        }

        this.fieldUpdate()

        if(this.gameOverFlag){
            this.stopTimer();
            this.ctx.drawImage(this.image, 1, 300, 358, 200);
        }else if (!this.timerFlag) {
            this.startTimer();
        }
    }

    fieldUpdate() {
        var gameField = this.gameField;

        gameField.forEach((rows, row) => {
            rows.forEach((cell , col) => {
                if(row == 1) return true;
                this.ctx.fillStyle = (this.color[cell?.color]) ? this.color[cell.color] :'black';
                this.ctx.fillRect(1 + (col * 45), 1 + (row * 45), 43, 43);
            });
        });
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
            if(pair_x != 1) {
                gameField[pair_x][pair_y].move = true;
                gameField[pair_x][pair_y].pair_x = 1;
            }
            gameField[address[0]][address[1]] = null;
        });
    }

    moveMedic (key = 'Down') {   
        if(this.gameOverFlag) return;
        var flagMove = this.flagMove;
        var gameField = this.gameField;

        var {x_1, x_2, y_1, y_2} = this.medic;


        var cell_1 = Object.assign({}, gameField[x_1][y_1]);
        var cell_2 = Object.assign({}, gameField[x_2][y_2]);

        gameField[x_1][y_1] = gameField[x_2][y_2] = null;

        switch(key) {
            case 'ArrowRight':
                if(y_1 + y_2 < 13 && !flagMove['right']) {
                    y_1 ++;
                    y_2 ++;
                }
                break;
            case 'ArrowLeft':
                if(y_1 + y_2 > 1  && !flagMove['left']) {
                    y_1 --;
                    y_2 --;
                }
                break;
            case 'ArrowDown':
                if(!flagMove['down']) this.stopTimer();
            case 'Down':
                if(x_1 + x_2 < 33 && !flagMove['down']) {
                    x_1 ++;
                    x_2 ++;
                }
                break;
            case 'ArrowUp':
                if(y_1 == y_2) {
                    if(this.flagMove['left'] && this.flagMove['right']) break;
                    if(x_1 < x_2) {
                        x_1++;
                        y_1++;
                    }else{
                        if(this.flagMove['up']) break;
                        x_2++;
                        y_2++;
                    }
                }else{
                    if(y_1 < y_2) {
                        x_1--;
                        y_2--;
                    }else{
                        x_2--;
                        y_1--;
                    }
                }
                if(y_1 + y_2 == 14 || (y_1 != y_2 && this.flagMove['right'])) {
                    y_1 --;
                    y_2 --;
                }
        }
        
        gameField[x_1][y_1] = cell_1;
        gameField[x_2][y_2] = cell_2;

        this.medic = {x_1, y_1, x_2, y_2};

        this.fieldCheck(key);
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