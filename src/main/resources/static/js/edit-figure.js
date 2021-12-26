let matrixStr = "";
let matrix = [];
for (let row = 0; row < 4; row++) {
    matrix[row] = [];

    for (let col = 0; col < 4; col++) {
        matrix[row][col] = 0;
    }
}
const figureId = $('#figureId').val();
$.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/api/getFigure/' + figureId,
    success: function (data) {
        matrix = getMatrixFromStr(data.matrix);
        console.log(matrix);
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++){
                console.log($('#' + i + '-' + j));
                if (matrix[i][j] === '1'){
                    $('#' + i + '-' + j).css("background-color", "red");
                    $('#' + i + '-' + j).css("color", "red");
                }
            }
        }
    }
})

$('td').on('click', function () {
    var id = String($(this).attr('id'));
    var indexes = id.split('-');
    if (matrix[Number(indexes[0])][Number(indexes[1])] === 0) {
        $(this).css("background-color", "red");
        $(this).css("color", "red");
        matrix[Number(indexes[0])][Number(indexes[1])] = 1;
    }
    else
    {
        $(this).css("background-color", "white");
        $(this).css("color", "white");
        matrix[Number(indexes[0])][Number(indexes[1])] = 0;
    }
})

$('.save').on('click', function () {
    if (check(matrix)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                matrixStr += matrix[i][j] + ",";
            }
            matrixStr += "|";
        }
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: '/api/editFigure/' + figureId,
            data: JSON.stringify({"matrix": matrixStr}),
            success: function (data) {
                document.location.href = '/figures';
            }, // обработка ответа от сервера
            error: function (jqXHR) {
                if(jqXHR.status === 422){
                    location.reload();
                    alert('Такая фигура уже существует');
                }
                else if (jqXHR.status === 400){
                    location.reload();
                    alert('Нарушена целостность фигуры');
                }
            }
        });
    }
    else{
        alert("Нарушена целостность фигуры!");
    }
});

function check(matrix){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (matrix[i][j] === 1){
                if (i !== 0 && i !== 3 && j !== 0 && j !== 3) {
                    if ((matrix[i - 1][j] === 0) && (matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                        return false;
                }
                else if (i === 0){
                    if (j === 0)
                    {
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                    else if (j === 3){
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0))
                            return false;
                    }
                    else{
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                }
                else if (i === 3){
                    if (j === 3)
                    {
                        if ((matrix[i - 1][j] === 0) && (matrix[i][j - 1] === 0))
                            return false;
                    }
                    else if (j === 0){
                        if ((matrix[i + 1][j] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                    else{
                        if ((matrix[i - 1][j] === 0) && (matrix[i][j - 1] === 0) && (matrix[i][j + 1] === 0))
                            return false;
                    }
                }
            }
        }
    }
    return true;
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
                    matrix[i][j] = column;
                }
                j++;
            })
        }
        i++;
    })
    return matrix;
}