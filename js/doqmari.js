class Doqmari {
    game;
    onClick() {
        this.game = new Field();
    }
}
class Field {
    ctx;
    gameField;
    color = ['black', 'red', 'blue', 'yellow'];
    medicine;
    x_1;
    y_1;
    x_2;
    y_2;
    flagMove = {down : false, left : false, right : false};
    downTimer;
    timerFlag = false;
    constructor() {
        window.onkeydown = (event) => {
            var key = event.code;
            var flagMove = this.flagMove;

            var y_1 = this.y_1;
            var x_2 = this.x_2;
            var x_1 = this.x_1;
            var y_2 = this.y_2;

            var cell_1 = new MedicineAndBug(this.gameField[x_1][y_1].color);
            var cell_2 = new MedicineAndBug(this.gameField[x_2][y_2].color);

            switch(key) {
                case 'ArrowRight':
                    if(y_1 + y_2 < 13 && !flagMove['right']) {
                        this.y_1 ++;
                        this.y_2 ++;
                        break;
                    }
                    return;
                case 'ArrowLeft':
                    if(y_1 + y_2 > 1  && !flagMove['left']) {
                        this.y_1 --;
                        this.y_2 --;
                        break;
                    }
                    return;
                case 'ArrowDown':
                    if(x_1 + x_2 < 33 && !flagMove['down']) {
                        this.downMedic();
                        // this.x_1 ++;
                        // this.x_2 ++;
                        break;
                    }
                    return;
                case 'ArrowUp':
                    if(y_1 == y_2) {
                        if(x_1 < x_2) {
                            this.x_1++;
                            this.y_1++;
                        }else{
                            this.x_2++;
                            this.y_2++;
                        }
                    }else{
                        if(y_1 < y_2) {
                            this.x_1--;
                            this.y_2--;
                        }else{
                            this.x_2--;
                            this.y_1--;
                        }
                    }
                    if(y_1 + y_2 == 14) {
                        this.y_1 --;
                        this.y_2 --;
                    }else if(x_1 + x_2 == 0) {
                        this.x_1 ++;
                        this.x_2 ++;
                    }
                    break;
            }
            this.stopTimer();
            this.gameField[x_1][y_1] = null;
            this.gameField[x_2][y_2] = null;
            
            this.gameField[this.x_1][this.y_1] = cell_1;
            this.gameField[this.x_2][this.y_2] = cell_2;

            this.fieldUpdate();
        }

        const canvas = document.querySelector('canvas');
        this.ctx = canvas.getContext('2d');
        
        var gameField = new Array(20);
        for(var r = 0; r < gameField.length; r ++) {
            gameField[r] = new Array(8);
        }
        this.gameField = gameField;
        
        this.newMedicine();
        this.fieldUpdate();
    }

    startTimer() {
        this.downTimer = setInterval(this.downMedic.bind(this), 1000);
        this.timerFlag = true;
    }

    stopTimer() {
        clearInterval(this.downTimer);
        this.timerFlag = false;
    }    

    fieldUpdate() {
        var gameField = this.gameField;

        var x_1 = this.x_1;
        var x_2 = this.x_2;
        var y_1 = this.y_1;
        var y_2 = this.y_2;

        var down = Math.max(x_1, x_2) + 1;
        var left = Math.min(y_1, y_2) - 1;
        var right = Math.max(y_1, y_2) + 1;
        this.flagMove['down'] = (gameField[down][y_1] || gameField[down][y_2] || down === 18);
        this.flagMove['left'] = (gameField[x_1][left] || gameField[x_2][left] || left === -1);
        this.flagMove['right'] = (gameField[x_1][right] || gameField[x_2][right] || right === 8);


        if(this.flagMove['down']) this.newMedicine();

        gameField.forEach((rows, row) => {
            rows.forEach((cell , col) => {
                this.ctx.fillStyle = (this.color[cell?.color]) ? this.color[cell.color] :'black';
                this.ctx.fillRect(1 + (col * 30), 1 + (row * 30), 28, 28);
            });
        });
        if(!this.timerFlag) this.startTimer();
    }

    downMedic () {    
        var y_1 = this.y_1;
        var x_2 = this.x_2;
        var x_1 = this.x_1;
        var y_2 = this.y_2;

        var cell_1 = new MedicineAndBug(this.gameField[x_1][y_1].color);
        var cell_2 = new MedicineAndBug(this.gameField[x_2][y_2].color);

        this.gameField[x_1][y_1] = null;
        this.gameField[x_2][y_2] = null;

        this.x_1++;
        this.x_2++;
        
        this.gameField[this.x_1][this.y_1] = cell_1;
        this.gameField[this.x_2][this.y_2] = cell_2;

        this.fieldUpdate();
    }

    newMedicine () {
        var gameField = this.gameField;
        this.x_1 = 0;
        this.x_2 = 0;
        this.y_1 = 3;
        this.y_2 = 4;

        gameField[this.x_1][this.y_1] = new MedicineAndBug();
        gameField[this.x_2][this.y_2] = new MedicineAndBug();
    }
}

class MedicineAndBug {
    move = false;
    color = 0;

    constructor(i) {
        this.color = (i == undefined)? Math.floor(Math.random() * 3 + 1): i;
    }
}