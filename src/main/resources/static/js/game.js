// получаем доступ к холсту
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
// размер квадратика
const grid = 32;
// массив с последовательностями фигур, на старте — пустой
var tetrominoSequence = [];
var nowDate = new Date();
var time;
var t = 0;
let tetromino;
let nextTetromino;
let rAF;
let gameOver;
var level = $('#levelId').val();

var results = 0;

//загружаем фигуры по уровню сложности
let tetrominos = [];
for (let i = Number(level); i > -1; i--) {
    $.ajax({
        type: 'GET',
        contentType: "application/json",
        url: '/api/figures/' + i,
        success: function (data) {
            let j = 0;
            data.forEach(function (fig) {
                var matrix = getMatrixFromStr(fig.matrix);
                var id = fig.id;
                tetrominos.push({
                    'name' : String(id + 'F') ,
                    'matrix' : matrix,
                    'color' : colors[getRandomInt(0, 6)]
                })
                j++;
            });

        }, // обработка ответа от сервера
        error: function (jqXHR) {
            alert('Ошибка выполнения');
        },
        complete: function () {
            console.log('Завершение выполнения');
            tetromino = getNextTetromino();
            //следующая фигура
            nextTetromino = getNextTetromino();
            printNextFig(nextTetromino)
            // следим за кадрами анимации, чтобы если что — остановить игру
            rAF = null;
            // флаг конца игры, на старте — неактивный
            gameOver = false;
        }
    });
}

// с помощью двумерного массива следим за тем, что находится в каждой клетке игрового поля
// размер поля, и несколько строк ещё находится за видимой областью
var playfield = [];

var speed = $('#speed').val();
speed = Number(speed) / 2;
$('#game').attr('height', 32 * height);
$('#game').attr('width', 32 * width);
$('#result').text(0);
const bg = document.getElementById('gridBG');
const contextbg = bg.getContext('2d');
var height = $('#height').val();
var width = $('#width').val();
$('#game').attr('height', 32 * height);
$('#game').attr('width', 32 * width);
$('#gridBG').attr('height', 32 * height);
$('#gridBG').attr('width', 32 * width);
if ($('#grid').val() === '1') {
    for (var x = grid; x < 32 * width; x += 32) {
        contextbg.strokeStyle = "#888";
        contextbg.moveTo(x, 0);
        contextbg.lineTo(x, grid * height);
        contextbg.stroke();
    }

    for (var y = grid; y < 32 * height; y += 32) {
        contextbg.strokeStyle = "#888";
        contextbg.moveTo(0, y);
        contextbg.lineTo(grid * width, y);
        contextbg.stroke();
    }
}

// заполняем сразу массив пустыми ячейками
for (let row = -2; row < height; row++) {
    playfield[row] = [];

    for (let col = 0; col < width; col++) {
        playfield[row][col] = 0;
    }
}

if ($('#stat').val() === '1') {
    $('#time').prop('hidden', true);
    $('#l-time').prop('hidden', true);
}
else if ($('#stat').val() === '2'){
    $('#result').prop('hidden', true);
    $('#l-result').prop('hidden', true);
    setInterval(setTimer, 1000);
}
else{
    $('#result').prop('hidden', true);
    $('#l-result').prop('hidden', true);
    $('#time').prop('hidden', true);
    $('#l-time').prop('hidden', true);
}

function getMatrixFromStr(str){
    var matrix = [];
    for (let row = 0; row < 4; row++) {
        matrix[row] = [];
        for (let col = 0; col < 4; col++) {
            matrix[row][col] = 0;
        }
    }
    let rows = str.split('|', 4);
    let i = 0;
    rows.forEach (row => {
        if (row) {
            let j = 0;
            let columns = row.split(',');
            columns.forEach(column => {
                if (column) {
                    matrix[i][j] = Number(column);
                }
                j++;
            })
        }
        i++;
    })
    return matrix;
}

/*let tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};*/

// цвет каждой фигуры
const colors = [
    'cyan',
    'yellow',
    'purple',
    'green',
    'red',
    'blue',
    'orange'
];

// счётчик
let count = 0;
// текущая фигура в игре


function setTimer(){
    t++;
    let minutes = Math.floor(t / 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let sec = t % 60;
    sec = sec < 10 ? '0' + sec : sec;
    $('#time').text(minutes + ":" + sec);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// создаём последовательность фигур, которая появится в игре
//https://tetris.fandom.com/wiki/Random_Generator
function generateSequence() {
    // тут — сами фигуры
    const sequence = [];
    for (let i = 0; i < tetrominos.length; i++){
        sequence.push(String(tetrominos[i].name));
    }

    while (sequence.length) {
        // случайным образом находим любую из них
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        // помещаем выбранную фигуру в игровой массив с последовательностями
        tetrominoSequence.push(String(name));
    }
}

// получаем следующую фигуру
function getNextTetromino() {
    // если следующей нет — генерируем
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }
    // берём первую фигуру из массива
    const name = String(tetrominoSequence.pop());
    // сразу создаём матрицу, с которой мы отрисуем фигуру
    const matrix = tetrominos.find(item => item.name === String(name)).matrix;
    const color1 = tetrominos.find(item => item.name === String(name)).color;

    // I и O стартуют с середины, остальные — чуть левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = -2;

    // вот что возвращает функция
    return {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартую за видимой областью холста)
        col: col,        // текущий столбец
        color: color1
    };
}

//отрисовываем следующую фигуру
function printNextFig(tetr){
    if ($('#next').val() === '1') {
        $('#nextFig tbody').empty();
        for (var i = 0; i < tetr.matrix.length; i++) {
            $('#nextFig').append('<tr class="figure-tr' + i + '"></tr>');
            for (var j = 0; j < tetr.matrix.length; j++) {
                if (tetr.matrix[i][j] === 0) {
                    $('.figure-tr' + i).append('<td style="color:white; width: 23pt; height: 23pt;">0000</td>');
                } else {
                    $('.figure-tr' + i).append('<td style="width: 23pt; height: 23pt;background-color:' + tetr.color + '; color:' + tetr.color + '">1111</td>');
                }
            }
        }
    }else{
        $('#nextFig').prop('hidden', true);
    }
}

// поворачиваем матрицу на 90 градусов
// https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    // на входе матрица, и на выходе тоже отдаём матрицу
    return result;
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
    // проверяем все строки и столбцы
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // если выходит за границы поля…
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // …или пересекается с другими фигурами
                playfield[cellRow + row][cellCol + col])
            ) {
                // то возвращаем, что нет, так не пойдёт
                return false;
            }
        }
    }
    // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
    return true;
}

// когда фигура окончательна встала на своё место
function placeTetromino() {
    // обрабатываем все строки и столбцы в игровом поле
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {

                // если край фигуры после установки вылезает за границы поля, то игра закончилась
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }
                // если всё в порядке, то записываем в массив игрового поля нашу фигуру
                playfield[tetromino.row + row][tetromino.col + col] = String(tetromino.name);
            }
        }
    }

    // проверяем, чтобы заполненные ряды очистились снизу вверх
    for (let row = playfield.length - 1; row >= 0; ) {
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {
            if(level === '1')
                results += 10;
            else if(level.val() === '2')
                results += 15;
            else
                results += 20;
            $('#result').text(results);
            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
        }
        else {
            // переходим к следующему ряду
            row--;
        }
    }
    // получаем следующую фигуру
    tetromino = nextTetromino;
    nextTetromino = getNextTetromino();
    printNextFig(nextTetromino);
}

// показываем надпись Game Over
function showGameOver() {
    // прекращаем всю анимацию игры
    cancelAnimationFrame(rAF);
    // ставим флаг окончания
    gameOver = true;
    var endDate = new Date();
    time = endDate.getTime() - nowDate.getTime();
    $('.modal').addClass('active');
    if ($('#stat').val() === '1') {
        $('.results').append(results);
        $('#timeLabel').prop('hidden', true);
    }
    else if ($('#stat').val() === '2') {
        $('#resLabel').prop('hidden', true);
        let minutes = Math.floor(time / 60000);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let secs = Math.floor((time % 60000) / 1000);
        secs = secs < 10 ? '0' + secs : secs;
        $('.time').append(minutes + ":" + secs);
    }
    else{
        $('#timeLabel').prop('hidden', true);
        $('#resLabel').prop('hidden', true);
        $('#yes').prop('hidden', true);
        $('#no').text('Хорошо');
        $('#no').css('width', '78px');
        $('.par').css('align-items', 'center');
        $('.par').css('justify-content', 'center');
    }
}

$('#yes').on('click', function (event) {
    event.preventDefault();
    if ($('#stat').val() === '2')
        results = -1;
    else
        time = 0;
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/api/saveResults',
        data: JSON.stringify({"result": results, "time": time}),
        success: function(data) { console.log(data); }, // обработка ответа от сервера
        complete: function() { console.log('Завершение выполнения'); }
    });
    document.location.href = '/statistic'
})

// главный цикл игры
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // очищаем холст
    context.clearRect(0,0,canvas.width, canvas.height);
    // рисуем игровое поле с учётом заполненных фигур
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (playfield[row][col]) {
                const name = String(playfield[row][col]);
                context.fillStyle = tetrominos.find(item => item.name === String(name)).color;
                // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    // рисуем текущую фигуру
    if (tetromino) {
        // фигура сдвигается вниз каждые 35 кадров

        console.log(speed);
        if (++count > 40 / (2 * speed)) {
            tetromino.row++;

            count = 0;

            // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        // не забываем про цвет текущей фигуры
        context.fillStyle = tetromino.color;

        // отрисовываем её
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {
                    // и снова рисуем на один пиксель меньше
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

// следим за нажатиями на клавиши
document.addEventListener('keydown', function(e) {
    // если игра закончилась — сразу выходим
    if (gameOver) return;

    // стрелки влево и вправо
    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
            // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
            ? tetromino.col - 1
            : tetromino.col + 1;

        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.which === 38) {
        // поворачиваем фигуру на 90 градусов
        const matrix = rotate(tetromino.matrix);
        // если так ходить можно — запоминаем
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if(e.which === 40) {
        // смещаем фигуру на строку вниз
        const row = tetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку, куда стала фигура
        tetromino.row = row;
    }
});

// старт игры
rAF = requestAnimationFrame(loop);