function main() {
    var cols = 100;
    var rows = 100;
    var canvas = document.getElementById('board');
    var game = new Game(cols, rows, canvas, boardInitializer);

    game.run();
}


function boardInitializer(i, j) {
    return Math.random() > 0.85 ? 1 : 0;
}


function Game(rows, cols, canvas, initializer) {
    var matrix = new ToroidalMatrix(rows, cols, 0);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            matrix.cell(i, j, initializer(i, j));
        }
    }

    this.canvasCtx = canvas.getContext('2d');
    this.matrix = matrix;
}


Game.prototype.draw = function() {
    var matrix = this.matrix;
    var canvasCtx = this.canvasCtx;
    var cellHeight = canvasCtx.canvas.height / matrix.rows;
    var cellWidth = canvasCtx.canvas.width / matrix.cols;

    for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.cols; j++) {
            var cell = matrix.cell(i, j);

            canvasCtx.fillStyle = cell ? '#000000' : '#FFFFFF';
            canvasCtx.fillRect(j * cellWidth,
                               i * cellHeight,
                               (j + 1) * cellWidth,
                               (i + 1) * cellHeight);
        }
    }
}


Game.prototype.step = function() {
    var matrix = this.matrix;
    var newMatrix = new ToroidalMatrix(matrix.rows, matrix.cols, 0);

    function cellStep(i, j) {
        var count = neighboursCount(i, j);

        if (matrix.cell(i, j)) {
            if (count < 2) return 0;
            if (count < 4) return 1;
            return 0;
        } else {
            return count === 3 ? 1 : 0;
        }
    }

    function neighboursCount(i, j) {
        return matrix.cell(i - 1, j - 1) +
               matrix.cell(i - 1, j)     +
               matrix.cell(i - 1, j + 1) +
               matrix.cell(i    , j - 1) +
               matrix.cell(i    , j + 1) +
               matrix.cell(i + 1, j - 1) +
               matrix.cell(i + 1, j)     +
               matrix.cell(i + 1, j + 1)
    }


    for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.cols; j++) {
            newMatrix.cell(i, j, cellStep(i, j));
        }
    }

    this.matrix = newMatrix;
}



Game.prototype.run = function() {
    this.draw();
    this.step();
    setTimeout(Game.prototype.run.bind(this), 100);
}


function ToroidalMatrix(rows, cols, initial) {
    var len = rows * cols;
    var matrix = new Array(len);

    for (var i = 0; i < len; i++) {
        matrix[i] = initial;
    }

    this.matrix = matrix;
    this.cols = cols;
    this.rows = rows;
}


ToroidalMatrix.prototype.cell = function(i, j, v) {
    var pos = (Math.abs(i) % this.rows) * this.cols + Math.abs(j) % this.cols;

    return v !== undefined ? (this.matrix[pos] = v) : this.matrix[pos];
}


main();
