let matrixStr = "";
let matrix = [];
for (let row = 0; row < 4; row++) {
    matrix[row] = [];

    for (let col = 0; col < 4; col++) {
        matrix[row][col] = 0;
    }
}
const figureId = $('#figureId').val();
let fig;
$.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/api/getFigure/' + figureId,
    success: function (data) {
        fig = data;
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
    console.log('dofkpoe');
    var id = String($(this).attr('id'));
    var indexes = id.split('-');
    console.log(indexes);
    if (Number(matrix[Number(indexes[0])][Number(indexes[1])]) === 0) {
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

$('#save').on('click', function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                matrixStr += matrix[i][j] + ",";
            }
            matrixStr += "|";
        }
        let errorMessage;
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: '/api/editFigure/' + figureId,
            data: JSON.stringify({"matrix": matrixStr, "level":fig.level}),
            success: function (data) {
                document.location.href = '/figures';
            }, // обработка ответа от сервера
            error: function (jqXHR) {
                if(jqXHR.status === 422){
                    location.reload();
                    errorMessage = 'Такая фигура уже существует';
                }
                else if (jqXHR.status === 400){
                    location.reload();
                    errorMessage = 'Нарушена целостность фигуры';
                }
                else {
                    errorMessage = 'Разорвано соединение с сервером';
                }
            }
        }).fail(function() {
            alert(errorMessage)
        });
});

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